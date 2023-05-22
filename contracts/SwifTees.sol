// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.7;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";
import "./Pausable.sol";


contract SwifTees is ERC721Enumerable, Ownable, Pausable {
  using Strings for uint256;

  uint256 public cost;
  uint256 public maxSupply;
  uint256 public presaleMinting;  //Set whitelistMinting time
  uint256 public allowPublicMintingOn;  //Time for Public Minting
  string public baseURI;  // .json Metadata hash for images
  string public baseExtension = '.json'; //Shows the base for NFTs

  event Mint(uint256 amount, address minter); //sets the Mint emit function
  event Withdraw(uint256 amount, address owner); // Allows owner to withdraw funds from contract

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

    require(block.timestamp >= presaleMinting, "Presale minting is still active");  // check if presale is over
    require(block.timestamp >= allowPublicMintingOn, "Public minting is not yet open");

    require(_mintAmount > 0, "Must purchase minimum of one ticket");

    require(msg.value >= cost * _mintAmount, "Not enough ETH for purchase"); //Require enough payment

    uint256 supply = totalSupply();

    require(supply + _mintAmount <= maxSupply, "Exceeds maximum NFTs available");

    require(balanceOf(msg.sender) + _mintAmount <= 4, "Exceeds maximum tickets allowed per wallet");

    for(uint256 i = 1; i <= _mintAmount; i ++) {  //Loops through until reaching _mintAmount
      _safeMint(msg.sender, supply + i );          // adds to mint count and loops bach through
    }

    emit Mint(_mintAmount, msg.sender);

  }

  function tokenURI(uint256 _tokenId)   //Pulls metadata IPFS url
    public
    view
    virtual
    override
    returns(string memory)
  {
    require(_exists(_tokenId), "NFT does not exist"); // looks to make sure token exists _exists is a library function
    return(
      string(
        abi.encodePacked(
          baseURI, 
          _tokenId.toString(), 
          baseExtension
    )));
  }

  function walletOfOwner(address _owner) public view returns(uint256[] memory) { // this function calls an array that shows all NFT's held by an owner
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount); //creating a memory resident array oof nfts held by owner wallet
    for(uint256 i; i < ownerTokenCount; i ++) {                 // creating the array based on number of NFTs
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  // Let only the owner of contract withdraw the ether in the contract
  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;

    (bool success, ) = payable(msg.sender).call{value: balance}("");
    require(success);

    emit Withdraw(balance, msg.sender);     // Emits the actual withdraw

  }
  
  function setCost(uint256 _newCost) public onlyOwner {
    cost = _newCost;
  }

  function setPresaleMintOn(uint256 _newPresaleMintOn) public onlyOwner {
    presaleMinting = _newPresaleMintOn;
  }

  function setPublicMintOn(uint256 _newPublicMintOn) public onlyOwner {
    allowPublicMintingOn = _newPublicMintOn;
  }

  function pause() public onlyOwner {
      _pause();
  }

  function unpause() public onlyOwner {
      _unpause();
  }

  function _pause() internal override(Pausable) {
    super._pause();    
  }

  function _unpause() internal override(Pausable) {
    super._unpause();    
  }

}
