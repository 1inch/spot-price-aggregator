const { ethers } = require('hardhat');
const { tokens } = require('../test/helpers');

const usdPrice = (ethPrice) => { return ethers.utils.formatEther(BigInt(Math.trunc(ethPrice)) * BigInt(process.env.SCRIPT_ETH_PRICE)); };

async function main () {
    if (!process.env.SCRIPT_ETH_PRICE) {
        throw new Error('Specify SCRIPT_ETH_PRICE');
    }

    const networkName = process.env.SCRIPT_NETWORK_NAME || 'mainnet';
    const token = process.env.SCRIPT_TOKEN || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const thresholdFilter = 10;

    const deployer = await ethers.getSigner();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracleInDeployments = require(`../deployments/${networkName}/OffchainOracle.json`);
    const deployedOffchainOracle = OffchainOracle.attach(offchainOracleInDeployments.address);
    const isDeployedOracleWithFilter = !!offchainOracleInDeployments.devdoc.methods['getRateToEthWithThreshold(address,bool,uint256)'];

    const weth = offchainOracleInDeployments.args[4];
    const connectors = await deployedOffchainOracle.connectors();

    const offchainOracle = await OffchainOracle.deploy(
        await deployedOffchainOracle.multiWrapper(),
        [],
        [],
        connectors,
        weth,
        deployer.address,
    );
    await offchainOracle.deployed();

    let decimals = 18;
    try {
        decimals = await (await ethers.getContractAt('IERC20Metadata', token)).decimals();
    } catch {}

    console.log('======================');
    const getRateToEthDeployedOracle = isDeployedOracleWithFilter
        ? () => deployedOffchainOracle.getRateToEthWithThreshold(token, true, thresholdFilter)
        : () => deployedOffchainOracle.getRateToEth(token, true);

    console.log('Current state\'s price =', usdPrice(await getRateToEthDeployedOracle() / 10 ** (18 - decimals)));

    const getRateToEth = isDeployedOracleWithFilter
        ? offchainOracle.getRateToEthWithThreshold
        : offchainOracle.getRateToEth;
    const oracles = await deployedOffchainOracle.oracles();
    for (let i = 0; i < oracles.allOracles.length; i++) {
        await offchainOracle.addOracle(oracles.allOracles[i], oracles.oracleTypes[i]);

        const getRateParams = [token, true];
        if (isDeployedOracleWithFilter) {
            getRateParams.push(thresholdFilter);
        }
        const price = usdPrice(await getRateToEth(...getRateParams) / 10 ** (18 - decimals));
        if (parseFloat(price) !== 0) {
            console.log(oracles.allOracles[i], 'oracle\'s price =', price);

            const oracle = await ethers.getContractAt('OracleBase', oracles.allOracles[i]);
            const pricesViaConnector = [];
            for (let j = 0; j < connectors.length; j++) {
                let symbol = '---';
                try {
                    if (tokens.NONE === connectors[j]) symbol = 'NONE';
                    else if (tokens.ETH === connectors[j]) symbol = 'ETH';
                    else if (tokens.EEE === connectors[j]) symbol = 'EEE';
                    else symbol = await (await ethers.getContractAt('IERC20Metadata', connectors[j])).symbol();

                    const { rate, weight } = await oracle.getRate(token, weth, connectors[j]);
                    pricesViaConnector.push({ connector: symbol, rate: parseFloat(usdPrice(rate / 10 ** (18 - decimals))).toFixed(2), weight: weight.toString() });
                } catch {}
            }
            console.table(pricesViaConnector.sort((a, b) => { return parseFloat(b.rate) - parseFloat(a.rate); }));
        }

        await offchainOracle.removeOracle(oracles.allOracles[i], oracles.oracleTypes[i]);
    }
    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
