// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DoctorRegistry {
    struct Doctor { string name; string specialization; address wallet; }
    mapping(address => Doctor) public doctors;

    function registerDoctor(string memory _name, string memory _spec) public {
        doctors[msg.sender] = Doctor(_name, _spec, msg.sender);
    }

    function isDoctor(address _addr) public view returns (bool) {
        return doctors[_addr].wallet != address(0);
    }

    function getDoctor(address _addr) public view returns (string memory, string memory, address) {
        Doctor memory d = doctors[_addr];
        return (d.name, d.specialization, d.wallet);
    }
}
