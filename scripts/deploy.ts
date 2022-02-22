import { run, ethers } from 'hardhat';

async function main() {
	const Contract = await ethers.getContractFactory('ZombieFactory');
	const contract = await Contract.deploy();

	console.log('Contract deployed to:', contract.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
