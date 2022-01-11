require("@nomiclabs/hardhat-waffle");

require("hardhat-contract-sizer");
require("hardhat-gas-reporter");

const urlOverride = process.env.ETH_PROVIDER_URL;
const mnemonic =
  process.env.MNEMONIC ||
  "test test test test test test test test test test test junk";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
	solidity: {
		version: "0.8.4",
		settings: {
		  optimizer: {
			enabled: true,
			runs: 200,
		  },
		},
	  },
    networks: {
		dev: {
			accounts: {
			  accountsBalance: "10000000000000000000000",
			  mnemonic,
			},
			chainId: 31337,
			url: 'http://127.0.0.1:8569'
		  },
		rinkeby: { // ethereum tesnet
			accounts: { mnemonic },
			chainId: 4,
			url: urlOverride || "http://localhost:8545",
		  },
		mumbai: { // polygon testnet
			  accounts: { mnemonic },
			  chainId: 80001,
			  url: urlOverride || "https://rpc-mumbai.maticvigil.com",
			  gas: 6000000,
			  gasPrice: 8000000000
		  },
		fuji: { // avalanche testnet
			  accounts: { mnemonic },
			  chainId: 43113,
			  url: urlOverride || "https://api.avax-test.network/ext/bc/C/rpc",
		  },
	  },
    contractSizer: {
      alphaSort: true,
      runOnCompile: true,
      disambiguatePaths: false,
    },
};
