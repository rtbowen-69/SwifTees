
const { ethers } = require('hardhat');
require('chai')
    .use(require('chai-as-promised'))
    .should();

describe('SwifTees', () => {  

  const NAME = 'Swif Tees'
  const SYMBOL = 'ST'
  const COST = 0
  const MAX_SUPPLY = 500
  const MAX_MINT_AMOUNT = 1

  const IPFS_IMAGE_METADATA_URI = 'ipfs://IPFS-IMAGE-METADATA-CID/'   // NOTE: If images are already uploaded to IPFS, you may choose to update the links, otherwise you can leave it be.

  const IPFS_HIDDEN_IMAGE_METADATA_URI = 'ipfs://IPFS-HIDDEN-METADATA-CID/hidden.json'

  let swifTees

  describe('Deployment', () => {

    let milliseconds = 120000 // Number between 100000 - 999999
    let result, timeDeployed    
    
    beforeEach(async () => {
      const NFT_MINT_DATE = (Date.now() + milliseconds).toString().slice(0, 10)

      const SwifTees = await ethers.getContractFactory('SwifTees')  // Pulls in SwifTrees contract from hardhat
      swifTees = await SwifTees.deploy(
        NAME,
        SYMBOL,
        COST,
        MAX_SUPPLY,
        IPFS_IMAGE_METADATA_URI,
        IPFS_HIDDEN_IMAGE_METADATA_URI,
      )
      await swifTees.deployed()

      timeDeployed = NFT_MINT_DATE - Number(milliseconds.toString().slice(0, 3))
    })

    it('returns the contract name', async () => {
      result = await swifTees.name()
      result.should.equal(NAME)
      console.log(NAME)        
    })

    it('returns the correct symbol', async () => {
      result = await swifTees.symbol()
      result.should.equal(SYMBOL)
      console.log(SYMBOL)    
    })

    it('returns the correct cost to mint', async () => {
      result = await swifTees.cost()
      result.toString().should.equal(COST.toString())  
      console.log(COST.toString())  
    })

    it('returns the maxium mint supply', async () => {
      result = await swifTees.maxSupply()
      result.toString().should.equal(MAX_SUPPLY.toString())
      console.log(MAX_SUPPLY.toString())    
    })

    it('returns the maxium mint amount per wallet', async () => {
      result = await swifTees.maxMintAmount()
      result.should.equal('1')
      console.log(MAX_MINT_AMOUNT)    
    })

    it('Returns current pause state', async () => {
        result = await swifTees.paused()
        result.toString().should.equal('false')
    })

    it('', async () => {
        
    })

  })
  describe('Minting', async () => {
    describe('success', async () => {  

      let result
      let swifTees
      let minter
  
      beforeEach(async () => {
        const NFT_MINT_DATE = Date.now().toString().slice(0, 10)

        const SwifTees = await ethers.getContractFactory('SwifTees')

        swifTees = await SwifTees.deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          IPFS_IMAGE_METADATA_URI,
          IPFS_HIDDEN_IMAGE_METADATA_URI,
        )

        await swifTees.deployed()

        const [owner, _minter] = await ethers.getSigners()
        minter = _minter

        result = await swifTees.connect(minter).mint(1, { value: ethers.utils.parseEther('0') })
      })

      it('returns the address of the minter', async () => {
        const [owner, minter] = await ethers.getSigners()
        let tx = await result.wait()
        let event = tx.events.find(e => e.event === 'Transfer')
        event.args.from.should.equal('0x0000000000000000000000000000000000000000')
        event.args.to.should.equal(minter.address)          
      })

      it('Updates the total supply', async () => {
        result = await swifTees.totalSupply()
        result.toString().should.equal('1')
      })

      it('Returns how many a minter owns', async () => {
        result = await swifTees.balanceOf(minter.address)
        result.toString().should.equal('1')
      })

      it('Returns the IDs of minted NFTs', async () => {
          result = await swifTees.walletOfOwner(minter.address)
          result.length.should.equal(1)
          result[0].toString().should.equal('1')
      })

      // it('Returns IPFS URI', async () => {
      //     result = await swifTees.baseURI(1)
      //     result.should.equal(`${IPFS_IMAGE_METADATA_URI}1.json`)
      // })

      it('Returns current pause state', async () => {
          result = await swifTees.paused()
          result.toString().should.equal('false')
      })


      it('', async () => {
         
      })

    })

  })
  
})
