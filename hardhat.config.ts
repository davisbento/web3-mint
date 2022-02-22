import { HardhatUserConfig } from 'hardhat/types';
import '@nomiclabs/hardhat-waffle';
import fs from 'fs';

const privateKey = fs.readFileSync('.secret', 'utf8').toString();

const configuration: HardhatUserConfig = {
	defaultNetwork: 'testnet',
	networks: {
		localhost: {
			url: 'http://127.0.0.1:8545'
		},
		hardhat: {},
		testnet: {
			url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
			chainId: 97,
			gasPrice: 20000000000,
			accounts: { mnemonic: privateKey }
		},
		mainnet: {
			url: 'https://bsc-dataseed.binance.org/',
			chainId: 56,
			gasPrice: 20000000000,
			accounts: { mnemonic: privateKey }
		}
	},
	solidity: {
		version: '0.8.4',
		settings: {
			optimizer: {
				enabled: true
			}
		}
	},
	paths: {
		sources: './contracts',
		tests: './test',
		cache: './cache',
		artifacts: './artifacts'
	},
	mocha: {
		timeout: 20000
	}
};

export default configuration;
