const { ethers } = require('hardhat');

async function main() {
	const [owner] = await ethers.getSigners();
	const { chainId } = await owner.provider.getNetwork();

	const Factory = await ethers.getContractFactory('UniswapV2Factory');
	const PrimaryToken = await ethers.getContractFactory('PrimaryToken');
	const SecondaryToken = await ethers.getContractFactory('SecondaryToken');

	// deploy only to hardhat local net or polygon mumbai testnet
	if (chainId !== 31337 || chainId !== 80001) console.log('wrong network');

	const factory = await Factory.deploy(owner.address);

	await factory.deployed();
	console.log('Factory deployed to:', factory.address);

	const primaryToken = await PrimaryToken.deploy();
	const secondaryToken = await SecondaryToken.deploy();

	await primaryToken.deployed();
	await secondaryToken.deployed();

	const [primaryAddress, secondaryAddress] = [
		primaryToken.address,
		secondaryToken.address,
	];

	console.log('Tokens deployed to:', primaryAddress, secondaryAddress);

	await factory.createPair(primaryAddress, secondaryAddress);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
