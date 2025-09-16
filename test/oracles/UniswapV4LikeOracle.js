const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { UniswapV2, UniswapV4, Uniswap, AaveWrapperV2 },
    testRate,
    testRateOffchainOracle,
} = require('../helpers.js');

describe('UniswapV4LikeOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV4Oracle = await deployContract('UniswapV4LikeOracle', [UniswapV4.stateView, UniswapV4.fees, UniswapV4.tickSpacings]);
        return { uniswapV2LikeOracle, uniswapV4Oracle };
    }

    describe('UniswapV4', function () {
        it('USDC -> USDT', async function () {
            const { uniswapV2LikeOracle, uniswapV4Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDC, tokens.USDT, tokens.NONE, uniswapV2LikeOracle, uniswapV4Oracle);
        });

        it('USDT -> USDC', async function () {
            const { uniswapV2LikeOracle, uniswapV4Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDT, tokens.USDC, tokens.NONE, uniswapV2LikeOracle, uniswapV4Oracle);
        });

        it('USDC -> WETH', async function () {
            const { uniswapV2LikeOracle, uniswapV4Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDC, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV4Oracle);
        });

        it('WETH -> USDC', async function () {
            const { uniswapV2LikeOracle, uniswapV4Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDC, tokens.NONE, uniswapV2LikeOracle, uniswapV4Oracle);
        });
    });
});

describe('UniswapV4LikeOracle doesn\'t ruin rates', function () {
    async function initContracts () {
        const [deployer] = await ethers.getSigners();

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV4Oracle = await deployContract('UniswapV4LikeOracle', [UniswapV4.stateView, UniswapV4.fees, UniswapV4.tickSpacings]);
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
                uniswapV4Oracle,
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
