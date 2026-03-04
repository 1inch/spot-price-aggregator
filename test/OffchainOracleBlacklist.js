const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Uniswap, UniswapV2 },
    defaultValues: { thresholdFilter },
} = require('./helpers.js');

const NONE = 0; // BlackListType.NONE
const ENTIRE_ORACLE = 1; // BlackListType.ENTIRE_ORACLE
const PAIR = 2; // BlackListType.PAIR

describe('OffchainOracle Blacklist', function () {
    async function deployFixture () {
        const [deployer, alice] = await ethers.getSigners();

        const oracle1 = await deployContract('SimpleOracleMock', [ethers.parseEther('2000'), 1000]);
        const oracle2 = await deployContract('SimpleOracleMock', [ethers.parseEther('100'), 500]);

        const multiWrapper = await deployContract('MultiWrapper', [[], deployer]);

        const offchainOracle = await deployContract('OffchainOracle', [
            multiWrapper,
            [oracle1, oracle2],
            [0, 0], // both WETH type
            [tokens.NONE],
            tokens.WETH,
            deployer.address,
        ]);

        return { deployer, alice, offchainOracle, oracle1, oracle2, multiWrapper };
    }

    // ─── Admin: access control ───

    describe('Access control', function () {
        it('setOracleTokenBlacklistType reverts for non-owner', async function () {
            const { alice, offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();
            await expect(
                offchainOracle.connect(alice).setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE),
            ).to.be.revertedWithCustomError(offchainOracle, 'OwnableUnauthorizedAccount');
        });

        it('setOracleTokenBlacklistPair reverts for non-owner', async function () {
            const { alice, offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();
            await expect(
                offchainOracle.connect(alice).setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true),
            ).to.be.revertedWithCustomError(offchainOracle, 'OwnableUnauthorizedAccount');
        });
    });

    // ─── setOracleTokenBlacklistType ───

    describe('setOracleTokenBlacklistType', function () {
        it('sets ENTIRE_ORACLE and reads back', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();
            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE);

            const result = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(result.blacklistType).to.equal(ENTIRE_ORACLE);
            expect(result.pairCount).to.equal(0);
        });

        it('increments oracleBlacklistCount when transitioning NONE → non-NONE', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(0);
            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(1);
            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.USDC, ENTIRE_ORACLE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(2);
        });

        it('decrements oracleBlacklistCount when transitioning non-NONE → NONE', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE);
            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.USDC, ENTIRE_ORACLE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(2);

            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, NONE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(1);
            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.USDC, NONE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(0);
        });

        it('does not change count when transitioning between non-NONE types', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(1);
            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, PAIR);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(1);
        });

        it('does not change count when setting NONE on already-NONE', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, NONE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(0);
        });

        it('emits OracleTokenBlacklistUpdated event', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();
            await expect(
                offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE),
            ).to.emit(offchainOracle, 'OracleTokenBlacklistUpdated')
                .withArgs(oracleAddr, tokens.DAI, ENTIRE_ORACLE);
        });
    });

    // ─── setOracleTokenBlacklistPair ───

    describe('setOracleTokenBlacklistPair', function () {
        it('blacklists a pair and sets oraclePairBlacklisted', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);

            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.DAI, tokens.USDC)).to.be.true;
            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.USDC, tokens.DAI)).to.be.true;
        });

        it('increments pairCount on both tokens', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);

            const entry1 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            const entry2 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.USDC);
            expect(entry1.pairCount).to.equal(1);
            expect(entry2.pairCount).to.equal(1);
        });

        it('auto-upgrades blacklistType NONE → PAIR on both tokens', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);

            const entry1 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            const entry2 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.USDC);
            expect(entry1.blacklistType).to.equal(PAIR);
            expect(entry2.blacklistType).to.equal(PAIR);
        });

        it('increments oracleBlacklistCount for newly activated tokens', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(0);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            // Both DAI and USDC go from NONE → PAIR
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(2);
        });

        it('is idempotent: adding an already-added pair is a no-op', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            // Second call should not emit an event (early return)
            await expect(
                offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true),
            ).to.not.emit(offchainOracle, 'OracleTokenPairBlacklistUpdated');

            const entry = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entry.pairCount).to.equal(1); // not double-counted
        });

        it('is idempotent: removing an already-removed pair is a no-op', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await expect(
                offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, false),
            ).to.not.emit(offchainOracle, 'OracleTokenPairBlacklistUpdated');
        });

        it('unblacklists a pair and decrements pairCount', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, false);

            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.DAI, tokens.USDC)).to.be.false;
            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.USDC, tokens.DAI)).to.be.false;

            const entry1 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            const entry2 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.USDC);
            expect(entry1.pairCount).to.equal(0);
            expect(entry2.pairCount).to.equal(0);
        });

        it('resets blacklistType PAIR → NONE when removing last pair', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, false);

            const entry1 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            const entry2 = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.USDC);
            expect(entry1.blacklistType).to.equal(NONE);
            expect(entry2.blacklistType).to.equal(NONE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(0);
        });

        it('does not reset blacklistType when other pairs remain', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.WETH, true);

            // DAI now has pairCount=2, remove one
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, false);

            const entryDAI = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entryDAI.pairCount).to.equal(1);
            expect(entryDAI.blacklistType).to.equal(PAIR);

            // USDC had only 1 pair, now 0
            const entryUSDC = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.USDC);
            expect(entryUSDC.pairCount).to.equal(0);
            expect(entryUSDC.blacklistType).to.equal(NONE);
        });

        it('does not touch ENTIRE_ORACLE blacklistType when adding pair', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistType(oracleAddr, tokens.DAI, ENTIRE_ORACLE);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);

            const entry = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entry.blacklistType).to.equal(ENTIRE_ORACLE);
            expect(entry.pairCount).to.equal(1);
        });

        it('order-independent: blacklisting (A,B) sets both (A,B) and (B,A)', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);

            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.DAI, tokens.USDC)).to.be.true;
            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.USDC, tokens.DAI)).to.be.true;
        });

        it('emits OracleTokenPairBlacklistUpdated event', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();
            await expect(
                offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true),
            ).to.emit(offchainOracle, 'OracleTokenPairBlacklistUpdated')
                .withArgs(oracleAddr, tokens.DAI, tokens.USDC, true);
        });
    });

    // ─── Filter logic (end-to-end rate impact) ───

    describe('Filter logic', function () {
        async function deployWithTwoOracles () {
            const [deployer] = await ethers.getSigners();

            const uniswapV2LikeOracle = await deployContract('UniswapV2LikeOracle', [UniswapV2.factory, UniswapV2.initcodeHash]);
            const uniswapOracle = await deployContract('UniswapOracle', [Uniswap.factory]);

            const wethWrapper = await deployContract('BaseCoinWrapper', [tokens.ETH, tokens.WETH]);
            const multiWrapper = await deployContract('MultiWrapper', [[wethWrapper], deployer]);

            const offchainOracle = await deployContract('OffchainOracle', [
                multiWrapper,
                [uniswapV2LikeOracle, uniswapOracle],
                [0, 1], // UniswapV2=WETH, UniswapV1=ETH
                [tokens.NONE, tokens.ETH, tokens.WETH, tokens.USDC],
                tokens.WETH,
                deployer.address,
            ]);

            return {
                deployer,
                offchainOracle,
                uniswapV2Oracle: uniswapV2LikeOracle,
                uniswapV1Oracle: uniswapOracle,
            };
        }

        it('ENTIRE_ORACLE: blacklisting token on one oracle still allows other oracles', async function () {
            const { offchainOracle, uniswapV1Oracle } = await loadFixture(deployWithTwoOracles);
            const v1Addr = await uniswapV1Oracle.getAddress();

            const rateBefore = await offchainOracle.getRateToEthWithThreshold(tokens.DAI, true, thresholdFilter);
            expect(rateBefore).to.gt(0n);

            await offchainOracle.setOracleTokenBlacklistType(v1Addr, tokens.DAI, ENTIRE_ORACLE);

            const rateAfter = await offchainOracle.getRateToEthWithThreshold(tokens.DAI, true, thresholdFilter);
            expect(rateAfter).to.gt(0n);
        });

        it('ENTIRE_ORACLE: rate changes after blacklisting a token on an oracle', async function () {
            const { offchainOracle, uniswapV2Oracle } = await loadFixture(deployWithTwoOracles);
            const v2Addr = await uniswapV2Oracle.getAddress();

            const rateBefore = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);
            await offchainOracle.setOracleTokenBlacklistType(v2Addr, tokens.DAI, ENTIRE_ORACLE);
            const rateAfter = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);

            // V2 is the primary WETH oracle for DAI; removing it changes the weighted average
            expect(rateBefore).to.not.equal(rateAfter);
        });

        it('ENTIRE_ORACLE: unblacklisting restores original rate', async function () {
            const { offchainOracle, uniswapV1Oracle } = await loadFixture(deployWithTwoOracles);
            const v1Addr = await uniswapV1Oracle.getAddress();

            const rateBefore = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);

            await offchainOracle.setOracleTokenBlacklistType(v1Addr, tokens.DAI, ENTIRE_ORACLE);
            await offchainOracle.setOracleTokenBlacklistType(v1Addr, tokens.DAI, NONE);

            const rateAfter = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);
            expect(rateBefore).to.equal(rateAfter);
        });

        it('PAIR blacklist: blocks specific pair but allows other pairs on same oracle', async function () {
            const { offchainOracle, uniswapV2Oracle } = await loadFixture(deployWithTwoOracles);
            const v2Addr = await uniswapV2Oracle.getAddress();

            // Get rate for DAI->WETH and USDC->WETH before blacklisting
            const daiRateBefore = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);
            const usdcRateBefore = await offchainOracle.getRateWithThreshold(tokens.USDC, tokens.WETH, true, thresholdFilter);

            // Blacklist only DAI<>USDC pair on UniswapV2
            await offchainOracle.setOracleTokenBlacklistPair(v2Addr, tokens.DAI, tokens.USDC, true);

            // DAI->WETH rate should be unaffected (only DAI<>USDC is blacklisted, not DAI<>WETH)
            const daiRateAfter = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);
            expect(daiRateAfter).to.equal(daiRateBefore);

            // USDC->WETH rate should be unaffected too
            const usdcRateAfter = await offchainOracle.getRateWithThreshold(tokens.USDC, tokens.WETH, true, thresholdFilter);
            expect(usdcRateAfter).to.equal(usdcRateBefore);
        });

        it('PAIR blacklist works bidirectionally: blacklisting (A,B) blocks both A→B and B→A', async function () {
            const { offchainOracle, uniswapV2Oracle } = await loadFixture(deployWithTwoOracles);
            const v2Addr = await uniswapV2Oracle.getAddress();

            const rateFwdBefore = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.USDC, false, thresholdFilter);
            const rateRevBefore = await offchainOracle.getRateWithThreshold(tokens.USDC, tokens.DAI, false, thresholdFilter);

            // Blacklist DAI<>USDC on V2 only (V1 still works)
            await offchainOracle.setOracleTokenBlacklistPair(v2Addr, tokens.DAI, tokens.USDC, true);

            const rateFwdAfter = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.USDC, false, thresholdFilter);
            const rateRevAfter = await offchainOracle.getRateWithThreshold(tokens.USDC, tokens.DAI, false, thresholdFilter);

            // Both directions should be affected (V2 excluded)
            expect(rateFwdAfter).to.not.equal(rateFwdBefore);
            expect(rateRevAfter).to.not.equal(rateRevBefore);
        });

        it('PAIR blacklist: unblacklisting restores rate', async function () {
            const { offchainOracle, uniswapV2Oracle } = await loadFixture(deployWithTwoOracles);
            const v2Addr = await uniswapV2Oracle.getAddress();

            const rateBefore = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.USDC, false, thresholdFilter);

            await offchainOracle.setOracleTokenBlacklistPair(v2Addr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(v2Addr, tokens.DAI, tokens.USDC, false);

            const rateAfter = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.USDC, false, thresholdFilter);
            expect(rateAfter).to.equal(rateBefore);
        });

        it('ENTIRE_ORACLE has priority over pair-level entries', async function () {
            const { offchainOracle, uniswapV2Oracle } = await loadFixture(deployWithTwoOracles);
            const v2Addr = await uniswapV2Oracle.getAddress();

            // Set up: first blacklist a specific pair, then upgrade to ENTIRE_ORACLE
            await offchainOracle.setOracleTokenBlacklistPair(v2Addr, tokens.DAI, tokens.USDC, true);

            const rateWithPairBlacklist = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);

            // Now set ENTIRE_ORACLE on DAI for V2 → should block ALL pairs with DAI
            await offchainOracle.setOracleTokenBlacklistType(v2Addr, tokens.DAI, ENTIRE_ORACLE);

            const rateWithFullBlacklist = await offchainOracle.getRateWithThreshold(tokens.DAI, tokens.WETH, true, thresholdFilter);

            // DAI->WETH was not pair-blacklisted but should now be blocked by ENTIRE_ORACLE
            expect(rateWithFullBlacklist).to.not.equal(rateWithPairBlacklist);
        });

        it('getRateToEthWithCustomConnectors respects ENTIRE_ORACLE blacklist', async function () {
            const { offchainOracle, uniswapV2Oracle } = await loadFixture(deployWithTwoOracles);
            const v2Addr = await uniswapV2Oracle.getAddress();

            const rateBefore = await offchainOracle.getRateToEthWithThreshold(tokens.DAI, true, thresholdFilter);

            await offchainOracle.setOracleTokenBlacklistType(v2Addr, tokens.DAI, ENTIRE_ORACLE);

            const rateAfter = await offchainOracle.getRateToEthWithThreshold(tokens.DAI, true, thresholdFilter);

            // V2 contributes to DAI→ETH rate; blacklisting changes the result
            expect(rateAfter).to.not.equal(rateBefore);
        });
    });

    // ─── Complex state management ───

    describe('State management', function () {
        it('multiple pairs increment pairCount correctly', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.WETH, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.LINK, true);

            const entry = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entry.pairCount).to.equal(3);
            expect(entry.blacklistType).to.equal(PAIR);

            // USDC only has 1 pair (with DAI)
            const entryUSDC = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.USDC);
            expect(entryUSDC.pairCount).to.equal(1);
        });

        it('removing one pair keeps others intact', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.WETH, true);

            // Remove DAI<>USDC
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, false);

            // DAI<>WETH should still be blacklisted
            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.DAI, tokens.WETH)).to.be.true;

            // DAI<>USDC should be cleared
            expect(await offchainOracle.oraclePairBlacklisted(oracleAddr, tokens.DAI, tokens.USDC)).to.be.false;
        });

        it('oracleBlacklistCount tracks correctly across multiple tokens and oracles', async function () {
            const { offchainOracle, oracle1, oracle2 } = await loadFixture(deployFixture);
            const o1 = await oracle1.getAddress();
            const o2 = await oracle2.getAddress();

            // Oracle1: blacklist DAI<>USDC pair → both DAI and USDC get entries = count 2
            await offchainOracle.setOracleTokenBlacklistPair(o1, tokens.DAI, tokens.USDC, true);
            expect(await offchainOracle.oracleBlacklistCount(o1)).to.equal(2);

            // Oracle1: blacklist DAI<>WETH pair → DAI already has entry, WETH is new = count 3
            await offchainOracle.setOracleTokenBlacklistPair(o1, tokens.DAI, tokens.WETH, true);
            expect(await offchainOracle.oracleBlacklistCount(o1)).to.equal(3);

            // Oracle2 is independent
            expect(await offchainOracle.oracleBlacklistCount(o2)).to.equal(0);
            await offchainOracle.setOracleTokenBlacklistType(o2, tokens.LINK, ENTIRE_ORACLE);
            expect(await offchainOracle.oracleBlacklistCount(o2)).to.equal(1);

            // Oracle1 count unaffected
            expect(await offchainOracle.oracleBlacklistCount(o1)).to.equal(3);
        });

        it('complete lifecycle: add pairs → remove some → remove all → verify clean state', async function () {
            const { offchainOracle, oracle1 } = await loadFixture(deployFixture);
            const oracleAddr = await oracle1.getAddress();

            // Add 3 pairs involving DAI
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.WETH, true);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.LINK, true);

            let entry = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entry.pairCount).to.equal(3);
            expect(entry.blacklistType).to.equal(PAIR);

            // Remove 2 pairs
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.USDC, false);
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.WETH, false);

            entry = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entry.pairCount).to.equal(1);
            expect(entry.blacklistType).to.equal(PAIR);

            // Remove last pair
            await offchainOracle.setOracleTokenBlacklistPair(oracleAddr, tokens.DAI, tokens.LINK, false);

            entry = await offchainOracle.oracleTokenBlacklisted(oracleAddr, tokens.DAI);
            expect(entry.pairCount).to.equal(0);
            expect(entry.blacklistType).to.equal(NONE);
            expect(await offchainOracle.oracleBlacklistCount(oracleAddr)).to.equal(0);
        });
    });
});
