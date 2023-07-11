require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const privateKey = process.env.DEPLOYER_PRIVATE_KEY || ""


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    localhost: {},
    Linea: {
      url: `https://linea-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      account: privateKey,
    }
  },
};
