const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, assertRoughlyEqualValues, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Chainlink, UniswapV3 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

describe('ChainlinkOracle', function () {
    async function initContracts () {
        const chainlinkOracle = await deployContract('ChainlinkOracle', [Chainlink]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { chainlinkOracle, uniswapV3Oracle };
    }

    it('USDT -> DAI', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE, thresholdFilter);
        const expected = await uniswapV3Oracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE, thresholdFilter);

        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('DAI -> USDT', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE, thresholdFilter);
        const expected = await uniswapV3Oracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE, thresholdFilter);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('ETH -> DAI', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE, thresholdFilter);
        const expected = await uniswapV3Oracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE, thresholdFilter);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('DAI -> ETH', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE, thresholdFilter);
        const expected = await uniswapV3Oracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE, thresholdFilter);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('Supports tokens with custom decimals', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.USDT, tokens.ETH, tokens.NONE, thresholdFilter);
        const expected = await uniswapV3Oracle.getRate(tokens.USDT, tokens.WETH, tokens.NONE, thresholdFilter);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('Throws if connector is specified', async function () {
        const { chainlinkOracle } = await loadFixture(initContracts);
        await expect(
            chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT, thresholdFilter),
        ).to.be.revertedWithCustomError(chainlinkOracle, 'ConnectorShouldBeNone');
    });
});
