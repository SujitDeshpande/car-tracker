pragma solidity ^0.4.6;

contract CarTracking {

    struct Car {
        string make;
        string model;
        string year;
        string numberPlate;
        string vehicleStatus;
        address ownerId;
        string ownerName;
    }

    mapping (uint => Car) public cars;
    uint numCarTokens=0;

    // http://solidity.readthedocs.io/en/develop/common-patterns.html#restricting-access
    modifier onlyBy(address account) {
        if (msg.sender != account) revert();
        _;
    }

    function AddCar(string make, string model, string year, string numberPlate, string vehicleStatus, address ownerId, string ownerName){
        cars[numCarTokens] = Car(make, model, year, numberPlate, vehicleStatus, ownerId, ownerName);
        numCarTokens++;
    }

    // --- Transfer. Lets the beneficiary of a Token transfer his Token. ---

    function Transfer(uint carTokenID, string ownerName, address receiver) onlyBy (msg.sender) {
            Car storage t = cars[carTokenID];
            if (receiver == msg.sender) revert();
            t.ownerId = receiver;
            t.ownerName = ownerName;
    }   

    function GetNumberOfCars() returns (uint){
        return numCarTokens;
    }

    function GetCar(uint carTokenID) returns (string,string,string, string,string,address, string)
    {
        return (cars[carTokenID].make, 
                cars[carTokenID].model, 
                cars[carTokenID].year, 
                cars[carTokenID].numberPlate,
                cars[carTokenID].vehicleStatus,
                cars[carTokenID].ownerId,
                cars[carTokenID].ownerName);
    }

}