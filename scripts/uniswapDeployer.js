const { ethers } = require('hardhat');

async function main() {
	const [owner] = await ethers.getSigners();

	const Factory = await ethers.getContractFactory('UniswapV2Factory');
	const PrimaryToken = await ethers.getContractFactory('PrimaryToken');
	const SecondaryToken = await ethers.getContractFactory('SecondaryToken');

	const factory = await Factory.deploy(owner.address);

	await factory.deployed();
	await factory.createPair();
	console.log('Factory deployed to:', factory.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
