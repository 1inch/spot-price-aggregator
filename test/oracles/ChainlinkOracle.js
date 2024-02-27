const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Chainlink, UniswapV3 },
    testRate,
} = require('../helpers.js');

describe('ChainlinkOracle', function () {
    async function initContracts () {
        const chainlinkOracle = await deployContract('ChainlinkOracle', [Chainlink]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { chainlinkOracle, uniswapV3Oracle };
    }

    it('USDT -> DAI', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDT, tokens.DAI, tokens.NONE, chainlinkOracle, uniswapV3Oracle);
    });

    it('DAI -> USDT', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.DAI, tokens.USDT, tokens.NONE, chainlinkOracle, uniswapV3Oracle);
    });

    it('ETH -> DAI', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate([tokens.ETH, tokens.WETH], tokens.DAI, tokens.NONE, chainlinkOracle, uniswapV3Oracle);
    });

    it('DAI -> ETH', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.DAI, [tokens.ETH, tokens.WETH], tokens.NONE, chainlinkOracle, uniswapV3Oracle);
    });

    it('Supports tokens with custom decimals', async function () {
        const { chainlinkOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDT, [tokens.ETH, tokens.WETH], tokens.NONE, chainlinkOracle, uniswapV3Oracle);
    });

    it('Throws if connector is specified', async function () {
        const { chainlinkOracle } = await loadFixture(initContracts);
        await expect(
            testRate(tokens.DAI, tokens.DAI, tokens.USDT, chainlinkOracle),
        ).to.be.revertedWithCustomError(chainlinkOracle, 'ConnectorShouldBeNone');
    });
});
