const { ethers, deployments } = require('hardhat');
const { tokens } = require('../test/helpers');
const { ether, constants } = require('@1inch/solidity-utils');

const usdPrice = (ethPrice) => { return ethers.utils.formatEther(BigInt(Math.trunc(ethPrice)) * BigInt(process.env.SCRIPT_ETH_PRICE)); };

async function main () {
    if (!process.env.SCRIPT_ETH_PRICE) {
        throw new Error('Specify SCRIPT_ETH_PRICE');
    }
    const token = process.env.SCRIPT_TOKEN || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const thresholdFilter = 10;

    const allDeployments = await deployments.all();
    const contractNameByAddress = {};
    Object.keys(allDeployments).forEach(function(contractName) {
        contractNameByAddress[allDeployments[contractName].address] = contractName;
    });

    const offchainOracleInDeployments = await deployments.get('OffchainOracle');
    const deployer = await ethers.getSigner();
    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const deployedOffchainOracle = OffchainOracle.attach(offchainOracleInDeployments.address);

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
    console.log('Current state\'s price =', usdPrice(await deployedOffchainOracle.getRateToEthWithThreshold(token, true, thresholdFilter) / 10 ** (18 - decimals)));

    const oracles = await deployedOffchainOracle.oracles();
    for (let i = 0; i < oracles.allOracles.length; i++) {
        await offchainOracle.addOracle(oracles.allOracles[i], oracles.oracleTypes[i]);

        const price = usdPrice(await offchainOracle.getRateToEthWithThreshold(token, true, thresholdFilter) / 10 ** (18 - decimals));
        if (parseFloat(price) !== 0) {
            console.log('----------------------');
            console.log(`Oracle:  ${contractNameByAddress[oracles.allOracles[i]]}`);
            console.log(`Address: ${oracles.allOracles[i]}`);
            console.log(`Price =  ${parseFloat(price).toFixed(2)}`);

            const oracle = await ethers.getContractAt('OracleBase', oracles.allOracles[i]);
            const pricesViaConnector = [];
            let pools = [];
            for (let j = 0; j < connectors.length; j++) {
                let symbol = '---';
                try {
                    if (tokens.NONE === connectors[j]) symbol = 'NONE';
                    else if (tokens.ETH === connectors[j]) symbol = 'ETH';
                    else if (tokens.EEE === connectors[j]) symbol = 'EEE';
                    else symbol = await (await ethers.getContractAt('IERC20Metadata', connectors[j])).symbol();

                    const { rate, weight } = await oracle.getRate(token, weth, connectors[j], thresholdFilter);
                    pricesViaConnector.push({ connector: symbol, rate: parseFloat(usdPrice(rate / 10 ** (18 - decimals))).toFixed(2), weight: weight.toString() });

                    // Check pools in factory
                    try {
                        pools = await checkPools({
                            oracle: oracles.allOracles[i],
                            connector: connectors[j],
                            connectorSymbol: symbol,
                            token,
                            weth,
                            contractNameByAddress,
                            allDeployments,
                        });
                    } catch (e) {
                        console.log(e)
                    }

                } catch {}
            }

            console.table(pricesViaConnector.sort((a, b) => { return parseFloat(b.rate) - parseFloat(a.rate); }));
            pools.forEach((pool) => {
                console.dir(pool, { depth: null });
            });
        }

        await offchainOracle.removeOracle(oracles.allOracles[i], oracles.oracleTypes[i]);
    }
    console.log('Finished');
}

async function checkPools ({
    oracle,
    connector,
    connectorSymbol,
    token,
    weth,
    contractNameByAddress,
    allDeployments,
}) {
    const pools = [];
    const contract = allDeployments[contractNameByAddress[oracle]];
    if (!contract) {
        return ['No deployments for oracle'];
    }
    if (contractNameByAddress[oracle].indexOf('UniswapV2LikeOracle') !== -1) {
        if (connector === tokens.NONE) {
            pools.push({
                connector: connectorSymbol,
                pools: [
                    await UniswapV2LikeOracle_createPoolObject(
                        await ethers.getContractAt('IUniswapV2Pair', getPoolUniswapV2(contract.args[0], contract.args[1], token, weth)),
                    )
                ],
            });
        } else {
            pools.push({
                connector: connectorSymbol,
                pools: [
                    await UniswapV2LikeOracle_createPoolObject(
                        await ethers.getContractAt('IUniswapV2Pair', getPoolUniswapV2(contract.args[0], contract.args[1], token, connector)),
                    ),
                    await UniswapV2LikeOracle_createPoolObject(
                        await ethers.getContractAt('IUniswapV2Pair', getPoolUniswapV2(contract.args[0], contract.args[1], connector, weth)),
                    ),
                ],
            });
        }
    } else if (contractNameByAddress[oracle].indexOf('UniswapV3Oracle') !== -1) {
        const uniswapV3Oracle = await ethers.getContractAt('UniswapV3Oracle', contract.address);
        const fees = [100, 500, 3000, 10000];

        const uniV3PoolsInfo = [];
        const factory = await uniswapV3Oracle.FACTORY();
        const initcodeHash = await uniswapV3Oracle.POOL_INIT_CODE_HASH();
        for (let i = 0; i < fees.length; i++) {
            const uniV3PoolAddress = getPoolUniswapV3(factory, initcodeHash, token, weth, fees[i])
            if (await ethers.provider.getCode(uniV3PoolAddress) === '0x') {
                continue;
            }
            const uniV3PoolContract = await ethers.getContractAt('IUniswapV3Pool', uniV3PoolAddress);
            const slot0 = await uniV3PoolContract.slot0();
            const tick = slot0.tick;
            const liquidity = await uniV3PoolContract.liquidity();

            const reserve0 = liquidity / sqrt(1.0001 ^ tick);
            const reserve1 = liquidity * sqrt(1.0001 ^ tick);

            uniV3PoolsInfo.push({
                address: uniV3PoolAddress,
                liquidity: liquidity.toString(),
                reserves: {
                    reserve0: reserve0.toString(),
                    reserve1: reserve1.toString(),
                },
                fee: fees[i],
            });
        }
        pools.push({
            connector: connectorSymbol,
            pools: uniV3PoolsInfo,
        });
    }
    return pools;
}

function getPoolUniswapV2 (factory, initcodeHash, token0, token1) {
    return ethers.utils.getCreate2Address(
        factory,
        ethers.utils.keccak256(ethers.utils.solidityPack(['address', 'address'], [token0, token1])),
        initcodeHash
    );
}

function getPoolUniswapV3 (factory, initcodeHash, token0, token1, fee) {
    const encodedParams = ethers.utils.solidityPack(
        ['bytes1', 'address', 'bytes32', 'bytes32'],
        [
            '0xff',
            factory,
            ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address', 'address', 'uint24'], [token0, token1, fee])),
            initcodeHash
        ]
    );
    const keccakHash = ethers.utils.keccak256(encodedParams);
    const uint256 = ethers.BigNumber.from('0x' + keccakHash.slice(2));
    const uint160 = ethers.BigNumber.from('0x' + uint256.toHexString().slice(-40));
    return ethers.utils.getAddress('0x' + uint160.toHexString().slice(2));
}

async function UniswapV2LikeOracle_createPoolObject (poolContract) {
    let poolObj = {};
    try {
        const reserves = await poolContract.getReserves();
        poolObj = {
            address: poolContract.address,
            liquidity: sqrt(BigInt(reserves[0].toString()) * BigInt(reserves[1].toString())).toString(),
            reserves: {
                reserve0: reserves[0].toString(),
                reserve1: reserves[1].toString(),
            },
        };
    } catch (e) {
        poolObj = {
            error: e.message,
        }
    }
    return poolObj;
}

function sqrt(value) {
    if (value < 0n) {
        throw 'square root of negative numbers is not supported'
    }

    if (value < 2n) {
        return value;
    }

    function newtonIteration(n, x0) {
        const x1 = ((n / x0) + x0) >> 1n;
        if (x0 === x1 || x0 === (x1 - 1n)) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, 1n);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
