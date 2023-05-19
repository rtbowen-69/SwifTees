
const hre = require("hardhat");

async function main() {

  const SwifTees = await ethers.getContractFactory('SwifTees');
  const swifTees = await SwifTees.deploy('SwifTees', 'ST', '.001', '500','IPFS_IMAGE_METADATA_URI', 'IPFS_HIDDEN_IMAGE_METADATA_URI' );

  await swifTees.deployed();

  console.log('SwifTees deployed to: ', swifTees.address);
}

async function main() {

  const SwifTeeTickets = await ethers.getContractFactory('SwifTeeTickets');
  const swifTeeTickets = await SwifTeeTickets.deploy('SwifTeeTickets', 'STT', '.01', '100','IPFS_IMAGE_METADATA_URI', 'IPFS_HIDDEN_IMAGE_METADATA_URI' );

  await swifTeeTickets.deployed();

  console.log('SwifTees deployed to: ', swifTees.address);
}     

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
