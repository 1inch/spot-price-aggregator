const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('@1inch/solidity-utils');
const { tokens, assertRoughlyEqualValues, deployContract } = require('./helpers.js');

const uniswapV3 = {
    factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    initcodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    fees: [100, 500, 3000, 10000],
};

describe('ChainlinkOracle', function () {
    async function initContracts () {
        const chainlinkOracle = await deployContract('ChainlinkOracle', ['0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf']);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [uniswapV3.factory, uniswapV3.initcodeHash, uniswapV3.fees]);
        return { chainlinkOracle, uniswapV3Oracle };
    }

    it('USDT -> DAI', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        const expected = await uniswapV3Oracle.getRate(tokens.USDT, tokens.DAI, tokens.NONE);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('DAI -> USDT', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        const expected = await uniswapV3Oracle.getRate(tokens.DAI, tokens.USDT, tokens.NONE);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('ETH -> DAI', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.ETH, tokens.DAI, tokens.NONE);
        const expected = await uniswapV3Oracle.getRate(tokens.WETH, tokens.DAI, tokens.NONE);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('DAI -> ETH', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.DAI, tokens.ETH, tokens.NONE);
        const expected = await uniswapV3Oracle.getRate(tokens.DAI, tokens.WETH, tokens.NONE);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.05);
    });

    it('Supports tokens with custom decimals', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        const actual = await chainlinkOracle.getRate(tokens.USDT, tokens.ETH, tokens.NONE);
        const expected = await uniswapV3Oracle.getRate(tokens.USDT, tokens.WETH, tokens.NONE);
        assertRoughlyEqualValues(expected.rate.toString(), actual.rate.toString(), 0.01);
    });

    it('Throws if connector is specified', async function () {
        const { chainlinkOracle } = await loadFixture(initContracts);
        await expect(
            chainlinkOracle.getRate(tokens.DAI, tokens.DAI, tokens.USDT),
        ).to.be.revertedWithCustomError(chainlinkOracle, 'ConnectorShouldBeNone');
    });
});
