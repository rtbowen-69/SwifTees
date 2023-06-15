const hre = require("hardhat");

async function main() {

  const NAME = 'SwifTeeTickets'
  const SYMBOL = 'STT'
  const COST = ethers.utils.parseUnits('.001', 'ether')
  const MAX_SUPPLY = 100
  const PRESALEMINT_ON = (Date.now() + 120000).toString().slice(0, 10)
  const PUBLICMINT_ON = (Date.now() + 20000000).toString().slice(0, 10)
  const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'
  const SWIFTEES_CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'

  // Deploy NFT
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
