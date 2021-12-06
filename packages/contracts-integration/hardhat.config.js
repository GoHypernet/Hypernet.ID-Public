require("@nomiclabs/hardhat-waffle");

require("hardhat-contract-sizer");
require("hardhat-gas-reporter");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("string2bytes", "Convert a string to bytes")
  .addParam("string", "String to convert to bytes")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const string = taskArgs.string;
  
    const inBytes = hre.ethers.utils.formatBytes32String(string);
    console.log("Bytes:", inBytes)

});

task("bytes2string", "Convert some bytes to utf8 string")
  .addParam("bytes", "bytes-like string")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const bytes = taskArgs.bytes;
  
    const string = hre.ethers.utils.toUtf8Bytes(bytes);
    console.log("String:", string.toString())

});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};
