// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract HospitalRegistry {
    struct Hospital { string name; string location; address wallet; }
    mapping(address => Hospital) public hospitals;

    function registerHospital(string memory _name, string memory _location) public {
        hospitals[msg.sender] = Hospital(_name, _location, msg.sender);
    }

    function isHospital(address _addr) public view returns (bool) {
        return hospitals[_addr].wallet != address(0);
    }

    function getHospital(address _addr) public view returns (string memory, string memory, address) {
        Hospital memory h = hospitals[_addr];
        return (h.name, h.location, h.wallet);
    }
}
