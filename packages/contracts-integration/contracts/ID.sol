//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";

contract ID is Context {

    // when implementing setter functions, be sure to set appropriate permissions
    address public registryAddress = address(0);
	bytes8 public CRITERIA;

    /// @dev onlyVerifiedCriteria Modifier that enforces a specific verification criteria
    modifier onlyVerifiedWithCriteria() {
         require(
             _hasBeenVerifiedWithCriteria(_msgSender()),
             "ID: Invalid verification criteria");
        _;
    }

	/// @dev onlyVerifiedCriteria Modifier that enforces a specific verification criteria
	/// by specifying the tokenid, the modifer saves ~4000 gas as the expense of UX complexity
    modifier onlyVerifiedTokenWithCriteria(uint256 tokenID) {
         require(
             _hasBeenVerifiedWithCriteria(_msgSender(), tokenID),
             "ID: Invalid verification criteria");
        _;
    }

    /// @dev onlyVerified Modifier that enforces an account has been verified at some point
	/// by only checking for non-zero balance, the modifer saves ~22000 gas at expense of
	/// ensuring user has met requirements of id verification regulations
    modifier onlyVerified() {
        require(_hasBeenVerified(_msgSender()), "ID: User has no verification token");
        _;
    }

    function _hasBeenVerified(address owner)
    internal
    view
    virtual
    returns (bool verified) {
        // check for a non-zero balance of the given account
        verified = (INfr(registryAddress).balanceOf(owner) > 0);
    }

    function _hasBeenVerifiedWithCriteria(address owner)
    internal
    view
    virtual
    returns (bool) {
		bytes8 target = _fromTokenURIToBytes8(
			INfr(registryAddress).tokenURI(
			        INfr(registryAddress).tokenOfOwnerByIndex(owner, 0)
			    )
			);
		return ((target & CRITERIA) == CRITERIA);
    }

	function _hasBeenVerifiedWithCriteria(address owner, uint256 tokenid)
    internal
    view
    virtual
    returns (bool) {
		require(INfr(registryAddress).ownerOf(tokenid) == owner, "ID: msgsender not owner of tokenID");
		bytes8 target = _fromTokenURIToBytes8(
		        INfr(registryAddress).tokenURI(tokenid)
			);
		return ((target & CRITERIA) == CRITERIA);
    }

	/// @dev Convert an hexadecimal character to their value
    function _fromHexChar(uint8 c)
	private
	pure
	returns (uint8 output) {
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
		// ensure the user is passing in a Hypernet.ID compatible metadata string
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
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

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
