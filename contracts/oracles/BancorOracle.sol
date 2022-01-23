// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IOracle.sol";
import "../libraries/Sqrt.sol";

import "../interfaces/IBancorNetwork.sol";
import "../interfaces/IBancorRegistry.sol";
import "../interfaces/IConverter.sol";
import "../interfaces/IConverterAnchor.sol";

contract BancorOracle is IOracle {
    using Sqrt for uint256;
    
    IBancorRegistry public immutable registry;
    IERC20 private constant _NONE = IERC20(0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF);
    IERC20 private constant _ETH = IERC20(0x0000000000000000000000000000000000000000);
    IERC20 private constant _EEE = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    constructor(IBancorRegistry _registry) {
	registry = _registry;
    }

    function getRate(IERC20 _srcToken, IERC20 _dstToken, IERC20 connector) external view override returns (uint256 rate, uint256 weight) {

	require(connector == _NONE, "connector should be NONE");
	
	IERC20 srcToken = (_srcToken == _ETH) ? _EEE : _srcToken;
	IERC20 dstToken = (_dstToken == _ETH) ? _EEE : _dstToken;
	
	address bancorNetworkAddress = registry.addressOf(bytes32("BancorNetwork"));
	IBancorNetwork bancorNetwork = IBancorNetwork(bancorNetworkAddress);
	address[] memory path = bancorNetwork.conversionPath(srcToken, dstToken);
	require(path.length != 0, "Pool does not exist");

	IReserveToken src = IReserveToken(path[0]);
	address srcAnchor = path[1];

	IReserveToken dst = IReserveToken(path[path.length - 1]);
	address dstAnchor = path[path.length - 2];

	IConverter srcConverter = IConverter(payable(IConverterAnchor(srcAnchor).owner()));
	IConverter dstConverter = IConverter(payable(IConverterAnchor(dstAnchor).owner()));

	uint256 srcBalance = srcConverter.getConnectorBalance(src);
	uint256 dstBalance = dstConverter.getConnectorBalance(dst);

	rate = bancorNetwork.rateByPath(path, 1e18);
	weight = (srcBalance * dstBalance).sqrt();
    }
}
