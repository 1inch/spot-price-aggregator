const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { ethers } = require('hardhat');
const { expect, ether, deployContract, constants } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

// Pure-logic OffchainOracle tests (blacklist behavior, overflow handling). They use a
// SimpleOracleMock and an empty MultiWrapper, so they are fully deterministic and run
// without a mainnet fork.
describe('OffchainOracle logic (mock, no fork)', function () {
    async function emptyMultiWrapper () {
        const [deployer] = await ethers.getSigners();
        const multiWrapper = await deployContract('MultiWrapper', [[], deployer.address]);
        return { multiWrapper, deployer };
    }

    describe('overflow', function () {
        it('should work when overflow happens in _getRateImpl method', async function () {
            const { multiWrapper, deployer } = await loadFixture(emptyMultiWrapper);

            const simpleOracleMock = await deployContract('SimpleOracleMock', ['608424427628800532964876503129856304465282478', '2']);
            const offchainOracle = await deployContract('OffchainOracle', [
                multiWrapper,
                [
                    simpleOracleMock,
                ],
                ['0'],
                [
                    tokens.NONE,
                ],
                tokens.WETH,
                deployer.address,
            ]);

            expect(await offchainOracle.getRateToEth(tokens.DAI, true)).not.to.be.reverted;
        });
    });

    describe('blacklist', function () {
        async function initContractsForBlacklist () {
            const { multiWrapper, deployer } = await emptyMultiWrapper();

            const simpleOracleMock = await deployContract('SimpleOracleMock', [ether('1500'), ether('1')]);
            const offchainOracle = await deployContract('OffchainOracle', [
                multiWrapper,
                [simpleOracleMock],
                ['0'],
                [tokens.WETH],
                tokens.WETH,
                deployer.address,
            ]);

            return { offchainOracle, simpleOracleMock, deployer };
        }

        it('should correctly set blacklisted status with proper event and storage', async function () {
            const { offchainOracle, simpleOracleMock } = await loadFixture(initContractsForBlacklist);
            const oracleAddr = await simpleOracleMock.getAddress();
            // Blacklist specific pair (token0 ^ token1 XOR key)
            const xorKey = BigInt(tokens.USDC) ^ BigInt(tokens.DAI);
            await expect(offchainOracle.setBlacklistedStatus(oracleAddr, tokens.USDC, tokens.DAI, true))
                .to.emit(offchainOracle, 'OracleTokenBlacklistUpdated')
                .withArgs(oracleAddr, xorKey, true);
            expect(await offchainOracle.blacklisted(oracleAddr, tokens.USDC, tokens.DAI)).to.be.true;

            // Blacklist token for all pairs (token1 = address(0))
            const tokenKey = BigInt(tokens.DAI);
            await expect(offchainOracle.setBlacklistedStatus(oracleAddr, tokens.DAI, tokens.ETH, true))
                .to.emit(offchainOracle, 'OracleTokenBlacklistUpdated')
                .withArgs(oracleAddr, tokenKey, true);
        });

        it('should return zero rate when specific token-connector pair is blacklisted', async function () {
            const { offchainOracle, simpleOracleMock } = await loadFixture(initContractsForBlacklist);
            const oracleAddr = await simpleOracleMock.getAddress();

            const rateBefore = await offchainOracle.getRate(tokens.DAI, tokens.USDC, false);
            expect(rateBefore).to.gt(0);

            await offchainOracle.setBlacklistedStatus(oracleAddr, tokens.DAI, tokens.WETH, true);

            const rateAfter = await offchainOracle.getRate(tokens.DAI, tokens.USDC, false);
            expect(rateAfter).to.eq(0);
        });

        it('should return zero rate when token is blacklisted for all pairs', async function () {
            const { offchainOracle, simpleOracleMock } = await loadFixture(initContractsForBlacklist);
            const oracleAddr = await simpleOracleMock.getAddress();

            const rateBefore = await offchainOracle.getRate(tokens.DAI, tokens.USDC, false);
            expect(rateBefore).to.gt(0);

            // Blacklist DAI for all pairs (token1 = address(0))
            await offchainOracle.setBlacklistedStatus(oracleAddr, tokens.DAI, constants.ZERO_ADDRESS, true);

            const rateAfter = await offchainOracle.getRate(tokens.DAI, tokens.USDC, false);
            expect(rateAfter).to.eq(0);
        });

        it('should restore rate after removing from blacklist', async function () {
            const { offchainOracle, simpleOracleMock } = await loadFixture(initContractsForBlacklist);
            const oracleAddr = await simpleOracleMock.getAddress();

            const rateBefore = await offchainOracle.getRate(tokens.DAI, tokens.USDC, false);
            expect(rateBefore).to.gt(0);

            // Blacklist pair (DAI, WETH connector)
            await offchainOracle.setBlacklistedStatus(oracleAddr, tokens.DAI, tokens.WETH, true);
            expect(await offchainOracle.getRate(tokens.DAI, tokens.USDC, false)).to.eq(0);

            await offchainOracle.setBlacklistedStatus(oracleAddr, tokens.DAI, tokens.WETH, false);

            const rateAfter = await offchainOracle.getRate(tokens.DAI, tokens.USDC, false);
            expect(rateAfter).to.eq(rateBefore);
        });
    });
});
