const hre = require('hardhat');
const { ethers } = hre;
const { expect, deployContract } = require('@1inch/solidity-utils');

const OFFCHAIN_ORACLE_ADDRESS = '0x00000000000D6FFc74A8feb35aF5827bf57f6786';
const BNB_ADDRESS = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
const UNISWAP_V1_FACTORY = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95';

describe('BNB price threshold investigation (mainnet fork)', function () {
    let offchainOracle;

    before(async function () {
        console.log('        Attaching to OffchainOracle at', OFFCHAIN_ORACLE_ADDRESS);
        offchainOracle = await ethers.getContractAt('OffchainOracle', OFFCHAIN_ORACLE_ADDRESS);
    });

    it('getRateToEthWithThreshold: threshold=10 vs threshold=50', async function () {
        console.log('        Calling getRateToEthWithThreshold(BNB, true, 10)...');
        const rate10 = await offchainOracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 10);
        const rate10Formatted = Number(rate10) / 1e18;
        console.log(`        threshold=10: BNB/ETH rate = ${rate10Formatted}`);

        console.log('        Calling getRateToEthWithThreshold(BNB, true, 50)...');
        const rate50 = await offchainOracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 50);
        const rate50Formatted = Number(rate50) / 1e18;
        console.log(`        threshold=50: BNB/ETH rate = ${rate50Formatted}`);

        const diffPct = Math.abs(rate10Formatted - rate50Formatted) / rate50Formatted * 100;
        console.log(`        Difference: ${diffPct.toFixed(2)}%`);

        expect(rate10).to.gt(0n);
        expect(rate50).to.gt(0n);
    });

    it('getRatesAndWeightsToEthWithCustomConnectors: show raw pool data', async function () {
        console.log('        Calling getRatesAndWeightsToEthWithCustomConnectors(BNB, true, [], 0)...');
        const result = await offchainOracle.getRatesAndWeightsToEthWithCustomConnectors(
            BNB_ADDRESS, true, [], 0,
        );

        const maxWeight = result.ratesAndWeights.maxOracleWeight;
        console.log(`        wrappedPrice: ${result.wrappedPrice}`);
        console.log(`        maxOracleWeight: ${maxWeight}`);
        console.log(`        total oracle prices: ${result.ratesAndWeights.oraclePrices.length}`);

        let nonZeroCount = 0;
        for (let i = 0; i < result.ratesAndWeights.oraclePrices.length; i++) {
            const p = result.ratesAndWeights.oraclePrices[i];
            if (p.weight === 0n) continue;
            nonZeroCount++;
            const rateFormatted = Number(p.rate) / 1e18;
            const weightPct = maxWeight > 0n ? Number(p.weight * 100n / maxWeight) : 0;
            console.log(`        pool[${i}]: rate=${rateFormatted} ETH, weight=${p.weight} (${weightPct}% of max)`);
        }
        console.log(`        Non-zero weight pools: ${nonZeroCount}`);
        expect(nonZeroCount).to.gt(0);
    });

    it('inspect Uniswap V1 BNB pool reserves and simulate swap', async function () {
        const factory = await ethers.getContractAt('IUniswapFactory', UNISWAP_V1_FACTORY);
        const exchangeAddr = await factory.getExchange(BNB_ADDRESS);
        console.log(`        Uniswap V1 BNB exchange: ${exchangeAddr}`);

        // Check reserves
        const ethBalance = await ethers.provider.getBalance(exchangeAddr);
        const bnbToken = await ethers.getContractAt('IERC20', BNB_ADDRESS);
        const bnbBalance = await bnbToken.balanceOf(exchangeAddr);

        console.log(`        Pool ETH balance: ${ethers.formatEther(ethBalance)} ETH`);
        console.log(`        Pool BNB balance: ${ethers.formatEther(bnbBalance)} BNB`);

        const spotRate = Number(ethBalance) / Number(bnbBalance);
        console.log(`        Spot rate (ETH/BNB): ${spotRate.toFixed(6)}`);
        console.log(`        Spot rate inverted (BNB/ETH): ${(1 / spotRate).toFixed(2)}`);

        // Uniswap V1 exchange ABI for swap simulation
        const exchangeAbi = [
            'function getEthToTokenInputPrice(uint256 eth_sold) view returns (uint256)',
            'function getTokenToEthInputPrice(uint256 tokens_sold) view returns (uint256)',
            'function ethToTokenSwapInput(uint256 min_tokens, uint256 deadline) payable returns (uint256)',
        ];
        const exchange = new ethers.Contract(exchangeAddr, exchangeAbi, ethers.provider);

        // How much BNB do you get for 1 ETH?
        try {
            const bnbFor1Eth = await exchange.getEthToTokenInputPrice(ethers.parseEther('1'));
            console.log(`        Quote: 1 ETH -> ${ethers.formatEther(bnbFor1Eth)} BNB`);
            console.log(`        Effective rate: 1 BNB = ${(1e18 / Number(bnbFor1Eth)).toFixed(6)} ETH`);
        } catch (e) {
            console.log(`        getEthToTokenInputPrice failed: ${e.message}`);
        }

        // How much ETH do you get for 1 BNB?
        try {
            const ethFor1Bnb = await exchange.getTokenToEthInputPrice(ethers.parseEther('1'));
            console.log(`        Quote: 1 BNB -> ${ethers.formatEther(ethFor1Bnb)} ETH`);
        } catch (e) {
            console.log(`        getTokenToEthInputPrice failed: ${e.message}`);
        }

        // Actually simulate a swap: buy BNB with 1 ETH
        const [signer] = await ethers.getSigners();
        const exchangeWithSigner = exchange.connect(signer);
        const bnbBefore = await bnbToken.balanceOf(signer.address);
        try {
            const deadline = Math.floor(Date.now() / 1000) + 3600;
            const tx = await exchangeWithSigner.ethToTokenSwapInput(
                1n, // min_tokens: accept any amount
                deadline,
                { value: ethers.parseEther('1') },
            );
            const receipt = await tx.wait();
            const bnbAfter = await bnbToken.balanceOf(signer.address);
            const bnbReceived = bnbAfter - bnbBefore;
            console.log(`        SWAP SUCCESS: 1 ETH -> ${ethers.formatEther(bnbReceived)} BNB (gas: ${receipt.gasUsed})`);
            console.log(`        Effective swap rate: 1 BNB = ${(1e18 / Number(bnbReceived)).toFixed(6)} ETH`);
        } catch (e) {
            console.log(`        SWAP FAILED: ${e.message.slice(0, 200)}`);
        }
    });

    it('fix: blacklist BNB on UniswapV1 Oracle only and verify BNB price is correct', async function () {
        const UNISWAP_V1_ORACLE = '0xAdF7CC69626eB6F03F4F613832C84Cf62586A6Bb';

        // Deploy a fresh local OffchainOracle with the new blacklist feature
        const deployed = await ethers.getContractAt('OffchainOracle', OFFCHAIN_ORACLE_ADDRESS);
        const [allOracles, oracleTypes] = await deployed.oracles();
        const allConnectors = await deployed.connectors();
        const multiWrapperAddr = await deployed.multiWrapper();
        const owner = await deployed.owner();

        const localOracle = await deployContract('OffchainOracle', [
            multiWrapperAddr,
            Array.from(allOracles),
            Array.from(oracleTypes).map(t => Number(t)),
            Array.from(allConnectors),
            WETH_ADDRESS,
            owner,
        ]);
        console.log(`        Deployed local OffchainOracle at ${await localOracle.getAddress()}`);

        // Rate BEFORE blacklist
        const rateBefore = await localOracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 10);
        console.log(`        BNB/ETH BEFORE (threshold=10): ${Number(rateBefore) / 1e18}`);

        // Impersonate owner and blacklist BNB on UniswapV1 only
        const [signer] = await ethers.getSigners();
        await signer.sendTransaction({ to: owner, value: ethers.parseEther('1') });
        const ownerSigner = await ethers.getImpersonatedSigner(owner);
        await localOracle.connect(ownerSigner).toggleOracleTokenBlacklist(UNISWAP_V1_ORACLE, BNB_ADDRESS);
        console.log(`        Blacklisted BNB on UniswapV1 Oracle (${UNISWAP_V1_ORACLE})`);

        // Verify the blacklist flag is set
        expect(await localOracle.oracleTokenBlacklisted(UNISWAP_V1_ORACLE, BNB_ADDRESS)).to.be.true;

        // Rate AFTER blacklist — should still work (other oracles contribute)
        const rateAfter = await localOracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 10);
        console.log(`        BNB/ETH AFTER  (threshold=10): ${Number(rateAfter) / 1e18}`);
        expect(rateAfter).to.gt(0n);

        // Compare with threshold=50 (which was already correct)
        const rate50 = await localOracle.getRateToEthWithThreshold(BNB_ADDRESS, true, 50);
        console.log(`        BNB/ETH AFTER  (threshold=50): ${Number(rate50) / 1e18}`);

        const diffPct = Math.abs(Number(rateAfter) - Number(rate50)) / Number(rate50) * 100;
        console.log(`        Diff threshold=10 vs 50 after fix: ${diffPct.toFixed(2)}%`);

        // After blacklisting UniV1 for BNB, threshold=10 and threshold=50 should be very close
        expect(diffPct).to.lt(5); // less than 5% difference
    });

    it('check which tokens have Uniswap V1 pools with liquidity', async function () {
        const UNISWAP_V1_ORACLE = '0xAdF7CC69626eB6F03F4F613832C84Cf62586A6Bb';
        const NONE = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';
        const oracle = await ethers.getContractAt('IOracle', UNISWAP_V1_ORACLE);

        const tokensToCheck = {
            BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
            DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
            UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
            AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
            MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
            SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
            COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
            '1INCH': '0x111111111117dC0aa78b770fA6A738034120C302',
            LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
            YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            sUSD: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
            stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        };

        console.log('        Uniswap V1 Oracle liquidity for popular tokens (BNB -> ETH, connector=NONE):');
        for (const [name, addr] of Object.entries(tokensToCheck)) {
            try {
                const { rate, weight } = await oracle.getRate(addr, ETH_ADDRESS, NONE, 0);
                if (weight === 0n) {
                    console.log(`          ${name.padEnd(6)}: no liquidity`);
                } else {
                    const rateFormatted = (Number(rate) / 1e18).toFixed(6);
                    console.log(`          ${name.padEnd(6)}: rate=${rateFormatted} ETH, weight=${weight}`);
                }
            } catch (e) {
                console.log(`          ${name.padEnd(6)}: no V1 pool`);
            }
        }
    });
});
