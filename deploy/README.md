# Description of Deploy Scripts

This directory houses a suite of scripts designed for the deployment and administration of oracles. Each script's purpose and application are detailed below. Those residing in the `use-create3` directory specifically leverage the CREATE3 method for deployment. Prior to running these scripts, ensure they are properly configured by populating the `PARAMS` constant with the appropriate data.

```
.
├── use-create3
│   ├── deploy-oracle-and-add
│   ├── redeploy-offchain-oracle
│   ├── redeploy-oracle
│   └── simple-deploy-oracle
├── deploy-oracle-and-add
├── redeploy-offchain-oracle
├── redeploy-oracle
└── simple-deploy-oracle
```

### Scripts:

**1. `simple-deploy-oracle`**
- A straightforward script to deploy an Oracle. It could be used as for Oracles as for OffchainOracle.

**2. `deploy-oracle-and-add`**
- This script deploys an Oracle and subsequently adds it to OffchainOracle.

**3. `redeploy-oracle`**
- Facilitates the redeployment or updating of an existing Oracle. It is exchange existing Oracle in OffchainOracle to current implementation in repository.

**4. `redeploy-offchain-oracle`**
- This script is specifically for deploying OffchainOracle with the parameters from the already deployed OffchainOracle and the current implementation in the repository.

**5. `use-create3/...`**
- These scripts are tailored for deployment in the same manner as those outside `use-create3` directory, but they exclusively utilize the CREATE3 method for deployment.

## Usage

To use any of the scripts:
1. Modify the `skip` value in the script file:
   ```
   module.exports.skip = async () => false;
   ```

2. Set the environment variables (for instance, in the `.env` file):
   ```
   <NETWORK_NAME>_RPC_URL=node RPC URL
   <NETWORK_NAME>_PRIVATE_KEY=deployer's private key
   <NETWORK_NAME>_ETHERSCAN_KEY=explorer key for verifying contract source code
   ```
   You can find network names in the `hardhat.networks.js` file.
   
3. Run script:
   ```
   yarn deploy <NETWORK_NAME>
   ```
   
4. Don't forget to revert the `skip` value afterward:
    ```
   module.exports.skip = async () => true;
   ```

