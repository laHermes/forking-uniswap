const { ethers } = require('hardhat');

async function main() {
	const [owner] = await ethers.getSigners();
	const { chainId } = await owner.provider.getNetwork();

	const Factory = await ethers.getContractFactory('UniswapV2Factory');
	const Router = await ethers.getContractFactory('UniswapV2Router02');
	const PrimaryToken = await ethers.getContractFactory('PrimaryToken');
	const SecondaryToken = await ethers.getContractFactory('SecondaryToken');
	const WETH = await ethers.getContractFactory('WETH9');

	// deploy only to hardhat local net or polygon mumbai testnet
	if (chainId !== 31337 || chainId !== 80001) console.log('Wrong network');

	// FACTORY DEPLOYMENT
	const factory = await Factory.deploy(owner.address);
	await factory.deployed();

	console.log('Factory deployed to:', factory.address);

	// TOKEN DEPLOYMENT
	const primaryToken = await PrimaryToken.deploy();
	const secondaryToken = await SecondaryToken.deploy();
	const weth = await WETH.deploy();

	await primaryToken.deployed();
	await secondaryToken.deployed();
	await weth.deployed();

	const [primaryAddress, secondaryAddress, wethAddress, factoryAddress] = [
		primaryToken.address,
		secondaryToken.address,
		weth.address,
		factory.address,
	];

	console.log('Primary Token Address:', primaryAddress);
	console.log('Secondary Token Address:', secondaryAddress);
	console.log('WETH Token Address:', wethAddress);

	// PAIR CREATION
	await factory.createPair(primaryAddress, secondaryAddress);

	const router = await Router.deploy(factoryAddress, wethAddress);
	await router.deployed();

	console.log('Router deployed to:', router.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
