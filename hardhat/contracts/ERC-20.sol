// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ERC20 {

// имя токена
    string public name;
// символ токена
    string public symbol;
    uint256 public decimals;
// общее кол-во токенов
    uint256 public totalSupply;

// владелец контракта
    address public owner;

// передаем в контракт его имя символ и циферку
    constructor (string memory _name, string memory _symbol, uint256 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        owner = msg.sender;
        minters[msg.sender] = true;
    }

// хранение балансов акканутов
    mapping (address => uint256) public balances;
// хранение разрешение, сколько токенов владелец разрешил потрадить левому чуваку
    mapping (address => mapping(address => uint256)) public  allowed;
    mapping(address => bool) public minters;

// события для отправки токена и при успешном вызове функции approve
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

//основные функции 

// перевод токенов от одного адерса к другому
    function transfer(address _to, uint256 _value) public {
        require(balances[msg.sender] >= _value, "not enough tokens");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
    }

// получение разрешения
    function approve(address _to, uint256 _value) public {
        require(balances[msg.sender] >= _value, "not enough tokens approve");
        allowed[msg.sender][_to] += _value;
        emit Approval(msg.sender, _to, _value);
    }

// перевод токенов с разрешения

    function transferFrom(address _from, address _to, uint256 _value) public {
        require(allowed[_from][msg.sender] >= _value, "no permission");
        require(balances[_from] >= _value, "not enough tokens");
        allowed[_from][msg.sender] -= _value;
        balances[_from] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

// внутренние функции
    function mint(address mintAddress, uint256 _value) public {
        totalSupply += _value;
        balances[mintAddress] += _value;
    }

    function addMinter(address _minter) public {
        minters[_minter] = true;
    }

    function burn(address mintAddress, uint256 _value) public {
        require(msg.sender == owner, "only owner can do this");
        totalSupply -= _value;
        balances[mintAddress] -= _value;
    }

    function balanceOf(address user) public view returns (uint256) {
        return balances[user];
    }
}