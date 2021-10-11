// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;
pragma abicoder v1;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IChainlink {
    /**
 * @notice get data about the latest round. Consumers are encouraged to check
 * that they're receiving fresh data by inspecting the updatedAt and
 * answeredInRound return values.
 * Note that different underlying implementations of AggregatorV3Interface
 * have slightly different semantics for some of the return values. Consumers
 * should determine what implementations they expect to receive
 * data from and validate that they can properly handle return data from all
 * of them.
 * @param base base asset address
 * @param quote quote asset address
 * @return roundId is the round ID from the aggregator for which the data was
 * retrieved combined with a phase to ensure that round IDs get larger as
 * time moves forward.
 * @return answer is the answer for the given round
 * @return startedAt is the timestamp when the round was started.
 * (Only some AggregatorV3Interface implementations return meaningful values)
 * @return updatedAt is the timestamp when the round last was updated (i.e.
 * answer was last computed)
 * @return answeredInRound is the round ID of the round in which the answer
 * was computed.
 * (Only some AggregatorV3Interface implementations return meaningful values)
 * @dev Note that answer and updatedAt may change between queries.
 */
    function latestRoundData(
        IERC20 base,
        address quote
    )
    external
    view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}
