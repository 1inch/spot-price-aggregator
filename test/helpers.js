const { network } = require('hardhat');
const { Networks } = require('@1inch/solidity-utils/hardhat-setup');

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
    iETH: '0xB983E01458529665007fF7E0CDdeCDB74B967Eb6',
    iDAI: '0x6b093998D36f2C7F0cc359441FBB24CC629D5FF0',
    iUSDC: '0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f',
    oneInchLP1: '0xbAF9A5d4b0052359326A6CDAb54BABAa3a3A9643',
    yaLINK: '0x29E240CFD7946BA20895a7a02eDb25C210f9f324',
    aLINK: '0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84',
    yvWETH: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    yvWBTC: '0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E',
    crvUSD: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
    wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
    BEAN: '0xBEA0000029AD1c77D3d5D23Ba2D8893dB9d1Efab',
    '3CRV': '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
    base: {
        DAI: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        WETH: '0x4200000000000000000000000000000000000006',
        axlUSDC: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
        axlUSDT: '0x7f5373AE26c3E8FfC4c77b7255DF7eC1A9aF52a6',
    },
    optimistic: {
        WETH: '0x4200000000000000000000000000000000000006',
        USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
        OP: '0x4200000000000000000000000000000000000042',
    },
};

const contracts = {
    create3Deployer: '0xD935a2bb926019E0ed6fb31fbD5b1Bbb7c05bf65', // '0x65B3Db8bAeF0215A1F9B14c506D2a3078b2C84AE',
    chaiPot: '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7',
};

const CurveRegistryType = {
    MAIN_REGISTRY: 0,
    METAPOOL_FACTORY: 1,
    CRYPTOSWAP_REGISTRY: 2,
    CRYPTOPOOL_FACTORY: 3,
    METAREGISTRY: 4,
    CRVUSD_PLAIN_POOLS: 5,
    CURVE_TRICRYPTO_FACTORY: 6,
};

const deployParams = {
    AaveWrapperV2: {
        lendingPool: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    },
    AaveWrapperV3: {
        lendingPool: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',
    },
    UniswapV3: {
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
        provider: '0x0000000022D53366457F9d5E68Ec105046FC4383',
        maxPools: 100,
        registryIds: [0, 3, 5, 6, 7, 8, 11],
        registryTypes: [
            CurveRegistryType.MAIN_REGISTRY,
            CurveRegistryType.METAPOOL_FACTORY,
            CurveRegistryType.CRYPTOSWAP_REGISTRY,
            CurveRegistryType.CRYPTOPOOL_FACTORY,
            CurveRegistryType.METAREGISTRY,
            CurveRegistryType.CRVUSD_PLAIN_POOLS,
            CurveRegistryType.CURVE_TRICRYPTO_FACTORY,
        ],
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
    VelocimieterV2: { // base network
        factory: '0xe21aac7f113bd5dc2389e4d8a8db854a87fd6951',
        initcodeHash: '0x0ccd005ee58d5fb11632ef5c2e0866256b240965c62c8e990c0f84a97f311879',
    },
    VelodromeV2: { // optimistic network
        router: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858',
        registry: '0xF4c67CdEAaB8360370F41514d06e32CcD8aA1d7B',
    },
};

const resetHardhatNetworkFork = async function (networkName) {
    if (networkName.toLowerCase() === 'hardhat') {
        await network.provider.request({ // reset to local network
            method: 'hardhat_reset',
            params: [],
        });
    } else {
        const { url, authKeyHttpHeader } = (new Networks())._parseRpcEnv(process.env[`${networkName.toUpperCase()}_RPC_URL`]);
        await network.provider.request({ // reset to networkName fork
            method: 'hardhat_reset',
            params: [{
                forking: {
                    jsonRpcUrl: url,
                    httpHeaders: authKeyHttpHeader ? { 'auth-key': authKeyHttpHeader } : undefined,
                },
            }],
        });
    }
};

module.exports = {
    defaultValues,
    tokens,
    contracts,
    deployParams,
    resetHardhatNetworkFork,
};
