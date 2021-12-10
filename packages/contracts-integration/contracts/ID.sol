//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

contract ID is Context {

    address public registryOverride = address(0);

    /// @notice setRegistryOverride set the address of the registry contract to user for ID
    /// @dev _registryOverride address of an ERC721-compatible contract with enumeration property
    function setRegistryOverride(address _registryOverride) external virtual {
        registryOverride = _registryOverride;
    }

    // @dev onlyVerifiedCriteria Modifier that enforces a specific verification criteria
    modifier onlyVerifiedWithCriteria(bytes8 criteria) {
         require(
             _hasBeenVerifiedWithCriteria(_msgSender(), criteria),
             "ID: Invalid user criteria.");
        _;
    }

    // @dev onlyVerified Modifier that enforces an account has been verified at some point
    modifier onlyVerified() {
        require(_hasBeenVerified(_msgSender()), "ID: User has no verification token");
        _;
    }

    // @dev internal helper function to determine the netwok we are on
    function _getChainID() internal view returns (uint256 id) {
        assembly {
            id := chainid()
        }
    }

    // @dev internal helper function to return the correct address of the Hypernet.ID registry contract
    function _getRegistryAddress()
    internal
    view
    virtual
    returns (address registry) {
        uint256 id = _getChainID();

        // set the registry address dependingon the chain
        if (id == 4) { // rinkeby network
            registry = 0x8E92D1D990E36e00Af533db811Fc5C342823C817;
        } else { // all other networks
            require(registryOverride != address(0), "ID: Must manually set registryOverride on unsupported chain");
            registry = registryOverride;
        }
    }

    // @dev internal helper function for fetching a user's registration metadata
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

    function _hasBeenVerifiedWithCriteria(address owner, bytes8 criteria)
    internal
    view
    virtual
    returns (bool verified) {
        bytes32 target = _fromTokenURIToBytes(_registrationURI(owner));
		verified = (target & criteria) > 0;
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

    // Convert an hexadecimal string to raw bytes
    function _fromTokenURIToBytes(string memory s)
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
