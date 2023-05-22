
const hre = require("hardhat");

async function main() {
  const NAME = 'SwifTees'
  const SYMBOL = 'ST'
  const COST = ethers.utils.parseUnits('.001', 'ether')
  const MAX_SUPPLY = 500
  const PRESALEMINT_ON = (Date.now() + 120000).toString().slice(0, 10)
  const PUBLICMINT_ON = (Date.now() + 220000).toString().slice(0, 10)
  const IPFS_METADATA_URI = 'ipfs://QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/'

  // Deploy NFT
  const SwifTees = await hre.ethers.getContractFactory('SwifTees')
  let swifTees = await SwifTees.deploy(NAME, SYMBOL, COST, MAX_SUPPLY, PRESALEMINT_ON, PUBLICMINT_ON, IPFS_METADATA_URI)
 
  await swifTees.deployed();
  console.log('SwifTees deployed to: ', swifTees.address);
}     

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
