const { ethers, deployments } = require('hardhat');
const { tokens } = require('../test/helpers');

const usdPrice = (ethPrice, srcTokenDecimals) => { return parseFloat(parseFloat(ethPrice) * 10 ** srcTokenDecimals / 1e18 / 1e18 * parseFloat(process.env.SCRIPT_ETH_PRICE)).toFixed(2); };

async function main () {
    if (!process.env.SCRIPT_ETH_PRICE) {
        throw new Error('Specify SCRIPT_ETH_PRICE');
    }
    const token = process.env.SCRIPT_TOKEN || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const isConnectorsZeroPrice = (process.env.SCRIPT_CONNECTORS_ZERO_PRICE || 'false').toLowerCase() === 'true';
    const thresholdFilter = process.env.SCRIPT_THRESHOLD_FILTER || 10;

    const allDeployments = await deployments.all();
    const contractNameByAddress = {};
    Object.keys(allDeployments).forEach(function (contractName) {
        contractNameByAddress[allDeployments[contractName].address] = contractName;
    });

    const offchainOracleInDeployments = await deployments.get('OffchainOracle');
    const [deployer] = await ethers.getSigners();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const deployedOffchainOracle = OffchainOracle.attach(offchainOracleInDeployments.address);

    const weth = offchainOracleInDeployments.args[4];
    const connectors = await deployedOffchainOracle.connectors();

    const offchainOracle = await OffchainOracle.deploy(
        await deployedOffchainOracle.multiWrapper(),
        [],
        [],
        [...connectors],
        weth,
        deployer.address,
    );
    await offchainOracle.waitForDeployment();

    let decimals = 18;
    try {
        decimals = parseFloat(await (await ethers.getContractAt('IERC20Metadata', token)).decimals());
    } catch {}

    console.log('======================');
    const currentPrice = parseFloat(await deployedOffchainOracle.getRateToEthWithThreshold(token, true, thresholdFilter));
    console.log('Current state\'s price =', usdPrice(currentPrice, decimals));

    const oracles = await deployedOffchainOracle.oracles();
    for (let i = 0; i < oracles.allOracles.length; i++) {
        await offchainOracle.addOracle(oracles.allOracles[i], oracles.oracleTypes[i]);

        const price = await offchainOracle.getRateToEthWithThreshold(token, true, thresholdFilter);
        if (parseFloat(price) !== 0) {
            const oracle = await ethers.getContractAt('OracleBase', oracles.allOracles[i]);
            const pricesViaConnector = [];
            for (let j = 0; j < connectors.length; j++) {
                let symbol = '---';
                try {
                    if (tokens.NONE === connectors[j]) symbol = 'NONE';
                    else if (tokens.ETH === connectors[j]) symbol = 'ETH';
                    else if (tokens.EEE === connectors[j]) symbol = 'EEE';
                    else symbol = await (await ethers.getContractAt('IERC20Metadata', connectors[j])).symbol();

                    const { rate, weight } = await oracle.getRate(token, weth, connectors[j], thresholdFilter);
                    if (!isConnectorsZeroPrice && parseFloat(rate) === 0) {
                        continue;
                    }
                    pricesViaConnector.push({ connector: symbol, rate: usdPrice(rate, decimals), weight: weight.toString() });
                } catch {}
            }

            if (pricesViaConnector.length > 0) {
                console.log('----------------------');
                console.log(`Oracle:  ${contractNameByAddress[oracles.allOracles[i]]}`);
                console.log(`Address: ${oracles.allOracles[i]}`);
                console.log(`Price =  ${usdPrice(price, decimals)}`);
                console.table(pricesViaConnector.sort((a, b) => { return parseFloat(b.rate) - parseFloat(a.rate); }));
            }
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
