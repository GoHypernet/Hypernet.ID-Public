//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ID.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Test is Ownable, ID {

    string public name;

    constructor (string memory _name, string memory _CRITERIA) {
        name = _name;
        CRITERIA = _fromTokenURIToBytes8(_CRITERIA);
    }

    // @dev be sure to protect the setter function for CRITERIA appropriately
	function setCriteria(bytes8 _CRITERIA)
	external
	onlyOwner()
	{
		CRITERIA = _CRITERIA;
	}

    // @dev a function that can be called by anyone
    function changeName(string memory _name )
    external
    {
        name = _name;
    }

    // @dev a function that can only be called if user has been verified at some point
    function changeNameIfVerified(string memory _name )
    external
    onlyVerified()
    {
        name = _name;
    }

    // @dev a function that can only be called if user has undergone a specified identification process
    function changeNameIfVerifiedWithCriteria(string memory _name)
    external
    onlyVerifiedWithCriteria()
    {
        name = _name;
    }

}
