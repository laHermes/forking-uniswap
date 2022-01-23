pragma solidity =0.5.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SecondaryToken is ERC20 {
    constructor() ERC20("SecondaryToken", "TKN2") {}
}
