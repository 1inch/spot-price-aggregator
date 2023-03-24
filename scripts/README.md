# Description of Scripts and Environment Settings

## check-token
`yarn && yarn scripts:check-token`

#### Script Description

This script is designed to interact with the OffchainOracle smart contract. It deploys a new OffchainOracle contract to the fork of the network and retrieves the price of a specified token, displaying the results in the console. The script also goes through the list of oracles that were previously added to OffchainOracle, retrieves prices for each oracle through the appropriate connectors, and presents them in a table format on the console.

#### Environment Settings

The script's behavior is controlled by environment variables, which are specified as follows:
 - `SCRIPT_ETH_PRICE` (required) - The current price of ETH in USD.
 - `SCRIPT_TOKEN` (required) - The address of the token that is being checked. This is the token for which the script will retrieve the price from OffchainOracle.
 - `SCRIPT_NETWORK_NAME` (optional) - Specifies the network from which OffchainChain's address is obtained during deployment. If not specified, the script defaults to the mainnet.

## check-tokens-prices
`yarn && yarn scripts:check-tokens-prices`

#### Script Description

The script compares the prices of a list of tokens in two different instances of the OffchainOracle contract: the deployed version on a specified network, and a new instance deployed from the current repository. The prices are compared and the difference is displayed in a table format. The script also allows for the addition or skipping of certain oracles during the comparison process.

#### Environment Settings

The script's behavior is controlled by environment variables, which are specified as follows:
- `SCRIPT_ETH_PRICE` (required) - The current price of ETH in USD.
- `SCRIPT_TOKENLIST` (required) - Path to a file with list of tokens to be checked. The list can either be an array of token addresses or an object with token addresses as keys.
    - Example: result of `https://token-prices.1inch.io/v1.1/1`
- `SCRIPT_NETWORK_NAME` (optional) - Specifies the network from which OffchainOracle's address is obtained during deployment. If not specified, the script defaults to the mainnet.
- `SCRIPT_SKIP_ORACLES` (optional) - Comma-separated list of oracle addresses that should not be added from a deployed oracle.
- `SCRIPT_ADD_ORACLES` (optional) - Tube-separated (`|`) list of new oracles to be added. Each entry in the list should follow the format `ContractOracleName:OracleType:[constructor params]`
    - Example for add current implementation of UniswapV3Oracle without constructor:
        ```
        SCRIPT_ADD_ORACLES=UniswapV3Oracle:0:
        ```
    - Example for add current implementation of all oracles which support connectors:
        ```
        SCRIPT_ADD_ORACLES=UniswapV3Oracle:0:|KyberDmmOracle:0:["0x833e4083b7ae46cea85695c4f7ed25cdad8886de"]|UniswapV2LikeOracle:0:["0x115934131916c8b277dd010ee02de363c09d037c","0x65d1a3b1e46c6e4f1be1ad5f99ef14dc488ae0549dc97db9b30afe2241ce1c7a"]
        ```

Note that the `SCRIPT_TOKENLIST` must be a valid path to a file containing the list of tokens to be checked. The script uses the require function to import the file, so it must be either a JavaScript or JSON file.
