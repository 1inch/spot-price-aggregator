const { getChainId } = require('hardhat');
const { deployAndGetContract, toBN } = require('@1inch/solidity-utils');
const { tokens } = require('../../test/helpers.js');
const { deployCompoundTokenWrapper } = require('../utils.js');

const cETHbastion = '0x4E8fE8fd314cFC09BDb0942c5adCC37431abDCD0';
const auETHaurigami = '0xca9511B610bA5fc7E311FDeF9cE16050eE4449E9';
const WETH = '0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB';

const connectors = [
    tokens.ETH,
    tokens.NONE,
    WETH,
];

const ORACLES = {
    Trisolaris: {
        factory: '0xc66F594268041dB60507F00703b152492fb176E7',
        initHash: '0x754e1d90e536e4c1df81b7f030f47b4ca80c87120e145c294f098c83a6cb5ace',
    },
    WannaSwap: {
        factory: '0x7928D4FeA7b2c90C732c10aFF59cf403f0C38246',
        initHash: '0xa06b8b0642cf6a9298322d0c8ac3c68c291ca24dc66245cf23aa2abc33b57e21',
    },
    NearPAD: {
        factory: '0x34484b4E416f5d4B45D4Add0B6eF6Ca08FcED8f1',
        initHash: '0xe18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303',
    },
    AuroraSwap: {
        factory: '0xC5E1DaeC2ad401eBEBdd3E32516d90Ab251A3aA3',
        initHash: '0xb919a60aa3c8bbfdcc188f8aad10c9d83aa77960d72f2586258a16c280a90ed4',
    },
};

const WRAPPERS = {
    compound: {
        bastion: {
            address: '0x6De54724e128274520606f038591A00C5E94a1F6',
            name: 'Bastion',
        },
        aurigami: {
            address: '0x817af6cfAF35BdC1A634d6cC94eE9e4c68369Aeb',
            name: 'Aurigami',
        },
    },
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running aurora deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '1313161554') {
        console.log('skipping wrong chain id deployment');
        return;
    }

    const { deployer } = await getNamedAccounts();

    const baseCoinWrapper = await deployAndGetContract({
        contractName: 'BaseCoinWrapper',
        constructorArgs: [WETH],
        deployments,
        deployer,
    });
    const bastionWrapper = await deployCompoundTokenWrapper(WRAPPERS.compound.bastion, cETHbastion, deployments, deployer);
    const aurigamiWrapper = await deployCompoundTokenWrapper(WRAPPERS.compound.aurigami, auETHaurigami, deployments, deployer);

    const multiWrapper = await deployAndGetContract({
        contractName: 'MultiWrapper',
        constructorArgs: [[
            baseCoinWrapper.address,
            bastionWrapper.address,
            aurigamiWrapper.address,
        ]],
        deployments,
        deployer,
    });

    const trisolaris = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.Trisolaris.factory, ORACLES.Trisolaris.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_Trisolaris',
    });
    const wannaSwap = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.WannaSwap.factory, ORACLES.WannaSwap.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_WannaSwap',
    });
    const nearPAD = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.NearPAD.factory, ORACLES.NearPAD.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_NearPAD',
    });
    const auroraSwap = await deployAndGetContract({
        contractName: 'UniswapV2LikeOracle',
        constructorArgs: [ORACLES.AuroraSwap.factory, ORACLES.AuroraSwap.initHash],
        deployments,
        deployer,
        deploymentName: 'UniswapV2LikeOracle_AuroraSwap',
    });

    await deployAndGetContract({
        contractName: 'OffchainOracle',
        constructorArgs: [
            multiWrapper.address,
            [
                trisolaris.address,
                wannaSwap.address,
                nearPAD.address,
                auroraSwap.address,
            ],
            [
                (toBN('0')).toString(),
                (toBN('0')).toString(),
                (toBN('0')).toString(),
                (toBN('0')).toString(),
            ],
            connectors,
            WETH,
        ],
        deployments,
        deployer,
    });
};

module.exports.skip = async () => true;
