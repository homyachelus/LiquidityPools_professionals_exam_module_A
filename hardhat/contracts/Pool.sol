// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ERC-20.sol";

contract Pool {

// адреса, количесвто и працс первого и второго токена в пуле
    address public token1;
    uint256 public reserve1;
    uint256 public price1;

    address public token2;
    uint256 public reserve2;
    uint256 public price2;

// владелец контракта
    address public owner;

    address public lpToken;

    constructor(address _token1, address _token2,
                uint256 _reserve1, uint256 _reserve2,
                uint256 _price1, uint256 _price2,
                address _lpToken, address _owner) {

        token1 = _token1;
        token2 = _token2;

        reserve1 = _reserve1;
        reserve2 = _reserve2;

        price1 = _price1;
        price2 = _price2;

        lpToken = _lpToken;
        owner = _owner;
    }


// функция поддержки ликвидности
    function addLiquidity(uint256 _amount, address _tokenIn, uint256 LPprice) public {

        if (_tokenIn == token1) {

            ERC20(token1).transferFrom(msg.sender, address(this), _amount);
            reserve1 += _amount;
        }

        else if (_tokenIn == token2) {

            ERC20(token2).transferFrom(msg.sender, address(this), _amount);
            reserve2 += _amount;
        }

        else {revert("no token");}

        uint256 lpAmount = _amount / LPprice;
        ERC20(lpToken).mint(msg.sender, lpAmount);
    }

// фукнция обмена токенов
    function swapTokens(address _tokenIn, uint256 _amount) public {

        if (_tokenIn == token1) {

            uint256 amountOut = (_amount * reserve2) / reserve1;

            require(reserve2 >= amountOut, "no liquidity");

            ERC20(token2).transfer(msg.sender, amountOut);

            reserve1 += _amount;
            reserve2 -= amountOut;

        } else if (_tokenIn == token2) {

            uint256 amountOut = (_amount * reserve1) / reserve2;

            require(reserve1 >= amountOut, "no liquidity");

            ERC20(token1).transfer(msg.sender, amountOut);

            reserve2 += _amount;
            reserve1 -= amountOut;

        } else {
            revert("no token");
        }
    }
}