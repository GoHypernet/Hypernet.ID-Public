//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ID.sol";

contract Test is ID {

    string public name; 

    string public CRITERIA; 

    constructor (string memory _name, string memory _CRITERIA) {
        name = _name;
        CRITERIA = _CRITERIA;
    }

    function getStringLength() external view returns (uint) {
        bytes memory bs = bytes(CRITERIA);
        return bs.length;
    }

    // can be called by anyone
    function changeName(string memory _name )
    external 
    {
        name = _name; 
    }

    // can only be called if user has been verified at some point
    function changeNameIfVerified(string memory _name )
    external 
    onlyVerified()
    {
        name = _name; 
    }

        // can only be called if user has been verified at some point
    function changeNameIfVerifiedWithCriteria(string memory _name)
    external 
    onlyVerifiedWithCriteria(CRITERIA)
    {
        name = _name; 
    }

}