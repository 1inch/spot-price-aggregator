const { ethers } = require('hardhat');
const { expect, deployContract } = require('@1inch/solidity-utils');

const OFFCHAIN_ORACLE_ADDRESS = '0x00000000000D6FFc74A8feb35aF5827bf57f6786';
const BNB_ADDRESS = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const UNISWAP_V1_ORACLE = '0xAdF7CC69626eB6F03F4F613832C84Cf62586A6Bb';

describe('OffchainOracle debugRateToEth (mainnet fork)', function () {
    let oracle;

    before(async function () {
        const deployed = await ethers.getContractAt('OffchainOracle', OFFCHAIN_ORACLE_ADDRESS);
        const [allOracles, oracleTypes] = await deployed.oracles();
        const allConnectors = await deployed.connectors();
        const multiWrapperAddr = await deployed.multiWrapper();
        const owner = await deployed.owner();

        oracle = await deployContract('OffchainOracle', [
            multiWrapperAddr,
            Array.from(allOracles),
            Array.from(oracleTypes).map(t => Number(t)),
            Array.from(allConnectors),
            WETH_ADDRESS,
            owner,
        ]);
    });

    it('should return non-empty pool breakdown for BNB', async function () {
        const results = await oracle.debugRateToEth(BNB_ADDRESS, true);
        expect(results.length).to.gt(0);
    });

    it('should contain UniswapV1 oracle with a low-rate BNB pool', async function () {
        const results = await oracle.debugRateToEth(BNB_ADDRESS, true);

        const v1Pools = results.filter(r => r.oracle.toLowerCase() === UNISWAP_V1_ORACLE.toLowerCase());
        expect(v1Pools.length).to.gt(0);

        // UniswapV1 BNB pool is known to return a bad (very low) rate
        const badPool = v1Pools.find(r => Number(r.rate) / 1e18 < 0.1);
        expect(badPool).to.not.be.undefined;
    });

    it('should exclude blacklisted oracle/token from rate calculation', async function () {
        const rateBefore = await oracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 10);
        expect(rateBefore).to.gt(0n);

        // Blacklist BNB on UniswapV1
        const [signer] = await ethers.getSigners();
        const owner = await oracle.owner();
        await signer.sendTransaction({ to: owner, value: ethers.parseEther('1') });
        const ownerSigner = await ethers.getImpersonatedSigner(owner);
        await oracle.connect(ownerSigner).toggleOracleTokenBlacklist(UNISWAP_V1_ORACLE, BNB_ADDRESS);

        expect(await oracle.oracleTokenBlacklisted(UNISWAP_V1_ORACLE, BNB_ADDRESS)).to.be.true;

        // Rate after blacklist should still be positive (other oracles contribute)
        const rateAfter = await oracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 10);
        expect(rateAfter).to.gt(0n);

        // Rates at threshold=10 and threshold=50 should now be close
        const rate50 = await oracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 50);
        const diffPct = Math.abs(Number(rateAfter) - Number(rate50)) / Number(rate50) * 100;
        expect(diffPct).to.lt(5);
    });
});
