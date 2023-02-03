const { ethers } = require('hardhat');
const { tokens } = require('../test/helpers');

const usdPrice = (ethPrice) => { return ethers.utils.formatEther(BigInt(ethPrice) * BigInt(process.env.ETH_PRICE) / BigInt(1e18)); };

async function main () {
    if (!process.env.ETH_PRICE) {
        throw new Error('Specify ETH_PRICE');
    }

    const networkName = process.env.NETWORK_NAME || 'mainnet';
    const token = process.env.TOKEN || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracleInDeployments = require(`../deployments/${networkName}/OffchainOracle.json`);
    const deployedOffchainOracle = OffchainOracle.attach(offchainOracleInDeployments.address);

    const weth = offchainOracleInDeployments.args[4];
    const connectors = await deployedOffchainOracle.connectors();

    const offchainOracle = await OffchainOracle.deploy(
        await deployedOffchainOracle.multiWrapper(),
        [],
        [],
        connectors,
        weth,
    );
    await offchainOracle.deployed();

    console.log('======================');
    console.log('Current state\'s price =', usdPrice(await offchainOracle.getRateToEth(token, true)));

    const oracles = await deployedOffchainOracle.oracles();
    for (let i = 0; i < oracles.allOracles.length; i++) {
        await offchainOracle.addOracle(oracles.allOracles[i], oracles.oracleTypes[i]);

        const price = usdPrice(await offchainOracle.getRateToEth(token, true));
        if (parseFloat(price) !== 0) {
            console.log(oracles.allOracles[i], 'oracle\'s price =', price);

            const oracle = await ethers.getContractAt('OracleBase', oracles.allOracles[i]);
            const pricesViaConnector = [];
            for (let j = 0; j < connectors.length; j++) {
                let symbol;
                try {
                    if (tokens.NONE === connectors[j]) symbol = 'NONE';
                    else if (tokens.ETH === connectors[j]) symbol = 'ETH';
                    else if (tokens.EEE === connectors[j]) symbol = 'EEE';
                    else symbol = await (await ethers.getContractAt('IERC20Metadata', connectors[j])).symbol();

                    const { rate, weight } = await oracle.getRate(token, weth, connectors[j]);
                    pricesViaConnector.push({ connector: symbol, rate: usdPrice(rate), weight: weight.toString() });
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
