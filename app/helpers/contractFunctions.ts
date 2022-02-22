import { BigNumber } from 'ethers';

export const bigNumToInt = (bigNum: BigNumber): number => {
	return bigNum.toNumber();
};

export const bigNumToString = (bigNum: BigNumber): string => {
	return bigNum.toString();
};
