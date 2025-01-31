const hre = require("hardhat");

async function main() {

  const FEE = ethers.parseUnits("0.01", 18);
    
  const MemeContract = await hre.ethers.getContractFactory("MemeFactory");
  const memeContract  = await MemeContract.deploy(FEE);

  console.log("Storage contract deployed to:", memeContract.target);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// Telos: Support contract deployed to: 0x5Ac64F5DA22B25559C7D7522b4B2BB7e2012F382