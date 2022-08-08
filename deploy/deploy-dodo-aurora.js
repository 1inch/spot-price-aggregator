const hre = require('hardhat');
const { getChainId, ethers } = hre;

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running dodo aurora deploy script');
    const chainId = await getChainId();
    console.log('network id ', chainId);
    if (chainId !== '1313161554') {
        console.log('skipping wrong chain id deployment:', chainId);
        return;
    }

    const { deploy, getOrNull } = deployments;
    const { deployer } = await getNamedAccounts();

    const delay = (ms) =>
        new Promise((resolve) => {
            setTimeout(resolve, ms);
        });

    const tryRun = async (f, n = 10) => {
        if (typeof f !== 'function') {
            throw Error('f is not a function');
        }
        for (let i = 0; ; i++) {
            try {
                return await f();
            } catch (error) {
                if (error.message === 'Contract source code already verified' || error.message.includes('Reason: Already Verified')) {
                    console.log('Contract already verified. Skipping verification');
                    break;
                }
                console.error(error);
                await delay(1000);
                if (i > n) {
                    throw new Error(`Couldn't verify deploy in ${n} runs`);
                }
            }
        }
    };

    const idempotentDeploy = async (contractName, constructorArgs, deploymentName = contractName) => {
        const existingContract = await getOrNull(deploymentName);
        if (existingContract) {
            console.log(`Skipping deploy for existing contract ${contractName} (${deploymentName})`);
            return existingContract;
        }

        const contract = await deploy(deploymentName, {
            args: constructorArgs,
            from: deployer,
            contract: contractName,
        });

        await tryRun(() => hre.run('verify:verify', {
            address: contract.address,
            constructorArguments: constructorArgs,
        }));

        return contract;
    };

    const dodo = await idempotentDeploy('DodoOracle', ['0xf50BDc9E90B7a1c138cb7935071b85c417C4cb8e']);
    const dodoV2 = await idempotentDeploy('DodoV2Oracle', ['0x5515363c0412AdD5c72d3E302fE1bD7dCBCF93Fe']);

    const OffchainOracle = await ethers.getContractFactory('OffchainOracle');
    const offchainOracle = OffchainOracle.attach((await deployments.get('OffchainOracle')).address);

    const txns = [];

    txns.push(await offchainOracle.addOracle(dodo.address));
    txns.push(await offchainOracle.addMarkets(dodoV2.address));

    await Promise.all(txns);
};

module.exports.skip = async () => false;
