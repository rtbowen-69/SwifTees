// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SwifTeeTickets is ERC721, Pausable, Ownable {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIdCounter;

	constructor() ERC721("SwifTeeTickets", "STT") {}

	function pause() public onlyOwner {
		_pause();
	}

	function unpause() public onlyOwner {
		_unpause();
	}

	function safeMint(address to) public {
		uint256 tokenId = _tokenIdCounter.current();
		_tokenIdCounter.increment();
		_safeMint(to, tokenId);
	}

	function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
		internal
		whenNotPaused
		override
	{
		super._beforeTokenTransfer(from, to, tokenId, batchSize);
	}
	
  	function withdraw() public payable onlyOwner {
      (bool success, ) = payable(msg.sender).call{
          value: address(this).balance
      }("");
      require(success);
  }
}