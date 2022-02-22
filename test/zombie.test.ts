import { ethers } from 'hardhat';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('ZombieFactory Contract', function () {
	let contract: Contract;
	let accounts: SignerWithAddress[];

	beforeEach(async () => {
		const Contract = await ethers.getContractFactory('ZombieFactory');
		contract = await Contract.deploy();
		await contract.deployed();

		accounts = await ethers.getSigners();
	});

	it('Should create a zombie and return new array length', async function () {
		console.log(accounts[0].address);
		console.log(accounts[1].address);
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

	it('Should get zombie by address', async function () {
		await contract.createZombie('Buckethead');
		await contract.createZombie('Pyramidhead');

		const zombies = await contract.getZombieByAddress(accounts[0].address);
		expect(zombies.length).to.equal(2);
	});
});
