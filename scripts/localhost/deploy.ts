import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const TestLensApiConsumerContract = await ethers.getContractFactory("TestLensApiConsumerContract");

  const [deployer] = await ethers.getSigners();

  console.log("Deploying...");
  const consumer = await TestLensApiConsumerContract.deploy(deployer.address);
  await consumer.deployed();
  console.log("Deployed", {
    consumer: consumer.address,
  });
  console.log('before done bos ')
  // consumer.on("ResponseReceived2", async (reqId: number,id:number, n:number, n4: number) => {
  //   console.info("Received event [ResponseReceived]:", {
  //     reqId,
  //    id,n,n4
  //   });
  //   process.exit();
  // });
  console.log('done bros')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
