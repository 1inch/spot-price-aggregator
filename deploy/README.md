# Description of Deploy Scripts

This directory houses a suite of scripts designed for the deployment and administration of oracles. Each script's purpose and application are detailed below. Those residing in the `use-create3` directory specifically leverage the CREATE3 method for deployment. Prior to running these scripts, ensure they are properly configured by populating the `PARAMS` constant with the appropriate data.

```
.
├── use-create3
│   ├── deploy-oracle-and-add
│   ├── deploy-wrapper-and-add
│   ├── redeploy-offchain-oracle
│   ├── redeploy-oracle
│   ├── redeploy-wrapper
│   ├── deploy-proxy
│   └── simple-deploy
├── deploy-oracle-and-add
├── deploy-wrapper-and-add
├── redeploy-offchain-oracle
├── redeploy-oracle
├── redeploy-wrapper
├── deploy-proxy
└── simple-deploy
```

### Scripts:

**1. `simple-deploy`**
- A straightforward script to deploy contracts (Oracles, Wrappers, MultiWrapper, OffchainOracle, etc.). It could be used for any contracts.

**2. `deploy-oracle-and-add`**
- This script deploys an Oracle and subsequently adds it to OffchainOracle.

**3. `deploy-wrapper-and-add`**
- This script deploys a Wrapper and subsequently adds it to MultiWrapper.

**4. `redeploy-offchain-oracle`**
- This script is specifically for deploying OffchainOracle with the parameters from the already deployed OffchainOracle and the current implementation in the repository.

**5. `redeploy-oracle`**
- Facilitates the redeployment or updating of an existing Oracle. It is exchange existing Oracle in OffchainOracle to current implementation in repository.

**6. `redeploy-wrapper`**
- Facilitates the redeployment or updating of an existing Wrapper. It is exchange existing Wrapper in MultiWrapper to current implementation in repository.

**7. `deploy-proxy`**
- This script helps deploy a proxy contract for the OffchainOracle, allowing future upgrades of the contract while retaining the same address by only changing the implementation.

**8. `use-create3/...`**
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
   ETHERSCAN_API_KEY=explorer key for verifying contract source code
   ```
   You can find network names by default in the `registerAll` [method](https://github.com/1inch/solidity-utils/blob/master/hardhat-setup/networks.ts) in `@1inch/solidity-utils`.
   
3. Optional add additional actions if you need it - just add necessary lines in script (for example `addMarkets` for some wrappers).
   
4. Run script:
   ```
   yarn deploy <NETWORK_NAME>
   ```
   
5. Don't forget to revert the `skip` value afterward:
    ```
   module.exports.skip = async () => true;
   ```
