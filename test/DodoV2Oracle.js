const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { DodoV2 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

describe('DodoV2Oracle', function () {
    async function initContracts () {
        const dodoV2Oracle = await deployContract('DodoV2Oracle', [DodoV2.factory]);
        return { dodoV2Oracle };
    }

    it('should revert with amount of pools error', async function () {
        const { dodoV2Oracle } = await loadFixture(initContracts);
        await expect(
            dodoV2Oracle.getRate(tokens.USDT, tokens['1INCH'], tokens.NONE, thresholdFilter),
        ).to.be.revertedWithCustomError(dodoV2Oracle, 'PoolNotFound');
    });

    it('WETH -> USDC', async function () {
        const { dodoV2Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.USDC, tokens.NONE, dodoV2Oracle);
    });

    it('USDC -> WETH', async function () {
        const { dodoV2Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.WETH, tokens.NONE, dodoV2Oracle);
    });

    it('XRA -> WETH -> USDC', async function () {
        const { dodoV2Oracle } = await loadFixture(initContracts);
        await testRate(tokens.XRA, tokens.USDC, tokens.WETH, dodoV2Oracle);
    });

    it.skip('USDC -> WETH -> XRA', async function () {
        const { dodoV2Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.XRA, tokens.WETH, dodoV2Oracle);
    });

    const testRate = async (srcToken, dstToken, connector, dodoV2Oracle) => {
        const dodoResult = await dodoV2Oracle.getRate(srcToken, dstToken, connector, thresholdFilter);
        expect(dodoResult.rate).to.gt(ether('0'));
        expect(dodoResult.weight).to.gt(ether('0'));
    };
});
