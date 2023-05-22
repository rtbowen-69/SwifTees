
const hre = require("hardhat");

async function main() {
  const NAME = 'SwifTees'
  const SYMBOL = 'ST'
  const COST = ethers.utils.parseUnits('.001', 'ether')
  const MAX_SUPPLY = 500
  const NFT_MINT_DATE = (Date.now() + 120000).toString().slice(0, 10)
  const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  // Deploy NFT
  const SwifTees = await hre.ethers.getContractFactory('SwifTees')
  let swiftees = await SwifTees.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, NFT_MINT_DATE, IPFS_METADATA_URI)
 
  await swifTees.deployed();
  console.log('SwifTees deployed to: ', swifTees.address);
}

async function main() {

  const NAME = 'SwifTeeTickets'
  const SYMBOL = 'STT'
  const COST = ethers.utils.parseUnits('.001', 'ether')
  const MAX_SUPPLY = 100
  const NFT_MINT_DATE = (Date.now() + 120000).toString().slice(0, 10)
  const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  // Deploy NFT
  const SwifTeeTickets = await hre.ethers.getContractFactory('SwifTeeTickets')
  let swifTeetickets = await SwifTeeTickets.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, NFT_MINT_DATE, IPFS_METADATA_URI)
 
  await swifTeeTickets.deployed();

  console.log('SwifTeeTickets deployed to: ', swifTeeTickets.address);
}     

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
