// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DoctorRegistry.sol";
import "./HospitalRegistry.sol";

contract PatientRegistry {
    struct Patient {
        string name;
        uint age;
        address patientAddress;
        address hospital; // FIX: hospital is an address, not uint
        bool exists;
    }

    struct MedicalRecord {
        string ipfsHash; // Encrypted record stored on IPFS
        uint timestamp;
        address uploadedBy; // Doctor address
    }

    mapping(address => Patient) public patients;
    mapping(address => MedicalRecord[]) private patientRecords;

    DoctorRegistry private doctorRegistry;
    HospitalRegistry private hospitalRegistry;

    event PatientRegistered(address patient, string name, uint age, address hospital);
    event RecordUploaded(address patient, string ipfsHash, address doctor, uint timestamp);

    constructor(address _doctorRegistry, address _hospitalRegistry) {
        doctorRegistry = DoctorRegistry(_doctorRegistry);
        hospitalRegistry = HospitalRegistry(_hospitalRegistry);
    }

    modifier onlyDoctor() {
        require(doctorRegistry.isDoctor(msg.sender), "Only registered doctors can upload");
        _;
    }

    modifier onlyPatientOrDoctor(address patient) {
        require(
            msg.sender == patient || doctorRegistry.isDoctor(msg.sender),
            "Not authorized"
        );
        _;
    }

    function registerPatient(string memory _name, uint _age, address _hospital) public {
        require(!patients[msg.sender].exists, "Already registered");
        require(hospitalRegistry.isHospital(_hospital), "Invalid hospital"); // FIX: check hospital by address

        patients[msg.sender] = Patient(_name, _age, msg.sender, _hospital, true);

        emit PatientRegistered(msg.sender, _name, _age, _hospital);
    }

    function uploadRecord(address patient, string memory ipfsHash) public onlyDoctor {
        require(patients[patient].exists, "Patient not registered");

        patientRecords[patient].push(MedicalRecord({
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            uploadedBy: msg.sender
        }));

        emit RecordUploaded(patient, ipfsHash, msg.sender, block.timestamp);
    }

    function getRecords(address patient) public view onlyPatientOrDoctor(patient) returns (MedicalRecord[] memory) {
        return patientRecords[patient];
    }
}
