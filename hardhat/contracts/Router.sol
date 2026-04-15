// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Pool.sol";
import "./Factory.sol";
import "./ERC-20.sol";

contract Router {

    Factory public factory;

    constructor(address _factory) {
        factory = Factory(_factory);
    }

// функция нахождения пути обмена
    function findPath(address tokenIn, address tokenOut) public view returns(address token, address pool1, address pool2)
    {
        address[] memory pools = factory.returnPools();

        for (uint256 i = 0; i < pools.length; i++) {

            Pool pool = Pool(pools[i]);
            // присвоение двух токенов из пула
            address token1 = pool.token1();
            address token2 = pool.token2();

            // проверка есть ли tokenIn в этих пулах
            if (token1 == tokenIn || token2 == tokenIn) {
                if (tokenIn == token1) {
                    token = token2;
                } else {
                    token = token1;
                }

                pool1 = pools[i];

                for (uint256 j = 0; j < pools.length; j++) {
                    Pool pool2Contract = Pool(pools[j]);
                    address token2_1 = pool2Contract.token1();
                    address token2_2 = pool2Contract.token2();

                    if ((token2_1 == token && token2_2 == tokenOut) ||
                        (token2_1 == tokenOut && token2_2 == token)) {
                        pool2 = pools[j];
                        return (token, pool1, pool2);
                    }
                }
            }
        }
        revert("no path");
    }

// функция создания пути
    function createTokens(address tokenIn, address tokenOut, uint256 amountIn) public {

        (address token, address pool1, address pool2) = findPath(tokenIn, tokenOut);

        Pool pool1Contract = Pool(pool1);
        Pool pool2Contract = Pool(pool2);

        ERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        ERC20(tokenIn).transfer(pool1, amountIn);

        pool1Contract.swapTokens(tokenIn, amountIn);
        uint256 amount2 = ERC20(token).balanceOf(address(this));
        ERC20(token).transfer(pool2, amount2);

        pool2Contract.swapTokens(token, amount2);
        uint256 amountOut = ERC20(tokenOut).balanceOf(address(this));
        ERC20(tokenOut).transfer(msg.sender, amountOut);
    }
}