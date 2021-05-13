const { ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { tokens } = require('./helpers.js');

const BaseCoinWrapper = artifacts.require('BaseCoinWrapper');
const CompoundLikeWrapper = artifacts.require('CompoundLikeWrapper');
const FulcrumWrapper = artifacts.require('FulcrumWrapper');
const AaveWrapperV1 = artifacts.require('AaveWrapperV1');
const AaveWrapperV2 = artifacts.require('AaveWrapperV2');
const MultiWrapper = artifacts.require('MultiWrapper');

const aETHV1 = '0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04';
const aWETHV2 = '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e';
const ADAIV1 = '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d';
const ADAIV2 = '0x028171bCA77440897B824Ca71D1c56caC55b68A3';
const CDAI = '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643';
const CETH = '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5';
const iETHV2 = '0xB983E01458529665007fF7E0CDdeCDB74B967Eb6';
const IDAIV2 = '0x6b093998D36f2C7F0cc359441FBB24CC629D5FF0';

describe('MultiWrapper', async function () {
    before(async function () {
        this.wethWrapper = await BaseCoinWrapper.new(tokens.WETH);
        this.aaveWrapperV1 = await AaveWrapperV1.new();
        await this.aaveWrapperV1.addMarkets([tokens.DAI, tokens.EEE]);
        this.aaveWrapperV2 = await AaveWrapperV2.new('0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9');
        await this.aaveWrapperV2.addMarkets([tokens.DAI, tokens.WETH]);
        this.compoundWrapper = await CompoundLikeWrapper.new('0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B', CETH);
        await this.compoundWrapper.addMarkets([CDAI]);
        this.fulcrumWrapper = await FulcrumWrapper.new();
        await this.fulcrumWrapper.addMarkets([tokens.DAI, tokens.WETH]);

        this.multiWrapper = await MultiWrapper.new(
            [
                this.wethWrapper.address,
                this.aaveWrapperV1.address,
                this.aaveWrapperV2.address,
                this.compoundWrapper.address,
                this.fulcrumWrapper.address,
            ],
        );
    });

    it('eth', async function () {
        const response = await this.multiWrapper.getWrappedTokens(tokens.ETH);
        expect(response.wrappedTokens).to.be.deep.equal([tokens.WETH, aWETHV2, iETHV2, aETHV1, CETH, tokens.ETH]);

        for (const i of [0, 1, 3, 5]) {
            expect(response.rates[i]).to.be.bignumber.eq(ether('1'));
        }
        expect(response.rates[2]).to.be.bignumber.gt(ether('1'));
        expect(response.rates[4]).to.be.bignumber.lt('5000000000');
    });

    it('dai', async function () {
        const response = await this.multiWrapper.getWrappedTokens(tokens.DAI);
        expect(response.wrappedTokens).to.be.deep.equal([ADAIV1, ADAIV2, CDAI, IDAIV2, tokens.DAI]);

        for (const i of [0, 1, 4]) {
            expect(response.rates[i]).to.be.bignumber.eq(ether('1'));
        }
        expect(response.rates[2]).to.be.bignumber.lt('5000000000');
        expect(response.rates[3]).to.be.bignumber.gt(ether('1'));
    });

    it('aETHv1', async function () {
        const response = await this.multiWrapper.getWrappedTokens(aETHV1);
        expect(response.wrappedTokens).to.be.deep.equal([tokens.ETH, tokens.WETH, CETH, aETHV1]);

        for (const i of [0, 1, 3]) {
            expect(response.rates[i]).to.be.bignumber.eq(ether('1'));
        }
        expect(response.rates[2]).to.be.bignumber.lt('5000000000');
    });
});
