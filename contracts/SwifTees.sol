// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SwifTees is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.00 ether;
  uint256 public maxSupply = 500;
  uint256 public maxMintAmount = 1;
  uint256 public timeDeployed;
  bool public paused = false;
  bool public revealed = false;
  string public notRevealedUri;

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _cost,
    uint256 _maxSupply,
    string memory _initBaseURI,
    string memory _initNotRevealedUri
  ) ERC721(_name, _symbol) {

    cost = _cost;
    maxSupply = _maxSupply;

    setBaseURI(_initBaseURI);
    setNotRevealedURI(_initNotRevealedUri);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  mapping(address => bool) private hasMinted;

  function mint(uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    // uint256 remainingTokens = maxSupply - supply;
    require(!paused);
    require(_mintAmount > 0, 'Need to mint at least 1 token');
    require(_mintAmount <= maxMintAmount);
    require(supply + _mintAmount <= maxSupply, 'Sold Out');
    require(!hasMinted[msg.sender], 'SwifTees token already minted!'); // Ensure that the caller hasn't already minted an NFT

    if (msg.sender != owner()) {
      require(msg.value >= cost * _mintAmount);
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(msg.sender, supply + i);
    }

    hasMinted[msg.sender] = true; // Mark that the caller has now minted an NFT    
  }

  function walletOfOwner(address _owner)

    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );
    
    if(revealed == false) {
        return notRevealedUri;
    }

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function reveal() public onlyOwner {
      revealed = true;
  }
  
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
    maxMintAmount = _newmaxMintAmount;
  }
  
  function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
    notRevealedUri = _notRevealedURI;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
 
  function withdraw() public payable onlyOwner {
      (bool success, ) = payable(msg.sender).call{
          value: address(this).balance
      }("");
      require(success);
  }
}