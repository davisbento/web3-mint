// contracts/Zombie.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ZombieFactory {
    event NewZombie(uint256 zombieId, string name, uint256 dna);

    uint256 dnaDigits = 16;
    uint256 dnaModulus = 10**dnaDigits;

    mapping(address => uint256[]) private zombiesByAddress;

    struct Zombie {
        string name;
        uint256 dna;
    }

    Zombie[] public zombies;

    function createZombie(string memory _name) public {
        uint256 _zombieId = zombies.length;
        uint256 _dna = _generateRandomDna(_name);

        zombies.push(Zombie({name: _name, dna: _dna}));
        _updateZombiesByAddress(_zombieId);

        emit NewZombie(_zombieId, _name, _dna);
    }

    function getZombiesLength() public view returns (uint256) {
        return zombies.length;
    }

    function getZombieByIndex(uint256 _zombieId)
        public
        view
        returns (Zombie memory)
    {
        return zombies[_zombieId];
    }

    function getZombieByAddress(address _address)
        public
        view
        returns (uint256[] memory)
    {
        return zombiesByAddress[_address];
    }

    function _updateZombiesByAddress(uint256 _zombieId) private {
        zombiesByAddress[msg.sender].push(_zombieId);
    }

    function _generateRandomDna(string memory _str)
        private
        view
        returns (uint256)
    {
        uint256 rand = uint256(keccak256(abi.encodePacked(_str)));
        return rand % dnaModulus;
    }
}
