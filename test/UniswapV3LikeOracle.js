const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { deployContract, assertRoughlyEqualValues } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { AaveWrapperV2, PancakeV3, Uniswap, UniswapV2, UniswapV3 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

describe('UniswapV3LikeOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        const pancakeV3Oracle = await deployContract('UniswapV3LikeOracle', [PancakeV3.factory, PancakeV3.initcodeHash, PancakeV3.fees]);
        return { uniswapV2LikeOracle, uniswapV3Oracle, pancakeV3Oracle };
    }

    describe('UniswapV3', function () {
        it('dai -> weth', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.DAI, tokens.WETH, tokens.NONE, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('weth -> dai', async function () {
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

        it('weth -> usdc -> dai', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.DAI, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('dai -> usdc -> weth', async function () {
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

        it('weth -> usdc -> usdt', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.WETH, tokens.USDT, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });

        it('usdt -> usdc -> weth', async function () {
            const { uniswapV2LikeOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await testRate(tokens.USDT, tokens.WETH, tokens.USDC, uniswapV2LikeOracle, uniswapV3Oracle);
        });
    });

    async function testRate (srcToken, dstToken, connector, uniswapV2LikeOracle, uniswapV3LikeOracle) {
        const v2Result = await uniswapV2LikeOracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        const v3Result = await uniswapV3LikeOracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        assertRoughlyEqualValues(v3Result.rate.toString(), v2Result.rate.toString(), 0.05);
    }
});

describe('UniswapV3LikeOracle doesn\'t ruin rates', function () {
    async function initContracts () {
        const deployer = await ethers.getSigner();

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        const uniswapOracle = await deployContract('UniswapOracle', [Uniswap.factory]);
        const mooniswapOracle = await deployContract('MooniswapOracle', [tokens.oneInchLP1]);

        const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.WETH]);
        const aaveWrapperV1 = await deployContract('AaveWrapperV1');
        const aaveWrapperV2 = await deployContract('AaveWrapperV2', [AaveWrapperV2.lendingPool]);
        await aaveWrapperV1.addMarkets([tokens.DAI]);
        await aaveWrapperV2.addMarkets([tokens.DAI]);
        const multiWrapper = await deployContract('MultiWrapper', [[
            wethWrapper.address,
            aaveWrapperV1.address,
            aaveWrapperV2.address,
        ]]);

        const oldOffchainOracle = await deployContract('OffchainOracle', [
            multiWrapper.address,
            [
                uniswapV2LikeOracle.address,
                uniswapOracle.address,
                mooniswapOracle.address,
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
            multiWrapper.address,
            [
                uniswapV2LikeOracle.address,
                uniswapOracle.address,
                mooniswapOracle.address,
                uniswapV3Oracle.address,
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

    it('ETH DAI', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.ETH, tokens.DAI, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    it('WETH DAI', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.DAI, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    it('USDC DAI', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.DAI, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    it('USDC WETH', async function () {
        const { oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.WETH, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    async function testRate (srcToken, dstToken, thresholdFilter, oldOffchainOracle, deployOffchainOracle) {
        const expectedRate = await oldOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const actualRate = await deployOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const expectedReverseRate = await oldOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const actualReverseRate = await deployOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        assertRoughlyEqualValues(actualRate.toString(), expectedRate.toString(), 0.05);
        assertRoughlyEqualValues(actualReverseRate.toString(), expectedReverseRate.toString(), 0.05);
    }
});
