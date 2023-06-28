const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('SwifTeeTickets', () => {
  const NAME = 'SwifTeeTickets'
  const SYMBOL = 'STT'
  const COST = ether(.001)
  const MAX_SUPPLY = 100 //Defines max supply for test
  const BASE_URI = 'ipfs://QmUCvi3BRHERZa3xhUHvQ1GzAa3uwT2wXdoRGZGkWfMwEt/' // Hard Code for test .json hash
  const SWIFTEES_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  let swifteetickets, 
      deployer,
      minter, 
      accounts

  beforeEach(async () => {
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    minter = accounts[1]
    // minterSigner = minter
  })

  describe('Deployment', () => {
    const PRESALEMINT_ON = (Date.now() + 120000).toString().slice(0, 10) // 2 Minutes from now
    const PUBLICMINT_ON = (Date.now() + 1200000).toString().slice(0, 10) // 20 Minutes from now

    beforeEach(async () => {
      const SwifTeeTickets = await ethers.getContractFactory('SwifTeeTickets')
      swifteetickets = await SwifTeeTickets.deploy(
      NAME,
      SYMBOL,
      COST,
      MAX_SUPPLY,
      PRESALEMINT_ON,
      PUBLICMINT_ON,
      BASE_URI,
      SWIFTEES_CONTRACT_ADDRESS
      )
    })

    it('has correct name', async () => {
      expect(await swifteetickets.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await swifteetickets.symbol()).to.equal(SYMBOL)
    })

    it('returns the cost to mint', async () => {
      expect(await swifteetickets.cost()).to.equal(COST)
    })

    it('returns the max NFT Supply', async () => {
      expect(await swifteetickets.maxSupply()).to.equal(MAX_SUPPLY)
    })

    it('returns the Presale Mint time', async () => {
      expect(await swifteetickets.presaleMinting()).to.equal(PRESALEMINT_ON)
    })

    it('returns the Public Mint time', async () => {
      expect(await swifteetickets.allowPublicMintingOn()).to.equal(PUBLICMINT_ON)
    })

    it('returns the base URI Hash Address', async () => {
      expect(await swifteetickets.baseURI()).to.equal(BASE_URI)
    })

    it ('Returns Owner', async () => {
      expect(await swifteetickets.owner()).to.equal(deployer.address)

    })

  })

  describe('Minting', () => {
    let transaction, result, minterSigner

    const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
    const PUBLICMINT_ON = Date.now().toString().slice(0, 10)

    beforeEach(async () => {

      // Mint a SwifTee NFT to the minter address before running other tests
      const SwifTees = await ethers.getContractFactory('SwifTees')
      swiftees = await SwifTees.deploy(      
      NAME,
      SYMBOL,
      COST,
      MAX_SUPPLY,
      PRESALEMINT_ON,
      PUBLICMINT_ON,
      BASE_URI
      )

      transaction = await swiftees.connect(minter).mint(1, { value: COST })
      result = await transaction.wait()

      const SwifTeeTickets = await ethers.getContractFactory('SwifTeeTickets')
      swifteetickets = await SwifTeeTickets.deploy(
      NAME,
      SYMBOL,
      COST,
      MAX_SUPPLY,
      PRESALEMINT_ON,
      PUBLICMINT_ON,
      BASE_URI,
      SWIFTEES_CONTRACT_ADDRESS
      )

      transaction = await swifteetickets.connect(minter).mint(1, { value: COST })
      result = await transaction.wait()
    })

    describe('Success', async () => {


      it('updates total supply', async () => {
        expect(await swifteetickets.totalSupply()).to.equal(1) 
        console.log('Total Supply After: ', (await swifteetickets.totalSupply()).toString())     
      })

      it('updates the contract ether balance', async () => {
        expect(await ethers.provider.getBalance(swifteetickets.address)).to.equal(COST)      
      })

      it('emits Mint event', async() => {
        await expect(transaction).to.emit(swifteetickets, 'Mint')
        .withArgs(1, minter.address)
        console.log('Minter address:', minter.address)
      })

      it('returns address of minter', async () => {
        expect(await swifteetickets.ownerOf(1)).to.equal(minter.address)              
      })

      it('returns total number of NFTs owned by minter', async () => {
        expect(await swifteetickets.balanceOf(minter.address)).to.equal(1)              
      })

    })

    describe('Failure', async () => {

      it('rejects insuffcient payment', async () => {
        await expect(swifteetickets.connect(minter).mint(4, { value: ether(.003) })).to.be.reverted
      })

      it('does not allow more than 4 Tickets per wallet', async () => {
        await expect(swifteetickets.connect(minter).mint(5, { value: COST })).to.be.reverted
      })

      it('requires at least 1 Ticket to be minted', async () => {
        await expect(swifteetickets.connect(minter).mint(0, { value: COST })).to.be.reverted
      })

      it('rejects presale minting before presale is open', async () => {        
        await expect(swifteetickets.connect(minter).mint(4, { value: COST })).to.be.reverted
      })

      it('rejects public minting before public mint is open', async () => {
       await expect(swifteetickets.connect(minter).mint(4, { value: COST })).to.be.reverted
      })

    })

  })

  describe('Displaying NFTs', () => {
    let transaction, result

    const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
    const PUBLICMINT_ON = Date.now().toString().slice(0, 10)

    beforeEach(async () => {
      const SwifTeeTickets = await ethers.getContractFactory('SwifTeeTickets')
      swifteetickets = await SwifTeeTickets.deploy(
      NAME,
      SYMBOL,
      COST,
      MAX_SUPPLY,
      PRESALEMINT_ON,
      PUBLICMINT_ON,
      BASE_URI,
      SWIFTEES_CONTRACT_ADDRESS
      )

      transaction = await swifteetickets.connect(minter).mint(3, { value: COST * 3 })
      result = await transaction.wait()
    })

    it('returns all the NFTs for a given owner', async () => {
      let tokenIds = await swifteetickets.walletOfOwner(minter.address)
      console.log('owner wallet', tokenIds)
      expect(tokenIds.length).to.equal(3)
      expect(tokenIds[0].toString()).to.equal('1')
      expect(tokenIds[1].toString()).to.equal('2')
      expect(tokenIds[2].toString()).to.equal('3')
    })
  
  })

  describe('Withdrawing Balances', () => {
    let transaction, result, balanceBefore

    describe('Success', async () => {
      const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
      const PUBLICMINT_ON = Date.now().toString().slice(0, 10)
      const COST = ether(.001)

      beforeEach(async () => {
        const SwifTeeTickets = await ethers.getContractFactory('SwifTeeTickets')
        swifteetickets = await SwifTeeTickets.deploy(
        NAME,
        SYMBOL,
        COST,
        MAX_SUPPLY,
        PRESALEMINT_ON,
        PUBLICMINT_ON,
        BASE_URI,
        SWIFTEES_CONTRACT_ADDRESS
        )

        transaction = await swifteetickets.connect(minter).mint(3, { value: COST * 3 })
        result = await transaction.wait()

        balanceBefore = await ethers.provider.getBalance(deployer.address)

        transaction = await swifteetickets.connect(deployer).withdraw()
        result = await transaction.wait()
      })

      it('deducts contract balance', async () => {
        expect(await ethers.provider.getBalance(swifteetickets.address)).to.equal(0) 
      })

      it('sends funds to the owner', async () => {
        expect(await ethers.provider.getBalance(deployer.address)).to.be.greaterThan(balanceBefore)
      })

      it('emits a withdraw event', async () => {
        expect(transaction).to.emit(swifteetickets, 'Withdraw')
          .withArgs(COST, deployer.address)
      })

      it("should allow the owner to change the cost", async () => {
        const newCost = ether(1)

        await swifteetickets.connect(deployer).setCost(newCost) // Call the setCost function as the owner        
        const updatedCost = await swifteetickets.cost() // Get the updated cost value        
        expect(updatedCost).to.equal(newCost) // Assert that the cost was successfully updated
        console.log("updatedCost:", ethers.utils.formatEther(updatedCost))
      })              

    })

    describe('Failure', async () => {
      const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
      const PUBLICMINT_ON = Date.now().toString().slice(0, 10)

      beforeEach(async () => {
        const SwifTeeTickets = await ethers.getContractFactory('SwifTeeTickets')
        swifteetickets = await SwifTeeTickets.deploy(
        NAME,
        SYMBOL,
        COST,
        MAX_SUPPLY,
        PRESALEMINT_ON,
        PUBLICMINT_ON,
        BASE_URI,
        SWIFTEES_CONTRACT_ADDRESS
        )

        transaction = await swifteetickets.connect(minter).mint(1, { value: COST })
        result = await transaction.wait()
      })

      it('prevents non-owner from withdrawing', async () => {
        await expect(swifteetickets.connect(minter).withdraw()).to.be.reverted
      })

      it("should revert when non-owner tries to change the cost", async () => {
        const newCost = ether(1);
        
        await expect(swifteetickets.connect(minter).setCost(newCost)).to.be.reverted // Call the setCost function as the nonowner
        const updatedCost = await swifteetickets.cost() // Get the updated cost value
        expect(updatedCost).to.not.equal(newCost) // Assert that the cost was successfully updated
        console.log("updatedCost:", ethers.utils.formatEther(updatedCost))
      })
    })
  })
})