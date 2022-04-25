import { BigNumber, Contract, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { contractAddress } from '~/helpers/constants';
import { bigNumToInt, bigNumToString } from '~/helpers/contractFunctions';
import { abi } from '../../artifacts/contracts/Zombie.sol/ZombieFactory.json';

interface IZombie {
	id: number;
	name: string;
	dna: string;
	avatar: string;
}

export default function Index() {
	const [address, setAddress] = useState('');
	const [zombieName, setZombieName] = useState('');
	const [zombies, setZombies] = useState<IZombie[]>([]);
	const [loading, setLoading] = useState(false);
	const [contract, setContract] = useState<Contract>();

	const getContract = async () => {
		const provider = new ethers.providers.Web3Provider((window as any).ethereum);
		const signer = provider.getSigner();
		const address = await signer.getAddress();
		setAddress(address);

		const contract = new ethers.Contract(contractAddress, abi, signer);

		setContract(contract);
	};

	const getZombies = async () => {
		const zombiesByAddress: BigNumber[] = await contract!.getZombieByAddress(address);

		const ids = zombiesByAddress.map((id) => bigNumToInt(id));

		if (!ids.length) {
			return;
		}

		let zombies = [];
		for (const id of ids) {
			const zombie = await contract!.getZombieByIndex(id);
			zombies.push({
				id,
				avatar: '/images/zombie.png',
				name: zombie.name,
				dna: bigNumToString(zombie.dna)
			});
		}

		setZombies(zombies);
	};

	const createZombie = async () => {
		if (!contract) {
			alert('Please connect to MetaMask');
			return;
		}

		setLoading(true);

		try {
			const tx = await contract!.createZombie(zombieName);
			console.log(tx);
		} catch (error) {
			console.error(error);
		}
		setLoading(false);
	};

	useEffect(() => {
		if ((window as any).ethereum) {
			getContract();
		} else {
			alert('Please install MetaMask to use this dApp.');
		}
	}, []);

	useEffect(() => {
		if (!address || !contract) {
			return;
		}

		getZombies();
	}, [address, contract]);

	const hasLoaded = !!contract || !!address;

	return (
		<div className='flex justify-center items-center flex-col mt-10'>
			<h1 className='font-bold text-5xl text-red-500'>Welcome to Zombie Factory</h1>

			<div className='mt-5'>
				<p className='text-xl text-white text-center'>This is a simple contract that allows you to create zombies.</p>
			</div>

			{hasLoaded && (
				<div className='flex justify-center items-center flex-col mt-10'>
					<p className='text-xl text-white text-center'>Your address: {address}</p>

					<p className='text-xl text-white text-center'>Create your zombie</p>

					<input
						name='name'
						className='w-full p-2 mt-5 border border-white'
						placeholder='Name'
						onChange={(e) => setZombieName(e.target.value)}
					/>

					<button className='w-full p-2 mt-5 bg-red-500 text-white' onClick={createZombie} disabled={loading}>
						{loading ? 'Wait...' : 'Create'}
					</button>
				</div>
			)}

			{zombies.length > 0 && (
				<div className='flex justify-center items-center flex-col mt-10'>
					<p className='text-xl text-white text-center mb-16'>Your zombies</p>

					<div className='grid grid-cols-4 gap-16'>
						{zombies.map((zombie) => (
							<div key={zombie.id}>
								<p className='text-xl text-white'>Name: {zombie.name}</p>
								<p className='text-xl text-white'>DNA: {zombie.dna}</p>
								<div className='h-52'>
									<img className='object-contain w-full h-full' src={zombie.avatar} alt='Zombie' />
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
