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
        address owner;
        uint256 dna;
        uint256 level;
        uint256 health;
        uint256 attack;
        uint256 defense;
    }

    Zombie[] public zombies;

    function createZombie(string memory _name) public {
        uint256 _zombieId = zombies.length;
        uint256 _dna = _generateRandomDna(_name);

        zombies.push(
            Zombie({
                name: _name,
                owner: msg.sender,
                dna: _dna,
                level: 1,
                health: 100,
                attack: 10,
                defense: 10
            })
        );
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

    function getRandomZombieDifferentFromMyAddress(address _address)
        public
        view
        returns (Zombie memory)
    {
        Zombie memory _matchZombie;

        for (uint256 _zombieId = 0; _zombieId < zombies.length; _zombieId++) {
            uint256 _randomIndex = _generateRandomIndex() % zombies.length;

            Zombie memory _zombie = getZombieByIndex(_randomIndex);

            if (_zombie.owner != _address) {
                _matchZombie = _zombie;
                break;
            }
        }

        return _matchZombie;
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

    function _generateRandomIndex() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, block.timestamp))
            );
    }
}
