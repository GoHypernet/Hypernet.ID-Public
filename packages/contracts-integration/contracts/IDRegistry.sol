// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev this contract is for local testing and demonstraction purposes only
/// Hypernet.ID registry addresses can be found at:
/// https://docs.hypernet.id/developer-documentation/developer-docs/contracts-integration#hypernet.id-registry-chain-addresses
contract IDRegistry is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

	string public baseURI;

    constructor() ERC721("IDRegistry", "IDs") {}

	function setBaseURI(string memory _baseURI)
        public
        onlyOwner
    {
        baseURI = _baseURI;
    }

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

	function tokenURINoBase(
        uint256 tokenId
    )
        external
        view
        virtual
        returns (string memory)
    {
        bytes memory basebytes = bytes(baseURI);

        if (basebytes.length == 0) {
            // if there is no baseURI, return the full tokenURI
            return ERC721URIStorage.tokenURI(tokenId);
        } else {
            // if there is a baseURI, strip it from the tokenURI
            bytes memory uribytes = bytes(ERC721URIStorage.tokenURI(tokenId));
            bytes memory uri = new bytes(uribytes.length-basebytes.length);
            for (uint i = 0; i<uribytes.length-basebytes.length; ++i) {
                uri[i] = uribytes[i+basebytes.length];
            }
            return string(uri);
        }
    }

	function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
