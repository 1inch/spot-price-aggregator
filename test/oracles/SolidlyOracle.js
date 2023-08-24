const { ethers } = require('hardhat');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract, assertRoughlyEqualValues } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { VelocimieterV2 },
    defaultValues: { thresholdFilter },
} = require('../helpers.js');

describe('SolidlyOracle', function () {
    describe('VelocimieterV2 @base', function () {
        before(async function () {
            if ((await ethers.provider.getNetwork()).chainId !== 8453) {
                console.log('Skipping tests, not on Base network');
                this.skip();
            }
        });

        async function initContracts () {
            const velocimieterV2Oracle = await deployContract('SolidlyOracle', [VelocimieterV2.factory, VelocimieterV2.initcodeHash]);
            return { velocimieterV2Oracle };
        }

        it('axlUSDT -> axlUSDC', async function () {
            const { velocimieterV2Oracle } = await loadFixture(initContracts);
            const rate = await velocimieterV2Oracle.getRate(tokens.base.axlUSDT, tokens.base.axlUSDC, tokens.NONE, thresholdFilter);
            assertRoughlyEqualValues(rate.rate, ether('1'), '0.05');
        });

        it('weth -> dai', async function () {
            const { velocimieterV2Oracle } = await loadFixture(initContracts);
            const rate = await velocimieterV2Oracle.getRate(tokens.base.WETH, tokens.base.DAI, tokens.NONE, thresholdFilter);
            expect(rate.rate).to.gt(ether('1000'));
        });
    });
});
