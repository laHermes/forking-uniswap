pragma solidity =0.6.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DividendToken is ERC20, Ownable {
    address public liquidator;

    constructor() public ERC20("DividendToken", "DT") {}

    function setLiquidator(address _liquidator) external {
        require(msg.sender == owner(), "Not owner!");
        liquidator = _liquidator;
    }

    function mint(address _to, uint256 _amount) external {
        require(msg.sender == liquidator, "Not liquidator!");
        _mint(_to, _amount);
    }
}
