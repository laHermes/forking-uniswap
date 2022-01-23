pragma solidity ^0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PrimaryToken is ERC20 {
    constructor() public ERC20("PrimaryToken", "TKN") {}
}
