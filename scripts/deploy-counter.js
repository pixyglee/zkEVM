const hre = require("hardhat");

async function main() {

  const CounterContract = await hre.ethers.deployContract("Counter");

  await CounterContract.waitForDeployment();

  console.log(
    `CounterContract with deployed to https://testnet-zkevm.polygonscan.com/address/${CounterContract.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

