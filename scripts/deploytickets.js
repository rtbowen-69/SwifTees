const hre = require("hardhat");

async function main() {

  const NAME = process.env.T_PROJECT_NAME
  const SYMBOL = process.env.T_PROJECT_SYMBOL
  const COST = ethers.utils.parseUnits(process.env.T_MINT_COST, 'ether')
  const MAX_SUPPLY = process.env.T_MAX_SUPPLY
  const PRESALEMINT_ON = new Date(process.env.T_PRESALEMINT_ON).getTime() / 1000;
  const PUBLICMINT_ON = new Date(process.env.T_PUBLICMINT_ON).getTime() / 1000;
  const IPFS_METADATA_URI = process.env.T_IPFS_IMAGE_METADATA_CID
  const SWIFTEES_CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

  // Deploy Ticket NFT
  const SwifTeeTickets = await hre.ethers.getContractFactory('SwifTeeTickets')
  let swifTeeTickets = await SwifTeeTickets.deploy(
    NAME,
    SYMBOL,
    COST,
    MAX_SUPPLY,
    PRESALEMINT_ON,
    PUBLICMINT_ON,
    IPFS_METADATA_URI,
    SWIFTEES_CONTRACT_ADDRESS
  )
 
  await swifTeeTickets.deployed();

  console.log('SwifTeeTickets deployed to: ', swifTeeTickets.address);

  // Store PRESALEMINT_ON and PUBLICMINT_ON as contract variables
  const presaleMintingTime = await swifTeeTickets.presaleMinting();
  const publicMintingTime = await swifTeeTickets.allowPublicMintingOn();
}     

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
