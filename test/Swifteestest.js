const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('SwifTees', () => {
  const NAME = 'SwifTees'
  const SYMBOL = 'ST'
  const COST = ether(.001)
  const MAX_SUPPLY = 25 //Defines max supply for test
  const BASE_URI = 'ipfs://QmUCvi3BRHERZa3xhUHvQ1GzAa3uwT2wXdoRGZGkWfMwEt/' // Hard Code for test .json hash

  let swiftees, 
      deployer,
      minter,
      accounts

  beforeEach(async () => {
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    minter = accounts[1]    
  })

  describe('Deployment', () => {
    const PRESALEMINT_ON = (Date.now() + 120000).toString().slice(0, 10) // 2 Minutes from now
    const PUBLICMINT_ON = (Date.now() + 1200000).toString().slice(0, 10) // 20 Minutes from now

    beforeEach(async () => {
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
    })

    it('has correct name', async () => {
      expect(await swiftees.name()).to.equal(NAME)
    })

    it('has correct symbol', async () => {
      expect(await swiftees.symbol()).to.equal(SYMBOL)
    })

    it('returns the cost to mint', async () => {
      expect(await swiftees.cost()).to.equal(COST)
    })

    it('returns the max NFT Supply', async () => {
      expect(await swiftees.maxSupply()).to.equal(MAX_SUPPLY)
    })

    it('returns the Presale Mint time', async () => {
      expect(await swiftees.presaleMinting()).to.equal(PRESALEMINT_ON)
    })

    it('returns the Public Mint time', async () => {
      expect(await swiftees.allowPublicMintingOn()).to.equal(PUBLICMINT_ON)
    })

    it('returns the base URI Hash Address', async () => {
      expect(await swiftees.baseURI()).to.equal(BASE_URI)
    })

    it ('Returns Owner', async () => {
      expect(await swiftees.owner()).to.equal(deployer.address)

    })

  })

  describe('Minting', () => {
    let transaction, result

    beforeEach(async () => {
      const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
      const PUBLICMINT_ON = (Date.now() + 1200000).toString().slice(0, 10)

      const whitelistTestAccounts = [
        ethers.utils.getAddress('0xbDA5747bFD65F08deb54cb465eB87D40e51B197E'),
        ethers.utils.getAddress('0xdD2FD4581271e230360230F9337D5c0430Bf44C0'),
        ethers.utils.getAddress('0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'),
        accounts[1].address, // Minter address
      ]

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

      await swiftees.addToWhitelist(whitelistTestAccounts) // Pass the whitelist array to contract

      const totalNFTsToMint = 1 // Per loop so a total of 4 NFTs will be minted

      for (let i = 0; i < whitelistTestAccounts.length; i++) {
        const account = whitelistTestAccounts[i]
        const signer = await ethers.getSigner(account) // Get signer for each test account
        transaction = await swiftees.connect(signer).mint(totalNFTsToMint, { value: COST * (totalNFTsToMint) })
        result = await transaction.wait()
      }

    })

    describe('Success', async () => {

      it('updates total supply', async () => {
        expect(await swiftees.totalSupply()).to.equal(4)      
      })

      it('updates the contract ether balance', async () => {
        expect(await ethers.provider.getBalance(swiftees.address)).to.equal(COST * 4)      
      })

      it('emits Mint event', async() => {
        await expect(transaction).to.emit(swiftees, 'Mint')
        .withArgs(1, minter.address)
        console.log('Minter address:', minter.address)
      })

      it('returns address of minter', async () => {
        const isWhitelisted = await swiftees.whitelist(minter.address)
        expect(isWhitelisted).to.equal(true)              
      })

      it('returns total number of NFTs owned by minter', async () => {
        const initialBalance = await swiftees.balanceOf(minter.address)
        expect(await swiftees.balanceOf(minter.address)).to.equal(1)              
      })
    })

    describe('Failure', async () => {

      it('rejects insuffcient payment', async () => {
        await expect(swiftees.connect(minter).mint(1, { value: ether(.0003) })).to.be.reverted
      })

      it('does not allow more than 1 NFT per wallet', async () => {
        await expect(swiftees.connect(minter).mint(1, { value: COST })).to.be.reverted
      })

      it('requires at least 1 NFT to be minted', async () => {
        await expect(swiftees.connect(minter).mint(0, { value: COST })).to.be.reverted
      })

      it('rejects presale minting before presale is open', async () => { 
        await expect(swiftees.connect(minter).mint(1, { value: COST })).to.be.reverted       
      })

      it('rejects public minting before public mint is open', async () => {
        await expect(swiftees.connect(minter).mint(1, { value: COST })).to.be.reverted
      })
    })
  })

  describe('Displaying NFTs', () => {
    let transaction, result

    const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
    const PUBLICMINT_ON = Date.now().toString().slice(0, 10)

    beforeEach(async () => {
      const SwifTees = await ethers.getContractFactory('SwifTees')
      swifTees = await SwifTees.deploy(
      NAME,
      SYMBOL,
      COST,
      MAX_SUPPLY,
      PRESALEMINT_ON,
      PUBLICMINT_ON,
      BASE_URI
      )

      transaction = await swifTees.connect(minter).mint(1, { value: COST * 1 })
      result = await transaction.wait()
    })

    it('returns all the NFTs for a given owner', async () => {
      let tokenIds = await swifTees.walletOfOwner(minter.address)
      console.log('owner wallet', tokenIds)
      expect(tokenIds.length).to.equal(1)
      expect(tokenIds[0].toString()).to.equal('1')
    })

  })

  describe('Withdrawing Balances', () => {
    let transaction, result, balanceBefore

    describe('Success', async () => {
      const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
      const PUBLICMINT_ON = Date.now().toString().slice(0, 10)
      const COST = ethers.utils.parseEther('0.001')  

      // Define test accounts array
      const testAccounts = [
        '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
        '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
        '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      ]

      beforeEach(async () => {
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

        const totalNFTsToMint = 1 // Per loop so a total of 4 NFTs will be minted

        for (let i = 0; i < testAccounts.length; i++) {
          const account = testAccounts[i]
          const signer = await ethers.getSigner(account) // Get signer for test account
          transaction = await swiftees.connect(signer).mint(totalNFTsToMint, { value: COST * (totalNFTsToMint) })
          result = await transaction.wait()
        }

        transaction = await swiftees.connect(minter).mint(1, { value: COST * 1 })
        result = await transaction.wait()

        balanceBefore = await ethers.provider.getBalance(swiftees.address) // Gets signer for deployer address

        const deployerSigner = await ethers.getSigner(deployer.address)
        transaction = await swiftees.connect(deployer).withdraw()
        result = await transaction.wait()

        const balanceAfter = await ethers.provider.getBalance(swiftees.address)
        console.log('Contract balance before withdrawal:', ethers.utils.formatEther(balanceBefore))
        console.log('Contract balance after withdrawal:', ethers.utils.formatEther(balanceAfter))
   
      })

      it('deducts contract balance', async () => {
        expect(await ethers.provider.getBalance(swiftees.address)).to.equal(0) 
      })

      it('sends funds to the owner', async () => {
        expect(await ethers.provider.getBalance(deployer.address)).to.be.greaterThan(balanceBefore)
      })

      it('emits a withdraw event', async () => {
        expect(transaction).to.emit(swiftees, 'Withdraw')
          .withArgs(balanceBefore, deployer.address)
      })

      it("should allow the owner to change the cost", async () => {
        const newCost = ethers.utils.parseEther('1')

        await swiftees.connect(deployer).setCost(newCost) // Call the setCost function as the owner        
        const updatedCost = await swiftees.cost() // Get the updated cost value        
        expect(updatedCost).to.equal(newCost) // Assert that the cost was successfully updated
        console.log("updatedCost:", ethers.utils.formatEther(updatedCost))
      })
    })

    describe('Failure', async () => {
      const PRESALEMINT_ON = Date.now().toString().slice(0, 10)
      const PUBLICMINT_ON = Date.now().toString().slice(0, 10)

      beforeEach(async () => {
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
      })

      it('prevents non-owner from withdrawing', async () => {
        await expect(swiftees.connect(minter).withdraw()).to.be.reverted
      })

      it("should revert when non-owner tries to change the cost", async () => {
        const newCost = ether(1);
        
        await expect(swiftees.connect(minter).setCost(newCost)).to.be.reverted // Call the setCost function as the nonowner
        const updatedCost = await swiftees.cost() // Get the updated cost value
        expect(updatedCost).to.not.equal(newCost) // Assert that the cost was successfully updated
        console.log("updatedCost:", ethers.utils.formatEther(updatedCost))
      })

      // it('', async () => {
      
      // })

    })

  })
})
