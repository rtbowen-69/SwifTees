const hre = require("hardhat");

async function main() {

  const NAME = 'SwifTeeTickets'
  const SYMBOL = 'STT'
  const COST = ethers.utils.parseUnits('.001', 'ether')
  const MAX_SUPPLY = 100
  const PRESALEMINT_ON = (Date.now() + 120000).toString().slice(0, 10)
  const PUBLICMINT_ON = (Date.now() + 220000).toString().slice(0, 10)
  const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  // Deploy NFT
  const SwifTeeTickets = await hre.ethers.getContractFactory('SwifTeeTickets')
  let swifTeeTickets = await SwifTeeTickets.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, PRESALEMINT_ON, PUBLICMINT_ON, IPFS_METADATA_URI)
 
  await swifTeeTickets.deployed();

  console.log('SwifTeeTickets deployed to: ', swifTeeTickets.address);
}     

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
