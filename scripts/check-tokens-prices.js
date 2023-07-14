const { ethers } = require('hardhat');

const usdPrice = (ethPrice) => { return ethers.utils.formatEther(BigInt(Math.trunc(ethPrice)) * BigInt(process.env.SCRIPT_ETH_PRICE)); };

async function main () {
    if (!process.env.SCRIPT_ETH_PRICE) {
        throw new Error('Specify SCRIPT_ETH_PRICE');
    }
    const tokenlistPath = process.env.SCRIPT_TOKENLIST;
    const networkName = process.env.SCRIPT_NETWORK_NAME || 'mainnet';
    const skipOracles = (process.env.SCRIPT_SKIP_ORACLES || '').split(',');
    const addOracles = (process.env.SCRIPT_ADD_ORACLES || '').split('|');
    const thresholdFilter = 10;

    let tokenlist = require(tokenlistPath);
    if (!Array.isArray(tokenlist)) {
        tokenlist = Object.keys(tokenlist);
    }

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

    console.log('======================');

    const oracles = await deployedOffchainOracle.oracles();
    for (let i = 0; i < oracles.allOracles.length; i++) {
        if (skipOracles.indexOf(oracles.allOracles[i]) !== -1) {
            continue;
        }
        await offchainOracle.addOracle(oracles.allOracles[i], oracles.oracleTypes[i]);
    }

    for (let i = 0; i < addOracles.length; i++) {
        if (addOracles[i] === '') continue;

        const config = addOracles[i].split(':');
        const Oracle = await ethers.getContractFactory(config[0]);
        const oracleConstructorParams = config[2] ? JSON.parse(config[2]) : [];
        const oracle = await Oracle.deploy(...oracleConstructorParams);
        await oracle.deployed();

        await offchainOracle.addOracle(oracle.address, config[1]);
    }

    const tokenPrices = [];
    for (let i = 0; i < tokenlist.length; i++) {
        const token = await ethers.getContractAt('IERC20Metadata', tokenlist[i]);

        let tokenDecimals = 18;
        try {
            tokenDecimals = await token.decimals();
        } catch {}

        clearAndPrint(`Progress: ${i} / ${tokenlist.length}`);
        const getRateToEthDeployedOracle = isDeployedOracleWithFilter
            ? () => deployedOffchainOracle.getRateToEthWithThreshold(token.address, true, thresholdFilter)
            : () => deployedOffchainOracle.getRateToEth(token.address, true);
        const deployedOraclePrice = await getRateToEthDeployedOracle();
        const currentImplPrice = await offchainOracle.getRateToEthWithThreshold(token.address, true, thresholdFilter);

        const currentImplPriceUsd = parseFloat(usdPrice(currentImplPrice / 10 ** (18 - tokenDecimals))).toFixed(2);
        const deployedOraclePriceUsd = parseFloat(usdPrice(deployedOraclePrice / 10 ** (18 - tokenDecimals))).toFixed(2);
        const diff = (parseFloat(currentImplPriceUsd) - parseFloat(deployedOraclePriceUsd)).toFixed(2);

        tokenPrices.push([
            token.address,
            deployedOraclePriceUsd, // price in deployed oracle
            currentImplPriceUsd, // price in oracle with current implementation
            diff, // diff
        ]);
    }
    clearAndPrint('');
    console.table(tokenPrices);
    console.log('Finished');
}

function clearAndPrint (message) {
    if (typeof process.stdout.clearLine !== 'function') {
        console.log(message);
    } else {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
