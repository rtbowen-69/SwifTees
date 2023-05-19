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
      minter

  beforeEach(async () => {
    let accounts = await ethers.getSigners()
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

    describe('Success', async () => {
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

        transaction = await swiftees.connect(minter).mint(4, { value: COST })
        result = await transaction.wait()
      })

      it('updates total supply', async () => {
        expect(await swiftees.totalSupply()).to.equal(4)      
      })

      it('updates the contract ether balance', async () => {
        expect(await ethers.provider.getBalance(swiftees.address)).to.equal(COST)      
      })

    })


    describe('Failure', async () => {

      it('', async () => {
      
      })

    })

  })

})
