
const hre = require("hardhat");

async function main() {

  const SwifTees = await ethers.getContractFactory('SwifTees');
  const swifTees = await SwifTees.deploy('SwifTees', 'ST', '0', '500','IPFS_IMAGE_METADATA_URI', 'IPFS_HIDDEN_IMAGE_METADATA_URI' );

  await swifTees.deployed();

  console.log('SwifTees deployed to: ', swifTees.address);
}    

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
