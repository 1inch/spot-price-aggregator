const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, deployContract } = require('@1inch/solidity-utils');

const NONE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';
const e18 = 10n ** 18n;

// GREEN tests: lock down behavior that must stay stable across the Step 2 refactor.
// All tokens use 18 decimals, for which decimals normalization is the identity, so the
// expected values hold both for the current implementation and after the fix.
describe('OracleBase weight (GREEN: refactor-stable behavior)', function () {
    async function deploy () {
        const oracle = await deployContract('OracleBaseMock', []);
        const src = await (await deployContract('TokenCustomDecimalsMock', ['SRC', 'SRC', 0, 18])).getAddress();
        const dst = await (await deployContract('TokenCustomDecimalsMock', ['DST', 'DST', 0, 18])).getAddress();
        return { oracle, src, dst };
    }

    it('direct path weight equals sqrt(b0 * b1)', async function () {
        const { oracle, src, dst } = await loadFixture(deploy);
        await oracle.setBalances(src, dst, 4n * e18, 9n * e18); // sqrt(4e18 * 9e18) = 6e18
        const { weight } = await oracle.getRate(src, dst, NONE, 0);
        expect(weight).to.equal(6n * e18);
    });

    it('direct path rate equals mulDiv(b1, 1e18, b0)', async function () {
        const { oracle, src, dst } = await loadFixture(deploy);
        await oracle.setBalances(src, dst, 4n * e18, 9n * e18);
        const { rate } = await oracle.getRate(src, dst, NONE, 0);
        expect(rate).to.equal((9n * e18 * e18) / (4n * e18)); // 2.25e18
    });

    it('weight is symmetric under swapping src/dst', async function () {
        const { oracle, src, dst } = await loadFixture(deploy);
        await oracle.setBalances(src, dst, 4n * e18, 9n * e18);
        const forward = (await oracle.getRate(src, dst, NONE, 0)).weight;
        const backward = (await oracle.getRate(dst, src, NONE, 0)).weight;
        expect(forward).to.equal(backward);
    });

    it('weight scales with sqrt of liquidity (doubling reserves doubles weight)', async function () {
        const { oracle, src, dst } = await loadFixture(deploy);
        await oracle.setBalances(src, dst, 4n * e18, 9n * e18);
        const base = (await oracle.getRate(src, dst, NONE, 0)).weight;
        await oracle.setBalances(src, dst, 8n * e18, 18n * e18); // 2x reserves => sqrt(4) * ... = 2x weight
        const doubled = (await oracle.getRate(src, dst, NONE, 0)).weight;
        expect(doubled).to.equal(2n * base);
    });
});
