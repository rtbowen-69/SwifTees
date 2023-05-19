// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.7;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract SwifTees is ERC721Enumerable, Ownable {
  uint256 public cost;
  uint256 public maxSupply;
  uint256 public presaleMinting;  //Set whitelistMinting time
  uint256 public allowPublicMintingOn;  //Time for Public Minting
  string public baseURI;  // .json Metadata hash for images
 
  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _cost,
    uint256 _maxSupply,
    uint256 _presaleMinting,
    uint256 _allowPublicMintingOn,
    string memory _baseURI

  ) ERC721 (_name, _symbol) {
    cost = _cost; //Setting cost of NFTs
    maxSupply = _maxSupply; //Setting max supply
    presaleMinting = _presaleMinting; // Set time for presale
    allowPublicMintingOn = _allowPublicMintingOn; // set time for all public
    baseURI = _baseURI; //.json metadata hash
 
  }

  function mint(uint256 _mintAmount) public payable {   // _mintAmount
    uint256 supply = totalSupply();

    for(uint256 i = 1; i <= _mintAmount; i ++) {  //Loops through until reaching _mintAmount
      _safeMint(msg.sender, supply + i );          // adds to mint count and loops bach through
    }

  }
}