import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const TestLensApiConsumerContract = await ethers.getContractFactory("TestLensApiConsumerContract");

  const [deployer] = await ethers.getSigners();

  const consumerSC = process.env["LOCALHOST_CONSUMER_CONTRACT_ADDRESS"] || "";
  if (!consumerSC) {
    console.error("Error: Please provide LOCALHOST_CONSUMER_CONTRACT_ADDRESS");
    process.exit(1);
  }
  const consumer = TestLensApiConsumerContract.attach(consumerSC);
  console.log("Pushing a request...");
  await consumer.connect(deployer).request("0x65ce916b587482DE215139Fa266081134AC6a1Eb");

  // consumer.on("ResponseReceived2", async (reqId: number,id:number, n:number, n4: number) => {
  //   console.info("Received event [ResponseReceived]:", {
  //     reqId,
  //    id,n,n4
  //   });
  //   process.exit();
  // });
  // consumer.on("ErrorReceived", async (reqId: number,id:number, n:number, n4: number) => {
  //   console.info("Received event [ErrorReceived]:", {
  //     reqId,
  //     id,n,n4
  //   });
  //   process.exit();
  // });
  console.info('exit ')

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
