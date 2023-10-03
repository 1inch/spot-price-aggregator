const { ethers } = require('hardhat');
const { constants, deployAndGetContract } = require('@1inch/solidity-utils');

// not idemponent. Needs to be rewritten a bit if another run is required
const _addCompoundTokens = async (compoundLikeWrapper, cTokens) => {
    await (await compoundLikeWrapper.addMarkets(cTokens)).wait();
};

const _zip = (a, b) => a.map((k, i) => [k, b[i]]);

async function addAaveTokens (aaveWrapperV2, AAWE_WRAPPER_TOKENS) {
    const aTokens = await Promise.all(AAWE_WRAPPER_TOKENS.map(x => aaveWrapperV2.tokenToaToken(x)));
    const tokensToDeploy = _zip(AAWE_WRAPPER_TOKENS, aTokens).filter(([, aToken]) => aToken === constants.ZERO_ADDRESS).map(([token]) => token);
    if (tokensToDeploy.length > 0) {
        console.log('AaveWrapperV2 tokens to deploy: ', tokensToDeploy);
        await (await aaveWrapperV2.addMarkets(tokensToDeploy)).wait();
    } else {
        console.log('All tokens are already deployed');
    }
}

const deployCompoundTokenWrapper = async (contractInfo, tokenName, deployments, deployer, deploymentName = `CompoundLikeWrapper_${contractInfo.name}`) => {
    const comptroller = await ethers.getContractAt('IComptroller', contractInfo.address);
    const cToken = (await comptroller.getAllMarkets()).filter(token => token !== tokenName);
    console.log(`Found ${contractInfo.name} cTokens: ${cToken}`);
    const wrapper = await deployAndGetContract({
        contractName: 'CompoundLikeWrapper',
        constructorArgs: [contractInfo.address, tokenName],
        deployments,
        deployer,
        deploymentName,
    });
    await _addCompoundTokens(wrapper, cToken);
    return wrapper;
};

const _getContract = async (contractName, contractAddress) => {
    const contractFactory = await ethers.getContractFactory(contractName);
    return contractFactory.attach(contractAddress);
};

const getContract = async (deployments, contractName, deploymentName = contractName) => {
    return _getContract(contractName, (await deployments.get(deploymentName)).address);
};

module.exports = {
    addAaveTokens,
    deployCompoundTokenWrapper,
    getContract,
};
