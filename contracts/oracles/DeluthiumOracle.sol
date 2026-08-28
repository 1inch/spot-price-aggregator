// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IOracle.sol";

/**
 * @title DeluthiumOracle
 * @notice Off-chain oracle for Deluthium RFQ pricing
 * @dev Prices are pushed by trusted updater from Deluthium API.
 *      Since Deluthium operates via off-chain RFQ API, this oracle uses a price updater pattern:
 *      1. Off-chain service fetches indicative prices from Deluthium API
 *      2. Trusted updater pushes prices on-chain periodically
 *      3. getRate() reads from stored prices with freshness check
 */
contract DeluthiumOracle is IOracle, Ownable {
    struct PriceData {
        uint256 rate;       // Price rate (scaled by 1e18)
        uint256 weight;     // Liquidity weight
        uint256 timestamp;  // Last update time
    }

    /// @notice Trusted price updater address
    address public priceUpdater;

    /// @notice Mapping: keccak256(srcToken, dstToken) => PriceData
    mapping(bytes32 => PriceData) public prices;

    /// @notice Maximum age for price validity (default: 5 minutes)
    uint256 public maxPriceAge = 300;

    /// @notice NONE connector constant
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);

    event PriceUpdated(address indexed srcToken, address indexed dstToken, uint256 rate, uint256 weight);
    event PriceUpdaterChanged(address indexed oldUpdater, address indexed newUpdater);
    event MaxPriceAgeChanged(uint256 oldAge, uint256 newAge);

    error UnauthorizedUpdater();
    error InvalidArrayLength();
    error ZeroAddress();

    constructor(address _priceUpdater) Ownable(msg.sender) {
        if (_priceUpdater == address(0)) revert ZeroAddress();
        priceUpdater = _priceUpdater;
    }

    modifier onlyPriceUpdater() {
        if (msg.sender != priceUpdater) revert UnauthorizedUpdater();
        _;
    }

    /**
     * @notice Update price for a token pair
     * @param srcToken Source token address
     * @param dstToken Destination token address
     * @param rate Price rate (scaled by 1e18)
     * @param weight Liquidity weight
     */
    function updatePrice(
        address srcToken,
        address dstToken,
        uint256 rate,
        uint256 weight
    ) external onlyPriceUpdater {
        bytes32 key = keccak256(abi.encodePacked(srcToken, dstToken));
        prices[key] = PriceData({
            rate: rate,
            weight: weight,
            timestamp: block.timestamp
        });
        emit PriceUpdated(srcToken, dstToken, rate, weight);
    }

    /**
     * @notice Batch update prices for multiple pairs
     * @param srcTokens Array of source token addresses
     * @param dstTokens Array of destination token addresses
     * @param rates Array of price rates
     * @param weights Array of liquidity weights
     */
    function batchUpdatePrices(
        address[] calldata srcTokens,
        address[] calldata dstTokens,
        uint256[] calldata rates,
        uint256[] calldata weights
    ) external onlyPriceUpdater {
        uint256 length = srcTokens.length;
        if (length != dstTokens.length || length != rates.length || length != weights.length) {
            revert InvalidArrayLength();
        }

        for (uint256 i = 0; i < length; ) {
            bytes32 key = keccak256(abi.encodePacked(srcTokens[i], dstTokens[i]));
            prices[key] = PriceData({
                rate: rates[i],
                weight: weights[i],
                timestamp: block.timestamp
            });
            emit PriceUpdated(srcTokens[i], dstTokens[i], rates[i], weights[i]);
            unchecked { ++i; }
        }
    }

    /**
     * @notice Get rate for a token pair (IOracle interface)
     * @param srcToken Source token
     * @param dstToken Destination token
     * @param connector Connector token (must be NONE for Deluthium)
     * @param thresholdFilter Minimum weight filter
     * @return rate Price rate
     * @return weight Liquidity weight
     */
    function getRate(
        IERC20 srcToken,
        IERC20 dstToken,
        IERC20 connector,
        uint256 thresholdFilter
    ) external view override returns (uint256 rate, uint256 weight) {
        // Deluthium doesn't use connectors - only direct pairs
        if (connector != IERC20(address(0)) && connector != _NONE) {
            revert ConnectorShouldBeNone();
        }

        bytes32 key = keccak256(abi.encodePacked(address(srcToken), address(dstToken)));
        PriceData memory data = prices[key];

        // Check price freshness
        if (data.timestamp == 0 || block.timestamp - data.timestamp > maxPriceAge) {
            return (0, 0);
        }

        // Apply threshold filter
        if (data.weight < thresholdFilter) {
            return (0, 0);
        }

        return (data.rate, data.weight);
    }

    /**
     * @notice Get raw price data for a token pair
     * @param srcToken Source token address
     * @param dstToken Destination token address
     * @return data The price data struct
     */
    function getPriceData(address srcToken, address dstToken) external view returns (PriceData memory data) {
        bytes32 key = keccak256(abi.encodePacked(srcToken, dstToken));
        return prices[key];
    }

    /**
     * @notice Check if price is fresh
     * @param srcToken Source token address
     * @param dstToken Destination token address
     * @return isFresh True if price is within maxPriceAge
     */
    function isPriceFresh(address srcToken, address dstToken) external view returns (bool isFresh) {
        bytes32 key = keccak256(abi.encodePacked(srcToken, dstToken));
        PriceData memory data = prices[key];
        return data.timestamp != 0 && block.timestamp - data.timestamp <= maxPriceAge;
    }

    /**
     * @notice Change price updater address
     * @param _priceUpdater New price updater address
     */
    function setPriceUpdater(address _priceUpdater) external onlyOwner {
        if (_priceUpdater == address(0)) revert ZeroAddress();
        emit PriceUpdaterChanged(priceUpdater, _priceUpdater);
        priceUpdater = _priceUpdater;
    }

    /**
     * @notice Change maximum price age
     * @param _maxPriceAge New max price age in seconds
     */
    function setMaxPriceAge(uint256 _maxPriceAge) external onlyOwner {
        emit MaxPriceAgeChanged(maxPriceAge, _maxPriceAge);
        maxPriceAge = _maxPriceAge;
    }
}
