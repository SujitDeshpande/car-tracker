// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import { default as CryptoJS} from 'crypto-js';

// Import our contract artifacts and turn them into usable abstractions.
import car_tracking from '../../build/contracts/CarTracking.json'

var CarTracking = contract(car_tracking);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var carTrackingABI;
var carTrackingContract;
var carTrackingCode;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      web3.eth.defaultAccount = account;
      var carTrackingSource = "pragma solidity ^0.4.6; contract CarTracking {     struct Car {       string make;         string model;         string year;         string numberPlate;         string vehicleStatus;         address ownerId;         string ownerName;     }      mapping (uint => Car) public cars;     uint numCarTokens=0;           modifier onlyBy(address account) {         if (msg.sender != account) revert();         _;     }     function AddCar(string make, string model, string year, string numberPlate, string vehicleStatus, address ownerId, string ownerName){         cars[numCarTokens] = Car(make, model, year, numberPlate, vehicleStatus, ownerId, ownerName);         numCarTokens++;     }         function Transfer(uint carTokenID, string ownerName, address receiver) onlyBy (msg.sender) {             Car storage t = cars[carTokenID];             if (receiver == msg.sender) revert();             t.ownerId = receiver;             t.ownerName = ownerName;     }       function GetNumberOfCars() returns (uint){         return numCarTokens;     }     function GetCar(uint carTokenID) returns (string,string,string, string,string,address, string)     {         return (cars[carTokenID].make,                  cars[carTokenID].model,                  cars[carTokenID].year,                  cars[carTokenID].numberPlate,                 cars[carTokenID].vehicleStatus,                 cars[carTokenID].ownerId,                 cars[carTokenID].ownerName);     } } ";
      web3.eth.compile.solidity(carTrackingSource, function(eror, carTrackingCompiled){
        carTrackingABI = carTrackingCompiled['<stdin>:CarTracking'].info.abiDefinition;
        carTrackingContract = web3.eth.contract(carTrackingABI);
        carTrackingCode = carTrackingCompiled['<stdin>:CarTracking'].code;
      });
    });
  },

  createContract: function(){
    carTrackingContract.new("", {from:account, data: foodSafeCode, gas: 3000000}, function (error, deployedContract){
      if(deployedContract.address){
        document.getElementById("contractAddress").value=deployedContract.address;
      }
    })
  },

  addNewCar: function()
  {
    var contractAddress = document.getElementById("contractAddress").value;
    var deployedCarTracking = carTrackingContract.at(contractAddress);
    var make = document.getElementById("make").value;
    var model = document.getElementById("model").value;
    var year = document.getElementById("year").value;
    var numberPlate = document.getElementById("numberPlate").value;
    var vehicleStatus = document.getElementById("vehicleStatus").value;
    var make = document.getElementById("make").value;
    var ownerId = document.getElementById("ownerId").value;
    var ownerName = document.getElementById("ownerName").value;
    deployedCarTracking.AddCar(make, model, year, numberPlate, vehicleStatus, ownerId, ownerName, function(error){console.log(error);})
  },

  transferCar: function()
  {
    var contractAddress = document.getElementById("contractAddress").value;
    var deployedCarTracking = carTrackingContract.at(contractAddress);
    var carTokenID = document.getElementById("carTokenID").value;
    var ownerName = document.getElementById("ownerName").value;
    var receiver = document.getElementById("receiver").value;
    deployedCarTracking.Transfer(carTokenID, ownerName, receiver, function(error){
      console.log(error);
    })
  },
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. ");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
