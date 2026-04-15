// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC-20.sol";

contract Staking {
    
    ERC20 public lpToken;
    ERC20 public rewardToken;
    uint256 public totalStaked;

    uint256 public rewardPerSecond = 13; // награда в сек
    uint256 public constant SCALE = 1e18;

    address public owner;

    mapping(address => uint256) public stakedBalance; // сколько профи застейкал
    mapping(address => uint256) public lastRewardTime; // когда последний раз получал награду
    mapping(address => uint256) public pendingRewards; // накопленные награды
    
    constructor(address _lpToken, address _rewardToken) {
        lpToken = ERC20(_lpToken);
        rewardToken = ERC20(_rewardToken);
        owner = msg.sender;
    }
    
// начисление вознаграждения
    function updateRewards(address user) public {
        
        if (stakedBalance[user] == 0) return;
        // соклко времени прошлос последней награды
        uint256 timePassed = block.timestamp - lastRewardTime[user];
        if (timePassed == 0) return;

        // бонус за долю стейка
        uint256 stakeBonus = (stakedBalance[user] * SCALE) / totalStaked + SCALE;
        // бонус за время (0.05 за каждые 30 дней)
        uint256 timeBonus = ((((timePassed * SCALE) / 30 days) * 5) / 100) + SCALE;

        uint256 reward = (stakedBalance[user] * timePassed * rewardPerSecond * stakeBonus * timeBonus) / (SCALE * SCALE);
        pendingRewards[user] += reward;
        lastRewardTime[user] = block.timestamp;
    }
    
// положить токены
    function stake(uint256 amount) public {

        require(amount > 0, "no amount");
        // забираем старые токены
        updateRewards(msg.sender);
        // добавляем новые
        lpToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
    
        lastRewardTime[msg.sender] = block.timestamp;
    }


// вывод LP токенов + награды
    function unstake(uint256 amount) public {
            require(amount > 0, "No amount");
            require(stakedBalance[msg.sender] >= amount, "Not enough staked");

            updateRewards(msg.sender);

            stakedBalance[msg.sender] -= amount;
            totalStaked -= amount;

            lpToken.transfer(msg.sender, amount);
        }

// забрать вознаграждение
    function claimRewards() public {
        updateRewards(msg.sender);
        uint256 rewards = pendingRewards[msg.sender];
        require(rewards > 0, "no rewards");

        rewardToken.mint(msg.sender, rewards);

        pendingRewards[msg.sender] = 0;
    }

     function viewRewards(address user) public view returns (uint256) {
        if (stakedBalance[user] == 0) return 0;

        uint256 timePassed = block.timestamp - lastRewardTime[user];
        if (timePassed == 0) return pendingRewards[user];

        uint256 stakeBonus = (stakedBalance[user] * SCALE) / totalStaked + SCALE;
        uint256 timeBonus = ((((timePassed * SCALE) / 30 days) * 5) / 100) + SCALE;

        uint256 reward = (stakedBalance[user] * timePassed * rewardPerSecond * stakeBonus * timeBonus) / (SCALE * SCALE);
        return pendingRewards[user] + reward;
     }
}