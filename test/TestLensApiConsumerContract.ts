import { expect } from "chai";
import { type Contract, type Event } from "ethers";
import { ethers } from "hardhat";
import { execSync } from "child_process";

async function waitForResponse(consumer: Contract, event: Event) {
  const [, data] = event.args!;
  // Run Phat Function
  const result = execSync(`phat-fn run --json dist/index.js -a ${data} https://api-mumbai.lens.dev/`).toString();
  const json = JSON.parse(result);
  const action = ethers.utils.hexlify(ethers.utils.concat([
    new Uint8Array([0]),
    json.output,
  ]));
  // Make a response
  const tx = await consumer.rollupU256CondEq(
    // cond
    [],
    [],
    // updates
    [],
    [],
    // actions
    [action],
  );
  const receipt = await tx.wait();
  return receipt.events;
}

describe("TestLensApiConsumerContract", function () {
  it("Push and receive message", async function () {
    // Deploy the contract
    const [deployer] = await ethers.getSigners();
    const TestLensApiConsumerContract = await ethers.getContractFactory("TestLensApiConsumerContract");
    const consumer = await TestLensApiConsumerContract.deploy(deployer.address);
    // // Make a request
    const profileId = "0x65ce916b587482DE215139Fa266081134AC6a1Eb";
    const tx = await consumer.request(profileId);
    const receipt = await tx.wait();
    const reqEvents = receipt.events;
    expect(reqEvents![0]).to.have.property("event", "MessageQueued");
    console.log(reqEvents?.map(e=>console.log(e.data)))

    // Wait for Phat Function response
    const respEvents = await waitForResponse(consumer, reqEvents![0])

    // Check response data
    // console.log(respEvents)
    // expect(respEvents[0]).to.have.property("event", "ResponseReceived");
    // const [reqId, pair, value] = respEvents[0].args;
    // // expect(ethers.BigNumber.isBigNumber(reqId)).to.be.true;
    // // expect(pair).to.equal(profileId);
    // expect(ethers.BigNumber.isBigNumber(value)).to.be.true;
  });
});


// MYQUESTION IS :
//    [requestId, encodedProfileId] = Coders.decode([uintCoder, bytesCoder], request);
//   const profileId = parseProfileId(encodedProfileId as string);
// function parseProfileId(hexx: string): string {
//   var hex = hexx.toString();
//   if (!isHexString(hex)) {
//     throw Error.BadLensProfileId;
//   }
//   hex = hex.slice(2);
//   var str = "";
//   for (var i = 0; i < hex.length; i += 2) {
//     const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
//     str += ch;
//   }
//   return str;
// }
// // here the did as profileId as it's coming from teh bytesCoder(encodedProfilleId) INSTEAD in my case the proielID( coming from teh addressCoder) IS THE ethereum address what to do now so that when i do yarn run-function <parameter1> <url> so that  i get as "Request received for profile(address as) 0xdDF6B042913811DCf864E25a588874161CC6476b