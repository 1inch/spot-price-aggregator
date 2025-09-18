const { ethers } = require('hardhat');
const { assertRoughlyEqualValues } = require('@1inch/solidity-utils');

const defaultValues = {
    thresholdFilter: 10,
};

const tokens = {
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    NONE: '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
    ETH: '0x0000000000000000000000000000000000000000',
    EEE: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    '1INCH': '0x111111111117dC0aa78b770fA6A738034120C302',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    LINK: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    BZRX: '0x56d811088235F11C8920698a204A5010a788f4b3',
    MKR: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    UNI: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    AAVE: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    LRC: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
    COMP: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    CHAI: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    sBTC: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
    sDAI: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
    sLINK: '0xbBC455cb4F1B9e4bFC4B73970d360c8f032EfEE6',
    sKRW: '0x269895a3dF4D73b077Fc823dD6dA1B95f72Aaf9B',
    sUSD: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    sUSDe: '0x9D39A5DE30e57443BfF2A8307A4256c8797A3497',
    USDe: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
    SNX: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    XRA: '0x7025bab2ec90410de37f488d1298204cd4d6b29d',
    aDAIV1: '0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d',
    aDAIV2: '0x028171bCA77440897B824Ca71D1c56caC55b68A3',
    aDAIV3: '0x018008bfb33d285247A21d44E50697654f754e63',
    aETHV1: '0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04',
    aWETHV2: '0x030bA81f1c18d280636F32af80b9AAd02Cf0854e',
    aWETHV3: '0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8',
    cDAI: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    cETH: '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5',
    cUSDCv3: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
    cWETHv3: '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
    iETH: '0xB983E01458529665007fF7E0CDdeCDB74B967Eb6',
    iDAI: '0x6b093998D36f2C7F0cc359441FBB24CC629D5FF0',
    iUSDC: '0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f',
    oneInchLP1: '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643',
    yaLINK: '0x29E240CFD7946BA20895a7a02eDb25C210f9f324',
    aLINK: '0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
    yvWETH: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    yvWBTC: '0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E',
    crvUSD: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
    scrvUSD: '0x0655977FEb2f289A4aB78af67BAB0d17aAb84367',
    wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    BEAN: '0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab',
    '3CRV': '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
    stataUSDC: '0x73edDFa87C71ADdC275c2b9890f5c3a8480bC9E6',
    stataWETH: '0x252231882FB38481497f3C767469106297c8d93b',
    stataDAI: '0xaf270C38fF895EA3f95Ed488CEACe2386F038249',
    xrETH: '0xBB22d59B73D7a6F3A8a83A214BECc67Eb3b511fE',
    base: {
        WETH: '0x4200000000000000000000000000000000000006',
        DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        axlUSDC: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
        rETH: '0xb6fe221fe9eef5aba221c348ba20a1bf5e73624c',
        superOETHb: '0xDBFeFD2e8460a6Ee4955A68582F85708BAEA60A3',
        wsuperOETHb: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6',
    },
    optimistic: {
        WETH: '0x4200000000000000000000000000000000000006',
        USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        OP: '0x4200000000000000000000000000000000000042',
        DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
    matic: {
        WETH: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    },
};

const contracts = {
    create3Deployer: '0xD935a2bb926019E0ed6fb31fbD5b1Bbb7c05bf65', // '0x65B3Db8bAeF0215A1F9B14c506D2a3078b2C84AE',
    chaiPot: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
};

const deployParams = {
    AaveWrapperV2: {
        lendingPool: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    },
    AaveWrapperV3: {
        lendingPool: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',
    },
    StataTokenWrapper: {
        staticATokenFactory: '0x411D79b8cC43384FDE66CaBf9b6a17180c842511',
    },
    UniswapV3: {
        factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        initcodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
        fees: [100, 500, 3000, 10000],
    },
    UniswapV4: {
        stateView: '0x7ffe42c4a5deea5b0fec41c94c136cf115597227',
        backGeoOracle: '0xB13250f0Dc8ec6dE297E81CDA8142DB51860BaC4',
        fees: [100, 500, 3000, 10000],
        tickSpacings: [1, 10, 60, 200],
    },
    UniswapV3Base: { // base network
        factory: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
        initcodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
        fees: [100, 500, 3000, 10000],
    },
    UniswapV3Polygon: { // polygon network
        factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        initcodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
        fees: [100, 500, 3000, 10000],
    },
    Chainlink: '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf',
    CompoundWrapper: {
        comptroller: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
    },
    UniswapV2: {
        factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
        initcodeHash: '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f',
    },
    Curve: {
        provider: '0x5ffe7FB82894076ECB99A30D6A32e969e6e35E98',
        maxPools: 100,
    },
    Dodo: {
        dodoZoo: '0x3A97247DF274a17C59A3bd12735ea3FcDFb49950',
    },
    DodoV2: {
        factory: '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C',
    },
    KyberDmm: {
        factory: '0x833e4083b7ae46cea85695c4f7ed25cdad8886de',
    },
    Mooniswap: {
        factory: '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643',
    },
    Uniswap: {
        factory: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
    },
    Synthetix: {
        proxy: '0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2',
    },
    ShibaSwap: {
        factory: '0x115934131916c8b277dd010ee02de363c09d037c',
        initcodeHash: '0x65d1a3b1e46c6e4f1be1ad5f99ef14dc488ae0549dc97db9b30afe2241ce1c7a',
    },
    PancakeV3: {
        factory: '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9', // poolDeployer
        initcodeHash: '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2',
        fees: [100, 500, 2500, 10000],
    },
    VelocimeterV2: { // base network
        factory: '0xe21aac7f113bd5dc2389e4d8a8db854a87fd6951',
        initcodeHash: '0x0ccd005ee58d5fb11632ef5c2e0866256b240965c62c8e990c0f84a97f311879',
    },
    VelodromeV2: { // optimistic network
        factory: '0xF1046053aa5682b4F9a81b5481394DA16BE5FF5a',
        initcodeHash: '0xc0629f1c7daa09624e54d4f711ba99922a844907cce02997176399e4cc7e8fcf',
    },
    Slipstream: { // optimistic network
        factory: '0xCc0bDDB707055e04e497aB22a59c2aF4391cd12F',
        initcodeHash: '0x339492e30b7a68609e535da9b0773082bfe60230ca47639ee5566007d525f5a7',
        tickSpacings: [1, 50, 100, 200, 2_000],
    },
    Aerodrome: { // base network
        factory: '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
        initcodeHash: '0x6f178972b07752b522a4da1c5b71af6524e8b0bd6027ccb29e5312b0e5bcdc3c',
    },
    QuickSwapV3: { // polygon network
        factory: '0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92', // poolDeployer
        initcodeHash: '0x6ec6c9c8091d160c0aa74b2b14ba9c1717e95093bd3ac085cee99a49aab294a4',
    },
};

async function measureGas (tx, comment) {
    const receipt = await tx.wait();
    console.log('gasUsed', comment, receipt.gasUsed.toString());
}

function _parseTokenForTestRate (token) {
    let targetToken = token;
    let referenceToken = token;
    if (Array.isArray(token)) {
        targetToken = token[0];
        referenceToken = token[1];
    }
    return { targetToken, referenceToken };
}

async function _getDecimals (token) {
    if (token === tokens.ETH || token === token.EEE) {
        return 18n;
    }
    const contract = await ethers.getContractAt('ERC20', token);
    return await contract.decimals();
}

async function testRate (srcToken, dstToken, connector, targetOracle, referenceOracle, relativeDiff = 0.05, thresholdFilter = defaultValues.thresholdFilter) {
    const { targetToken: targetSrcToken, referenceToken: referenceSrcToken } = _parseTokenForTestRate(srcToken);
    const { targetToken: targetDstToken, referenceToken: referenceDstToken } = _parseTokenForTestRate(dstToken);
    let { rate: actual } = await targetOracle.getRate(targetSrcToken, targetDstToken, connector, thresholdFilter);
    let { rate: expected } = await referenceOracle.getRate(referenceSrcToken, referenceDstToken, connector, thresholdFilter);

    const targetSrcTokenDecimals = await _getDecimals(targetSrcToken);
    const referenceSrcTokenDecimals = await _getDecimals(referenceSrcToken);
    const targetDstTokenDecimals = await _getDecimals(targetDstToken);
    const referenceDstTokenDecimals = await _getDecimals(referenceDstToken);

    if (targetSrcTokenDecimals > referenceSrcTokenDecimals) {
        const diff = targetSrcTokenDecimals - referenceSrcTokenDecimals;
        expected = expected / (10n ** diff);
    }

    if (targetDstTokenDecimals > referenceDstTokenDecimals) {
        const diff = targetDstTokenDecimals - referenceDstTokenDecimals;
        actual = actual / (10n ** diff);
    }
    assertRoughlyEqualValues(expected, actual, relativeDiff);
}

async function testRateOffchainOracle (srcToken, dstToken, oldOffchainOracle, newOffchainOracle, relativeDiff = 0.05, thresholdFilter = defaultValues.thresholdFilter) {
    const { targetToken: targetSrcToken, referenceToken: referenceSrcToken } = _parseTokenForTestRate(srcToken);
    const { targetToken: targetDstToken, referenceToken: referenceDstToken } = _parseTokenForTestRate(dstToken);
    const actualRate = await newOffchainOracle.getRateWithThreshold(targetSrcToken, targetDstToken, true, thresholdFilter);
    const expectedRate = await oldOffchainOracle.getRateWithThreshold(referenceSrcToken, referenceDstToken, true, thresholdFilter);
    assertRoughlyEqualValues(actualRate, expectedRate, relativeDiff);
}

module.exports = {
    defaultValues,
    tokens,
    contracts,
    deployParams,
    measureGas,
    testRate,
    testRateOffchainOracle,
};
