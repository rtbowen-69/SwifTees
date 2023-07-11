require('dotenv').config();
const hre = require("hardhat");

async function main() {
  const NAME = process.env.PROJECT_NAME
  const SYMBOL = process.env.PROJECT_SYMBOL
  const COST = ethers.utils.parseUnits(process.env.MINT_COST, 'ether')
  const MAX_SUPPLY = process.env.MAX_SUPPLY
  const PRESALEMINT_ON = new Date(process.env.PRESALEMINT_ON).getTime() / 1000;
  const PUBLICMINT_ON = new Date(process.env.PUBLICMINT_ON).getTime() / 1000;
  const IPFS_METADATA_URI = process.env.IPFS_IMAGE_METADATA_CID

  // Deploy NFT
  const SwifTees = await ethers.getContractFactory('SwifTees')
  let swifTees = await SwifTees.deploy(
    NAME,
    SYMBOL,
    COST,
    MAX_SUPPLY,
    PRESALEMINT_ON,
    PUBLICMINT_ON,
    IPFS_METADATA_URI
  )
 
  await swifTees.deployed();
  console.log('SwifTees deployed to: ', swifTees.address);
  // Store PRESALEMINT_ON and PUBLICMINT_ON as contract variables
  const presaleMintingTime = await swifTees.presaleMinting();
  const publicMintingTime = await swifTees.allowPublicMintingOn();

}     

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
