const { loadFixture, time } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, deployContract } = require('@1inch/solidity-utils');
const { ethers } = require('hardhat');
const { tokens } = require('../helpers.js');

describe('DeluthiumOracle', function () {
    async function initContracts() {
        const [owner, priceUpdater, user] = await ethers.getSigners();
        const deluthiumOracle = await deployContract('DeluthiumOracle', [priceUpdater.address]);
        return { deluthiumOracle, owner, priceUpdater, user };
    }

    describe('Deployment', function () {
        it('should set the correct owner', async function () {
            const { deluthiumOracle, owner } = await loadFixture(initContracts);
            expect(await deluthiumOracle.owner()).to.equal(owner.address);
        });

        it('should set the correct price updater', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);
            expect(await deluthiumOracle.priceUpdater()).to.equal(priceUpdater.address);
        });

        it('should set default max price age to 300 seconds', async function () {
            const { deluthiumOracle } = await loadFixture(initContracts);
            expect(await deluthiumOracle.maxPriceAge()).to.equal(300);
        });

        it('should revert with zero address for price updater', async function () {
            await expect(
                deployContract('DeluthiumOracle', [ethers.ZeroAddress]),
            ).to.be.revertedWithCustomError({ interface: (await ethers.getContractFactory('DeluthiumOracle')).interface }, 'ZeroAddress');
        });
    });

    describe('updatePrice', function () {
        const rate = ethers.parseEther('300'); // Example: 1 token = 300 of another
        const weight = ethers.parseEther('1000');

        it('should update price successfully', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await deluthiumOracle.connect(priceUpdater).updatePrice(
                tokens.WETH.address,
                tokens.USDT.address,
                rate,
                weight,
            );

            const [returnedRate, returnedWeight] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                ethers.ZeroAddress,
                0,
            );

            expect(returnedRate).to.equal(rate);
            expect(returnedWeight).to.equal(weight);
        });

        it('should emit PriceUpdated event', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await expect(
                deluthiumOracle.connect(priceUpdater).updatePrice(
                    tokens.WETH.address,
                    tokens.USDT.address,
                    rate,
                    weight,
                ),
            ).to.emit(deluthiumOracle, 'PriceUpdated')
                .withArgs(tokens.WETH.address, tokens.USDT.address, rate, weight);
        });

        it('should revert when called by non-updater', async function () {
            const { deluthiumOracle, user } = await loadFixture(initContracts);

            await expect(
                deluthiumOracle.connect(user).updatePrice(
                    tokens.WETH.address,
                    tokens.USDT.address,
                    rate,
                    weight,
                ),
            ).to.be.revertedWithCustomError(deluthiumOracle, 'UnauthorizedUpdater');
        });
    });

    describe('batchUpdatePrices', function () {
        it('should batch update prices successfully', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            const srcTokens = [tokens.WETH.address, tokens.USDT.address];
            const dstTokens = [tokens.USDT.address, tokens.WETH.address];
            const rates = [ethers.parseEther('300'), ethers.parseEther('0.00333')];
            const weights = [ethers.parseEther('1000'), ethers.parseEther('1000')];

            await deluthiumOracle.connect(priceUpdater).batchUpdatePrices(
                srcTokens,
                dstTokens,
                rates,
                weights,
            );

            const [rate1] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                ethers.ZeroAddress,
                0,
            );
            const [rate2] = await deluthiumOracle.getRate(
                tokens.USDT.address,
                tokens.WETH.address,
                ethers.ZeroAddress,
                0,
            );

            expect(rate1).to.equal(rates[0]);
            expect(rate2).to.equal(rates[1]);
        });

        it('should revert with mismatched array lengths', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await expect(
                deluthiumOracle.connect(priceUpdater).batchUpdatePrices(
                    [tokens.WETH.address, tokens.USDT.address],
                    [tokens.USDT.address], // Mismatched length
                    [ethers.parseEther('300')],
                    [ethers.parseEther('1000')],
                ),
            ).to.be.revertedWithCustomError(deluthiumOracle, 'InvalidArrayLength');
        });
    });

    describe('getRate', function () {
        const rate = ethers.parseEther('300');
        const weight = ethers.parseEther('1000');

        it('should return rate and weight for valid price', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await deluthiumOracle.connect(priceUpdater).updatePrice(
                tokens.WETH.address,
                tokens.USDT.address,
                rate,
                weight,
            );

            const [returnedRate, returnedWeight] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                ethers.ZeroAddress,
                0,
            );

            expect(returnedRate).to.equal(rate);
            expect(returnedWeight).to.equal(weight);
        });

        it('should work with NONE connector', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await deluthiumOracle.connect(priceUpdater).updatePrice(
                tokens.WETH.address,
                tokens.USDT.address,
                rate,
                weight,
            );

            const [returnedRate] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                tokens.NONE.address,
                0,
            );
            expect(returnedRate).to.equal(rate);
        });

        it('should revert with non-NONE connector', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await deluthiumOracle.connect(priceUpdater).updatePrice(
                tokens.WETH.address,
                tokens.USDT.address,
                rate,
                weight,
            );

            await expect(
                deluthiumOracle.getRate(
                    tokens.WETH.address,
                    tokens.USDT.address,
                    tokens.DAI.address, // Invalid connector
                    0,
                ),
            ).to.be.revertedWithCustomError(deluthiumOracle, 'ConnectorShouldBeNone');
        });

        it('should return zero for price below threshold', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await deluthiumOracle.connect(priceUpdater).updatePrice(
                tokens.WETH.address,
                tokens.USDT.address,
                rate,
                weight,
            );

            const [returnedRate, returnedWeight] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                ethers.ZeroAddress,
                ethers.parseEther('2000'), // Higher than weight
            );

            expect(returnedRate).to.equal(0);
            expect(returnedWeight).to.equal(0);
        });

        it('should return zero for non-existent pair', async function () {
            const { deluthiumOracle } = await loadFixture(initContracts);

            const [returnedRate, returnedWeight] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                ethers.ZeroAddress,
                0,
            );

            expect(returnedRate).to.equal(0);
            expect(returnedWeight).to.equal(0);
        });

        it('should return zero for stale price', async function () {
            const { deluthiumOracle, priceUpdater } = await loadFixture(initContracts);

            await deluthiumOracle.connect(priceUpdater).updatePrice(
                tokens.WETH.address,
                tokens.USDT.address,
                rate,
                weight,
            );

            // Fast forward time by maxPriceAge + 1
            await time.increase(301);

            const [returnedRate, returnedWeight] = await deluthiumOracle.getRate(
                tokens.WETH.address,
                tokens.USDT.address,
                ethers.ZeroAddress,
                0,
            );

            expect(returnedRate).to.equal(0);
            expect(returnedWeight).to.equal(0);
        });
    });

    describe('Admin functions', function () {
        it('should allow owner to change price updater', async function () {
            const { deluthiumOracle, owner, user } = await loadFixture(initContracts);

            await deluthiumOracle.connect(owner).setPriceUpdater(user.address);
            expect(await deluthiumOracle.priceUpdater()).to.equal(user.address);
        });

        it('should emit PriceUpdaterChanged event', async function () {
            const { deluthiumOracle, owner, priceUpdater, user } = await loadFixture(initContracts);

            await expect(
                deluthiumOracle.connect(owner).setPriceUpdater(user.address),
            ).to.emit(deluthiumOracle, 'PriceUpdaterChanged')
                .withArgs(priceUpdater.address, user.address);
        });

        it('should revert when non-owner changes price updater', async function () {
            const { deluthiumOracle, user } = await loadFixture(initContracts);

            await expect(
                deluthiumOracle.connect(user).setPriceUpdater(user.address),
            ).to.be.revertedWithCustomError(deluthiumOracle, 'OwnableUnauthorizedAccount');
        });

        it('should revert when setting zero address as price updater', async function () {
            const { deluthiumOracle, owner } = await loadFixture(initContracts);

            await expect(
                deluthiumOracle.connect(owner).setPriceUpdater(ethers.ZeroAddress),
            ).to.be.revertedWithCustomError(deluthiumOracle, 'ZeroAddress');
        });

        it('should allow owner to change max price age', async function () {
            const { deluthiumOracle, owner } = await loadFixture(initContracts);

            await deluthiumOracle.connect(owner).setMaxPriceAge(600);
            expect(await deluthiumOracle.maxPriceAge()).to.equal(600);
        });
    });
});
