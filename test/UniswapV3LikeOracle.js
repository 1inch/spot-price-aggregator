const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEquals } = require('./helpers.js');


const uniswapV2 = {
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    initcodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
};
const uniswapV3 = {
    factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    initcodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    fees: [100, 500, 3000, 10000],
};
const pancakeV3 = {
    factory: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9', // poolDeployer
    initcodeHash: '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
    fees: [100, 500, 2500, 10000],
};
const oneInchLP1 = '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643';

describe('UniswapV3LikeOracle', function () {
    async function initContracts () {
        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [uniswapV2.factory, uniswapV2.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [uniswapV3.factory, uniswapV3.initcodeHash, uniswapV3.fees]);
        const pancakeV3Oracle = await deployContract('UniswapV3LikeOracle', [pancakeV3.factory, pancakeV3.initcodeHash, pancakeV3.fees]);
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
        const v2Result = await uniswapV2LikeOracle.getRate(srcToken, dstToken, connector);
        const v3Result = await uniswapV3LikeOracle.getRate(srcToken, dstToken, connector);
        assertRoughlyEquals(v3Result.rate.toString(), v2Result.rate.toString(), 2);
    }
});

describe('UniswapV3LikeOracle doesn\'t ruin rates', function () {
    async function initContracts () {
        const thresholdFilter = 10;

        const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [uniswapV2.factory, uniswapV2.initcodeHash]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [uniswapV3.factory, uniswapV3.initcodeHash, uniswapV3.fees]);
        const uniswapOracle = await deployContract('UniswapOracle', ['0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95']);
        const mooniswapOracle = await deployContract('MooniswapOracle', [oneInchLP1]);

        const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.WETH]);
        const aaveWrapperV1 = await deployContract('AaveWrapperV1');
        const aaveWrapperV2 = await deployContract('AaveWrapperV2', ['0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9']);
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
        ]);
        return { thresholdFilter, oldOffchainOracle, deployOffchainOracle };
    }

    it('ETH DAI', async function () {
        const { thresholdFilter, oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.ETH, tokens.DAI, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    it('WETH DAI', async function () {
        const { thresholdFilter, oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.DAI, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    it('USDC DAI', async function () {
        const { thresholdFilter, oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.DAI, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    it('USDC WETH', async function () {
        const { thresholdFilter, oldOffchainOracle, deployOffchainOracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.WETH, thresholdFilter, oldOffchainOracle, deployOffchainOracle);
    });

    async function testRate (srcToken, dstToken, thresholdFilter, oldOffchainOracle, deployOffchainOracle) {
        const expectedRate = await oldOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const actualRate = await deployOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const expectedReverseRate = await oldOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        const actualReverseRate = await deployOffchainOracle.getRateWithThreshold(srcToken, dstToken, true, thresholdFilter);
        assertRoughlyEquals(actualRate.toString(), expectedRate.toString(), 2);
        assertRoughlyEquals(actualReverseRate.toString(), expectedReverseRate.toString(), 2);
    }
});
