const { ethers } = require('hardhat');
const { expect, ether } = require('@1inch/solidity-utils');
const { tokens } = require('./helpers.js');

const oracles = {
    mooniswapOracle: '0x1488a117641eD5D2D29AB3eD2397963FdEFEc25e',
    oneInchLPOracle: '0x1Ad5eD95B8197fcC75e38fB0BC2C51dcc9B94097',
    oneInchLP1Oracle: '0x30829F90270eb4270d8CAdFAfcF13f1DF841be1d',
    uniswapV2Oracle: '0x8dc76c16e90351C1574a3Eea5c5797C475eA7292',
    sushiswapOracle: '0x4749B35AE40897B40585633261c5f743730fE8BC',
    uniswapOracle: '0x05AD60d9a2f1aa30BA0cdbAF1E0A0A145fBeA16F',
};

const multiWrapper = '0x931e32b6d112f7be74b16f7fbc77d491b30fe18c';

describe.skip('ProdTest', async function () {
    before(async function () {
        // this.compoundWrapper = await CompoundWrapper.deploy();
        // await this.compoundWrapper.addMarkets([CDAI]);

        const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
        this.offchainOracle = await OffchainOracle.deploy(
            multiWrapper,
            [
                oracles.mooniswapOracle,
                oracles.oneInchLPOracle,
                oracles.oneInchLP1Oracle,
                oracles.uniswapV2Oracle,
                oracles.sushiswapOracle,
                // oracles.uniswapOracle,
            ],
            [
                // tokens.ETH,
                // tokens.WETH,
                // tokens.USDC,
                // tokens.DAI,
                // tokens.USDT,
                tokens.NONE,
            ],
        );
        await this.offchainOracle.deployed();
    });

    it('zks -> eth', async function () {
        const rate = await this.offchainOracle.getRate(tokens.WETH, '0x793786e2dd4Cc492ed366a94B88a3Ff9ba5E7546');
        console.log(rate.toString());
        expect(rate).to.be.lt(ether('0.001'));
    });
});
