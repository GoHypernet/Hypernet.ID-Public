//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

contract ID is Context {

    // when implementing setter function, be sure to set appropriate permissions
    address public registryAddress = address(0);
	bytes8 public CRITERIA;

    /// @dev onlyVerifiedCriteria Modifier that enforces a specific verification criteria
    modifier onlyVerifiedWithCriteria() {
         require(
             _hasBeenVerifiedWithCriteria(_msgSender()),
             "ID: Invalid user criteria.");
        _;
    }

    /// @dev onlyVerified Modifier that enforces an account has been verified at some point
    modifier onlyVerified() {
        require(_hasBeenVerified(_msgSender()), "ID: User has no verification token");
        _;
    }

    /// @dev internal helper function to return the correct address of the Hypernet.ID registry contract
    function _getRegistryAddress()
    private
    view
    returns (address) {
        require(registryAddress != address(0), "ID: Registry address not set");
		return registryAddress;
    }

    /// @dev internal helper function for fetching a user's registration metadata
    function _registrationURI(address owner)
    internal
    view
    virtual
    returns (string memory tokenURI) {
        address registry = _getRegistryAddress();

        // look up the tokenID based on the given owner address
        uint256 tokenID = INfr(registry).tokenOfOwnerByIndex(owner, 0);

        // retrieve the registration metadata from the token
        tokenURI = INfr(registry).tokenURI(tokenID);
    }

    function _hasBeenVerified(address owner)
    internal
    view
    virtual
    returns (bool verified) {
        address registry = _getRegistryAddress();

        // check for a non-zero balance of the given account
        verified = (INfr(registry).balanceOf(owner) > 0);
    }

    function _hasBeenVerifiedWithCriteria(address owner)
    internal
    view
    virtual
    returns (bool verified) {
        bytes32 target = _fromTokenURIToBytes8(_registrationURI(owner));
		verified = (target & CRITERIA) == CRITERIA;
    }

	// Convert an hexadecimal character to their value
    function _fromHexChar(uint8 c) private pure returns (uint8 output) {
        if (bytes1(c) >= bytes1('0') && bytes1(c) <= bytes1('9')) {
            return output = c - uint8(bytes1('0'));
        }
        if (bytes1(c) >= bytes1('a') && bytes1(c) <= bytes1('f')) {
            return output = 10 + c - uint8(bytes1('a'));
        }
    }

    /// @dev Convert a user's metadata into bytes format for masking
    function _fromTokenURIToBytes8(string memory s)
	internal
	pure
	returns (bytes8 rb) {
        bytes memory ss = bytes(s);
        require(ss.length == 32, "ID: length must be 32");

        bytes memory r = new bytes(8);
        for (uint i=0; i<8; ++i) {
            r[i] = bytes1(_fromHexChar(uint8(ss[2*i])) * 16 +
                          _fromHexChar(uint8(ss[2*i+1])));
        }

		// convert from bytes array to bytes8 type
		assembly {
            rb := mload(add(r, 32))
        }
    }
}

// minimal interface for the NonFungibleRegistry register function
interface INfr {

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns a token ID owned by `owner` at a given `index` of its token list.
     * Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256 tokenId);

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
