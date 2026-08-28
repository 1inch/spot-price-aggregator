const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { deployContract, assertRoughlyEqualValues } = require('@1inch/solidity-utils');

// NONE connector sentinel used by every oracle.
const NONE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';

// Real (human-scale) liquidity units, identical across the compared configurations.
const R = 1_000_000n;
const e = (d) => 10n ** BigInt(d);

/**
 * These tests assert the CORRECT, decimals-invariant behavior of weight calculation:
 * configurations with identical real liquidity must yield equal weights regardless of
 * token decimals. They currently FAIL (RED) because `OracleBase.getRate` derives weights
 * from raw balances, leaking token decimals into the weight. After the Step 2 refactor
 * (decimals normalization) they are expected to turn GREEN without modification.
 */
describe('Weight decimals dimension (RED: reproduces the bug, green after Step 2)', function () {
    async function deployOracle () {
        const oracle = await deployContract('OracleBaseMock', []);
        return { oracle };
    }

    async function token (symbol, decimals) {
        const t = await deployContract('TokenCustomDecimalsMock', [symbol, symbol, 0, decimals]);
        return t.getAddress();
    }

    it('A: connector decimals must not change weight (6- vs 18-decimals connector, equal real liquidity)', async function () {
        const { oracle } = await loadFixture(deployOracle);
        const src = await token('SRC', 18);
        const dst = await token('DST', 18);
        const c6 = await token('C6', 6);
        const c18 = await token('C18', 18);

        // Path through the 6-decimals connector.
        await oracle.setBalances(src, c6, R * e(18), R * e(6));
        await oracle.setBalances(c6, dst, R * e(6), R * e(18));
        // Path through the 18-decimals connector, identical real reserves.
        await oracle.setBalances(src, c18, R * e(18), R * e(18));
        await oracle.setBalances(c18, dst, R * e(18), R * e(18));

        const w6 = (await oracle.getRate(src, dst, c6, 0)).weight;
        const w18 = (await oracle.getRate(src, dst, c18, 0)).weight;

        // Same real liquidity => weights must match. Currently differ by ~1e6 (connector decimals leak).
        assertRoughlyEqualValues(w6, w18, 1e-4);
    });

    it('B: dst token decimals must not change connector-path weight (equal real liquidity)', async function () {
        const { oracle } = await loadFixture(deployOracle);
        const src = await token('SRC', 18);
        const conn = await token('CONN', 18);
        const dst18 = await token('DST18', 18);
        const dst6 = await token('DST6', 6);

        // Shared src->connector leg.
        await oracle.setBalances(src, conn, R * e(18), R * e(18));
        // connector->dst leg with two dst decimals variants, same real reserves.
        await oracle.setBalances(conn, dst18, R * e(18), R * e(18));
        await oracle.setBalances(conn, dst6, R * e(18), R * e(6));

        const w18 = (await oracle.getRate(src, dst18, conn, 0)).weight;
        const w6 = (await oracle.getRate(src, dst6, conn, 0)).weight;

        // Same real liquidity => weights must match. Currently the min() picks a different leg
        // depending on dst decimals, so they differ by ~1e6.
        assertRoughlyEqualValues(w18, w6, 1e-4);
    });

    it('C: connector-path weight must be on the same scale as direct-path weight (equal real liquidity)', async function () {
        const { oracle } = await loadFixture(deployOracle);
        const src = await token('SRC', 18);
        const dst = await token('DST', 18);
        const conn = await token('C6', 6);

        // Direct pool.
        await oracle.setBalances(src, dst, R * e(18), R * e(18));
        // Connector legs carrying identical real liquidity.
        await oracle.setBalances(src, conn, R * e(18), R * e(6));
        await oracle.setBalances(conn, dst, R * e(6), R * e(18));

        const wDirect = (await oracle.getRate(src, dst, NONE, 0)).weight;
        const wConnector = (await oracle.getRate(src, dst, conn, 0)).weight;

        // Direct and connector paths describe the same real liquidity => comparable weights.
        // Currently the connector weight is ~1e6 smaller (connector decimals leak into the weight).
        assertRoughlyEqualValues(wDirect, wConnector, 1e-4);
    });
});
