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
    modifier onlyVerifiedWithCriteria(string memory criteria) {
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

    function getChainID() public view returns (uint256 id) {
        assembly {
            id := chainid()
        }
    }

    function _getRegistryAddress()
    internal 
    view 
    virtual 
    returns (address registry) {
        uint256 id = getChainID();

        // set the registry address dependingon the chain
        if (id == 4) { // rinkeby network
            registry = 0x8E92D1D990E36e00Af533db811Fc5C342823C817;
        } else { // all other networks
            require(registryOverride != address(0), "ID: Must manually set registryOverride on unsupported chain"); 
            registry = registryOverride; 
        }
    }

    function _registrationURI(address owner) 
    public 
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

    function _hasBeenVerifiedWithCriteria(address owner, string memory criteria) 
    public 
    view 
    virtual 
    returns (bool verified) {
        verified = ((toUint256(bytes(_registrationURI(owner))) 
                   & toUint256(bytes(criteria))) 
                   > 0);
    }

    function wtf(address owner, string memory criteria) 
    public 
    view 
    virtual 
    returns (uint verified) {
        verified = (toUint256(bytes(_registrationURI(owner))) 
                   & toUint256(bytes(criteria)));
    }

    function toUint256(bytes memory _bytes)   
    internal
    pure
    returns (uint256 value) {

      assembly {
        value := mload(add(_bytes, 0x20))
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

    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}