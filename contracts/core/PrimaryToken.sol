pragma solidity =0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PrimaryToken is ERC20 {
    constructor() ERC20("PrimaryToken", "TKN") {}
}
