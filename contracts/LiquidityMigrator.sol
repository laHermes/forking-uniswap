pragma solidity =0.6.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./peripehry/interfaces/IUniswapV2Router02.sol";
import "./core/interfaces/IUniswapV2Pair.sol";
import "./core/DividendToken.sol";

contract LiquidityMigrator {
    IUniswapV2Router02 public router;
    IUniswapV2Pair public pair;

    IUniswapV2Router02 public routerFork;
    IUniswapV2Pair public pairFork;

    DividendToken public dividendToken;

    address public admin;
    mapping(address => uint256) public unclaimdBalances;
    bool public migrationDone;

    constructor(
        address _router,
        address _pair,
        address _routerFork,
        address _pairFork,
        address _dividendToken
    ) public {
        router = IUniswapV2Router02(_router);
        pair = IUniswapV2Pair(_pair);
        routerFork = IUniswapV2Router02(_routerFork);
        pairFork = IUniswapV2Pair(_pairFork);
        dividendToken = DividendToken(_dividendToken);
        admin = msg.sender;
    }

    function deposit(uint256 _amount) external {
        require(
            migrationDone == false,
            "LiquidityMigrator:Migration has been finished!"
        );
        pair.transferFrom(msg.sender, address(this), _amount);
        unclaimdBalances[msg.sender] += _amount;
    }

    function migrate() external {
        require(msg.sender == admin, "LiquidityMigrator: Only Admin!");
        require(
            migrationDone == false,
            "LiquidityMigrator:Migration has been finished!"
        );

        IERC20 token0 = IERC20(pair.token0());
        IERC20 token1 = IERC20(pair.token1());

        uint256 sumBalance = pair.balanceOf(address(this));

        router.removeLiquidity(
            address(token0),
            address(token1),
            sumBalance,
            0,
            0,
            address(this),
            block.timestamp
        );

        uint256 token0Balance = token0.balanceOf(address(this));
        uint256 token1Balance = token1.balanceOf(address(this));

        token0.approve(address(routerFork), token0Balance);
        token1.approve(address(routerFork), token1Balance);

        routerFork.addLiquidity(
            address(token0),
            address(token1),
            token0Balance,
            token1Balance,
            token0Balance,
            token1Balance,
            address(this),
            block.timestamp
        );

        migrationDone = true;
    }

    function claimLpToken() external {
        require(
            unclaimdBalances[msg.sender] > 0,
            "LiquidityMigrator: No unclaimed tokens!"
        );
        require(migrationDone, "LiquidityMigrator: Not Yet Migrated!");
        uint256 amountToTransfer = unclaimdBalances[msg.sender];
        unclaimdBalances[msg.sender] = 0;
        pairFork.transfer(msg.sender, amountToTransfer);
    }
}
