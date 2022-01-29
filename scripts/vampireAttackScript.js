const { ethers } = require('hardhat');

async function main() {
	const [owner] = await ethers.getSigners();
	const { chainId } = await owner.provider.getNetwork();

	// not a real dividend, it is a token user gets for helping us migrate liquidity to our fork of uniswap
	const DividendToken = await ethers.getContractFactory('DividendToken');
	const LiquidityMigrator = await ethers.getContractFactory(
		'LiquidityMigrator'
	);

	// deploy only to hardhat local net or polygon mumbai testnet
	if (chainId !== 31337 || chainId !== 80001) console.log('Wrong network');

	const dividendToken = await DividendToken.deploy();
	await dividendToken.deployed();

	console.log('Dividend Token deployed to:', dividendToken.address);

	//DEPLOY LIQ_MIGRATOR
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
