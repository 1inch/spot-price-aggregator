const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { AaveWrapperV2, PancakeV3, Uniswap, UniswapV2, UniswapV3 },
    testRate,
    testRateOffchainOracle,
} = require('../helpers.js');

describe('UniswapV3LikeOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        const pancakeV3Oracle = await deployContract('UniswapV3LikeOracle', [PancakeV3.factory, PancakeV3.initcodeHash, PancakeV3.fees]);
        return { uniswapV2LikeOracle, uniswapV3Oracle, pancakeV3Oracle };
    }

    describe('UniswapV3', function () {
        it('DAI -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.DAI, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('WETH -> DAI', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.DAI, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('WETH -> USDT', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDT, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('USDT -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDT, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('UNI -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.UNI, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('WETH -> UNI', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.UNI, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('AAVE -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.AAVE, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('WETH -> AAVE', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.AAVE, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('WETH -> USDC -> DAI', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.DAI, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('DAI -> USDC -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.DAI, tokens.WETH, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });
    });

    describe('PancakeV3', function () {
        it('WETH -> USDT', async function () {
            const { uniswapV2LikeOracle, pancakeV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDT, tokens.NONE, uniswapV2LikeOracle, pancakeV3Oracle);
        });

        it('USDT -> WETH', async function () {
            const { uniswapV2LikeOracle, pancakeV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDT, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, pancakeV3Oracle);
        });

        it('WETH -> USDC', async function () {
            const { uniswapV2LikeOracle, pancakeV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDC, tokens.NONE, uniswapV2LikeOracle, pancakeV3Oracle);
        });

        it('USDC -> WETH', async function () {
            const { uniswapV2LikeOracle, pancakeV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDC, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, pancakeV3Oracle);
        });

        it('WETH -> USDC -> USDT', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDT, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('USDT -> USDC -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDT, tokens.WETH, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });
    });
});

describe('UniswapV3LikeOracle doesn\'t ruin rates', function () {
    async function initContracts () {
        const [deployer] = await ethers.getSigners();

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        const uniswapOracle = await deployContract('UniswapOracle', [Uniswap.factory]);
        const mooniswapOracle = await deployContract('MooniswapOracle', [tokens.oneInchLP1]);

        const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.ETH, tokens.WETH]);
        const aaveWrapperV1 = await deployContract('AaveWrapperV1');
        const aaveWrapperV2 = await deployContract('AaveWrapperV2', [AaveWrapperV2.lendingPool]);
        await aaveWrapperV1.addMarkets([tokens.DAI]);
        await aaveWrapperV2.addMarkets([tokens.DAI]);
        const multiWrapper = await deployContract('MultiWrapper', [
            [
                wethWrapper,
                aaveWrapperV1,
                aaveWrapperV2,
            ],
            deployer,
        ]);

        const oldOffchainOracle = await deployContract('OffchainOracle', [
            multiWrapper,
            [
                uniswapV2LikeOracle,
                uniswapOracle,
                mooniswapOracle,
            ],
            [
                '0',
                '1',
                '2',
            ],
            [
                tokens.NONE,
                tokens.ETH,
                tokens.WETH,
                tokens.USDC,
                tokens.DAI,
            ],
            tokens.WETH,
            deployer.address,
        ]);

        const deployOffchainOracle = await deployContract('OffchainOracle', [
            multiWrapper,
            [
                uniswapV2LikeOracle,
                uniswapOracle,
                mooniswapOracle,
                uniswapV3Oracle,
            ],
            [
                '0',
                '1',
                '2',
                '0',
            ],
            [
                tokens.NONE,
                tokens.ETH,
                tokens.WETH,
                tokens.USDC,
                tokens.DAI,
            ],
            tokens.WETH,
            deployer.address,
        ]);
        return { oldOffchainOracle, deployOffchainOracle };
    }

    it('ETH -> DAI', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.ETH, tokens.DAI, oldOffchainOracle, deployOffchainOracle);
    });

    it('DAI -> ETH', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.DAI, tokens.ETH, oldOffchainOracle, deployOffchainOracle);
    });

    it('WETH -> DAI', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.WETH, tokens.DAI, oldOffchainOracle, deployOffchainOracle);
    });

    it('DAI -> WETH', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.DAI, tokens.WETH, oldOffchainOracle, deployOffchainOracle);
    });

    it('USDC -> DAI', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.USDC, tokens.DAI, oldOffchainOracle, deployOffchainOracle);
    });

    it('DAI -> USDC', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.DAI, tokens.USDC, oldOffchainOracle, deployOffchainOracle);
    });

    it('USDC -> WETH', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.USDC, tokens.WETH, oldOffchainOracle, deployOffchainOracle);
    });

    it('WETH -> USDC', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRateOffchainOracle(tokens.WETH, tokens.USDC, oldOffchainOracle, deployOffchainOracle);
    });
});
