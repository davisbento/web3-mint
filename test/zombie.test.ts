import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract } from 'ethers';

describe('ZombieFactory Contract', function () {
	let contract: Contract;

	beforeEach(async () => {
		const Contract = await ethers.getContractFactory('ZombieFactory');
		contract = await Contract.deploy();
		await contract.deployed();
	});

	it('Should create a zombie and return new array length', async function () {
		await contract.createZombie('Buckethead');
		await contract.createZombie('Pyramidhead');

		expect(await contract.getZombiesLength()).to.equal(2);
	});

	it('Should get zombie by index', async function () {
		await contract.createZombie('Buckethead');
		await contract.createZombie('Pyramidhead');

		const zombie0 = await contract.getZombieByIndex(0);
		expect(zombie0.name).to.equal('Buckethead');
		const zombie1 = await contract.getZombieByIndex(1);
		expect(zombie1.name).to.equal('Pyramidhead');
	});
});
