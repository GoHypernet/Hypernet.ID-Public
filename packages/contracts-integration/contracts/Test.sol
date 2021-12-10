//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ID.sol";

contract Test is ID {

    string public name;

    bytes32 public CRITERIA;

    constructor (string memory _name, string memory _CRITERIA) {
        name = _name;
        CRITERIA = fromHex(_CRITERIA);
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
