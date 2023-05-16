// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SwifTeeTickets is ERC721, Pausable, Ownable {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIdCounter;

  using Strings for uint256;

  string baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.01 ether;
  uint256 public maxSupply = 100;
  uint256 public maxMintAmount = 4;
  bool public paused;
  bool public duringPresale;
  bool public presaleEnded;

  address public swifTeesContract;

  string private _name = "SwifTeeTickets";
  string private _symbol = "STT";

  uint256 public timeDeployed;


  constructor(string memory baseURI, address swifTeesAddr) ERC721(_name, _symbol) {
       
    require(maxSupply > 0, 'Max supply must be greater than 0');
    require(maxSupply <= 100, 'Max supply cannot exceed 100');

    _baseURI = baseURI;
    swifTeesContract = swifTeesAddr;
    // timeDeployed = block.timestamp();
	}

  function setBaseURI(string memory baseURI) public onlyOwner {
    _baseURI = baseURI();
  }

  function _baseURI() internal view override returns (string memory) {
    return _baseURI();
  }

  function startPresale() public onlyOwner {
    duringPresale = true;
  }

  function endPresale() public onlyOwner {
	  presaleEnded = true;
	}

  function mint() external {
    require(swifTeesContract.balanceOf(msg.sender) > 0, "You must own a SwifTee NFT to purchase SwifTeeTickets");
    require(purchases[msg.sender] < MAX_PURCHASE_PER_SWIFTEE, "You have reached the maximum number of SwifTeeTickets per SwifTee NFT");
    require(totalSupply() < MAX_NFT_SUPPLY, "Maximum number of NFTs reached");
    _safeMint(msg.sender, totalSupply() + 1);
    purchases[msg.sender]++;
  }

  function paused() public onlyOwner (bool) {
    paused();
  }

	function unpause() public onlyOwner {
		_unpause();
	}

	// function safeMint(address to) public {
	// 	uint256 tokenId = _tokenIdCounter.current();
	// 	_tokenIdCounter.increment();
	// 	_safeMint(to, tokenId);
	// }

	function withdraw() public payable onlyOwner {
    (bool success, ) = payable(msg.sender).call{value: address(this).balance}("");
    require(success, "Withdrawal failed");
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal whenNotPaused {
    super._beforeTokenTransfer(from, to, tokenId);
  }
}