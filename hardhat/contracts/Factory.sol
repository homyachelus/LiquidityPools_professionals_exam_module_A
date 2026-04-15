// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Pool.sol";

contract Factory {

    address[] public pools;

    function createPool (address _token1, address _token2,
        uint256 _reserve1, uint256 _reserve2,
        uint256 _price1, uint256 _price2,
        address _lpToken, address _owner) public {

        Pool contractInstance = new Pool(_token1,_token2, _reserve1, _reserve2, _price1, _price2, _lpToken, _owner);
        pools.push(address(contractInstance));
    }

    function returnPools() public view  returns(address[] memory) {
        return pools;
    }
}