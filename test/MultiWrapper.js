const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens, deployParams: { AaveWrapperV2, CompoundWrapper } } = require('./helpers.js');

describe('MultiWrapper', function () {
    async function initContracts () {
        const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.WETH]);
        const aaveWrapperV1 = await deployContract('AaveWrapperV1');
        await aaveWrapperV1.addMarkets([tokens.DAI, tokens.EEE]);
        const aaveWrapperV2 = await deployContract('AaveWrapperV2', [AaveWrapperV2.lendingPool]);
        await aaveWrapperV2.addMarkets([tokens.DAI, tokens.WETH]);
        const compoundWrapper = await deployContract('CompoundLikeWrapper', [CompoundWrapper.comptroller, tokens.cETH]);
        await compoundWrapper.addMarkets([tokens.cDAI]);
        const fulcrumWrapper = await deployContract('FulcrumWrapper');
        await fulcrumWrapper.addMarkets([tokens.DAI, tokens.WETH]);

        const multiWrapper = await deployContract('MultiWrapper', [[
            wethWrapper.address,
            aaveWrapperV1.address,
            aaveWrapperV2.address,
            compoundWrapper.address,
            fulcrumWrapper.address,
        ]]);

        return { multiWrapper };
    }

    it('eth', async function () {
        const { multiWrapper } = await loadFixture(initContracts);
        const response = await multiWrapper.getWrappedTokens(tokens.ETH);
        expect(response.wrappedTokens).to.deep.equal([tokens.WETH, tokens.aWETHV2, tokens.iETH, tokens.aETHV1, tokens.cETH, tokens.ETH]);

        for (const i of [0, 1, 3, 5]) {
            expect(response.rates[i]).to.eq(ether('1'));
        }
        expect(response.rates[2]).to.gt(ether('1'));
        expect(response.rates[4]).to.lt('5000000000');
    });

    it('dai', async function () {
        const { multiWrapper } = await loadFixture(initContracts);
        const response = await multiWrapper.getWrappedTokens(tokens.DAI);
        expect(response.wrappedTokens).to.deep.equal([tokens.aDAIV1, tokens.aDAIV2, tokens.cDAI, tokens.iDAI, tokens.DAI]);

        for (const i of [0, 1, 4]) {
            expect(response.rates[i]).to.eq(ether('1'));
        }
        expect(response.rates[2]).to.lt('5000000000');
        expect(response.rates[3]).to.gt(ether('1'));
    });

    it('aETHv1', async function () {
        const { multiWrapper } = await loadFixture(initContracts);
        const response = await multiWrapper.getWrappedTokens(tokens.aETHV1);
        expect(response.wrappedTokens).to.deep.equal([tokens.ETH, tokens.WETH, tokens.cETH, tokens.aETHV1]);

        for (const i of [0, 1, 3]) {
            expect(response.rates[i]).to.eq(ether('1'));
        }
        expect(response.rates[2]).to.lt('5000000000');
    });
});
