const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SwifTeeTickets', () => {
  let owner, buyer, SwifTees, SwifTeeTickets;

  before(async () => {
    // Get the signers of the accounts
    [owner, buyer] = await ethers.getSigners();

    // Deploy the SwifTees contract
    const SwifTeesFactory = await ethers.getContractFactory('SwifTees');
    SwifTees = await SwifTeesFactory.deploy();
    await SwifTees.deployed();

    // Deploy the SwifTeeTickets contract
    const SwifTeeTicketsFactory = await ethers.getContractFactory('SwifTeeTickets');
    SwifTeeTickets = await SwifTeeTicketsFactory.deploy(SwifTee.address, 'baseURI');
    await SwifTeeTickets.deployed();
  });

  it('should not allow buyer to buy tickets during presale without SwifTee NFT', async function () {
    // Check that the buyer doesn't have a SwifTees NFT
    expect(await SwifTees.ownerOf(1)).to.not.equal(buyer.address);

    // Try to buy tickets during the presale without a SwifTees NFT
    await expect(SwifTeeTickets.connect(buyer).buySwifTeeTickets(1)).to.be.revertedWith('Must own a SwifTee NFT during presale');

    // Check that the buyer still doesn't have any SwifTees tickets
    expect(await SwifTeeTickets.balanceOf(buyer.address)).to.equal(0);
  });

  it('should allow buyer to buy tickets during presale with SwifTees NFT', async function () {
    // Mint a SwifTees NFT for the buyer
    await SwifTees.connect(owner).mint(buyer.address);

    // Check that the buyer has a SwifTees NFT
    expect(await SwifTees.ownerOf(1)).to.equal(buyer.address);

    // Buy tickets during the presale with a SwifTees NFT
    await SwifTeeTickets.connect(buyer).buySwifTeeTickets(1);

    // Check that the buyer now has one SwifTees ticket
    expect(await SwifTeeTickets.balanceOf(buyer.address)).to.equal(1);
  });
});
