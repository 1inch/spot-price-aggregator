const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, deployContract, constants } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { AaveWrapperV2, Curve, Uniswap, UniswapV2, UniswapV3 },
    defaultValues: { thresholdFilter },
    testRate,
    measureGas,
    testRateOffchainOracle,
} = require('../helpers.js');

describe('CurveOracle', function () {
    async function initContracts () {
        const curveOracle = await deployContract('CurveOracle', [Curve.provider, Curve.maxPools]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { curveOracle, uniswapV3Oracle };
    }

    it('USDT -> WBTC', async function () {
        const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDT, tokens.WBTC, tokens.NONE, curveOracle, uniswapV3Oracle);
    });

    it('WBTC -> USDT', async function () {
        const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.USDT, tokens.NONE, curveOracle, uniswapV3Oracle);
    });

    it('WBTC -> WETH', async function () {
        const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.WETH, tokens.NONE, curveOracle, uniswapV3Oracle);
    });

    it('USDT -> USDC', async function () {
        const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDT, tokens.USDC, tokens.NONE, curveOracle, uniswapV3Oracle);
    });

    it('should use correct `get_dy` selector when vyper return redundant bytes', async function () {
        const { curveOracle } = await loadFixture(initContracts);
        const rate = await curveOracle.getRate(tokens.BEAN, tokens['3CRV'], tokens.NONE, thresholdFilter);
        expect(rate.rate).to.gt('0');
    });

    describe('Measure gas', function () {
        it('USDT -> WBTC', async function () {
            const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await measureGas(await curveOracle.getFunction('getRate').send(tokens.USDT, tokens.WBTC, tokens.NONE, thresholdFilter), 'CurveOracle usdt -> wbtc');
            await measureGas(await uniswapV3Oracle.getFunction('getRate').send(tokens.USDT, tokens.WBTC, tokens.NONE, thresholdFilter), 'UniswapV3Oracle usdt -> wbtc');
        });

        it('WBTC -> USDT', async function () {
            const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await measureGas(await curveOracle.getFunction('getRate').send(tokens.WBTC, tokens.USDT, tokens.NONE, thresholdFilter), 'CurveOracle wbtc -> usdt');
            await measureGas(await uniswapV3Oracle.getFunction('getRate').send(tokens.WBTC, tokens.USDT, tokens.NONE, thresholdFilter), 'UniswapV3Oracle wbtc -> usdt');
        });

        it('WBTC -> WETH', async function () {
            const { curveOracle, uniswapV3Oracle } = await loadFixture(initContracts);
            await measureGas(await curveOracle.getFunction('getRate').send(tokens.WBTC, tokens.WETH, tokens.NONE, thresholdFilter), 'CurveOracle wbtc -> weth');
            await measureGas(await uniswapV3Oracle.getFunction('getRate').send(tokens.WBTC, tokens.WETH, tokens.NONE, thresholdFilter), 'UniswapV3Oracle wbtc -> weth');
        });
    });

    describe('CurveOracle doesn\'t ruin rates', function () {
        async function initContracts () {
            const [deployer] = await ethers.getSigners();

            const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
            const curveOracle = await deployContract('CurveOracle', [Curve.provider, Curve.maxPools]);
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

            const newOffchainOracle = await deployContract('OffchainOracle', [
                multiWrapper,
                [
                    uniswapV2LikeOracle,
                    uniswapOracle,
                    mooniswapOracle,
                    curveOracle,
                ],
                [
                    '0',
                    '1',
                    '2',
                    '2',
                ],
                [
                    tokens.NONE,
                    tokens.ETH,
                    tokens.USDC,
                    tokens.DAI,
                ],
                tokens.WETH,
                deployer.address,
            ]);

            return { oldOffchainOracle, newOffchainOracle };
        }

        it('WBTC -> WETH', async function () {
            const { oldOffchainOracle, newOffchainOracle } = await loadFixture(initContracts);
            await testRateOffchainOracle(tokens.WBTC, tokens.WETH, oldOffchainOracle, newOffchainOracle);
        });

        it('WETH -> WBTC', async function () {
            const { oldOffchainOracle, newOffchainOracle } = await loadFixture(initContracts);
            await testRateOffchainOracle(tokens.WETH, tokens.WBTC, oldOffchainOracle, newOffchainOracle);
        });

        it('WBTC -> USDT', async function () {
            const { oldOffchainOracle, newOffchainOracle } = await loadFixture(initContracts);
            await testRateOffchainOracle(tokens.WBTC, tokens.USDT, oldOffchainOracle, newOffchainOracle);
        });

        it('USDT -> WBTC', async function () {
            const { oldOffchainOracle, newOffchainOracle } = await loadFixture(initContracts);
            await testRateOffchainOracle(tokens.USDT, tokens.WBTC, oldOffchainOracle, newOffchainOracle);
        });
    });
});
