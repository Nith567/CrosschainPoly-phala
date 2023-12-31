// *** YOU ARE LIMITED TO THE FOLLOWING IMPORTS TO BUILD YOUR PHAT CONTRACT     ***
// *** ADDING ANY IMPORTS WILL RESULT IN ERRORS & UPLOADING YOUR CODE TO PHALA  ***
// *** NETWORK WILL FAIL. IF YOU WANT TO KNOW MORE, JOIN OUR DISCORD TO SPEAK   ***
// *** WITH THE PHALA TEAM AT https://discord.gg/5HfmWQNX THANK YOU             ***
import "@phala/pink-env";
import { Coders } from "@phala/ethers";
import { AddressCoder } from "@phala/ethers/lib.commonjs/abi/coders";
import { parse } from "path";
import { ethers } from "ethers";
import { Console } from "console";
type HexString = `0x${string}`
import { encodeAbiParameters, decodeAbiParameters } from 'viem'
// ETH ABI Coders available
/*
// Basic Types
// Encode uint
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
// Encode Bytes
const bytesCoder = new Coders.BytesCoder("bytes");
// Encode String
const stringCoder = new Coders.StringCoder("string");
// Encode Address
const addressCoder = new Coders.AddressCoder("address");

//
const stringCoder = new Coders.StringCoder("string");
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 10, "string[]");
function encodeReply(reply: [number, number, string[]]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringArrayCoder], reply) as HexString;
}
const stringArray = string[10];
export default function main(request: HexString, settings: string): HexString {
  return encodeReply([0, 1, stringArray]);
}
Contract.sol
function _onMessageReceived(bytes calldata action) internal override {
    (uint respType, uint id, string[10] memory data) = abi.decode(
        action,
        (uint, uint, string[10])
    );
}
ode Array of addresses with a length of 10
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 10, "string");
// Encode Array of addresses with a length of 10
const addressArrayCoder = new Coders.ArrayCoder(addressCoder, 10, "address");
// Encode Array of bytes with a length of 10
const bytesArrayCoder = new Coders.ArrayCoder(bytesCoder, 10, "bytes");
// Encode Array of uint with a length of 10
const uintArrayCoder = new Coders.ArrayCoder(uintCoder, 10, "uint256");
 */

// eth abi coder
const addressCoder = new Coders.AddressCoder("address");
const addressArrayCoder = new Coders.ArrayCoder(addressCoder, 32, "address");
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
const bytesCoder = new Coders.BytesCoder("bytes");


const stringCoder = new Coders.StringCoder("string")

const uintCoder32 = new Coders.NumberCoder(32, false, "uint32");
const bytesArrayCoder = new Coders.ArrayCoder(bytesCoder, 32, "bytes");


// uint, uint, uint32,uint,bytes32,bytes32[32],bytes memory,uint,address,uint32,string,uint32,bytes32
function encodeReply(reply: [number,number,string,number,string,string[],string,string,string,number,string,number,string]): HexString {
  return Coders.encode([uintCoder,uintCoder,stringCoder,uintCoder,bytesCoder,bytesArrayCoder,stringCoder,stringCoder,addressCoder,uintCoder,addressCoder,uintCoder32,bytesCoder], reply) as HexString;
}

const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

enum Error {
  BadLensProfileId = "BadLensProfileId",
  FailedToFetchData = "FailedToFetchData",
  FailedToDecode = "FailedToDecode",
  MalformedRequest = "MalformedRequest",
  BadRequestString = "BadRequestString"
}

function errorToCode(error: Error): number {
  switch (error) {
    case Error.BadLensProfileId:
      return 1;
    case Error.FailedToFetchData:
      return 2;
    case Error.FailedToDecode:
      return 3;
    case Error.MalformedRequest:
      return 4;
    default:
      return 0;
  }
}

function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-f]+$/;
  return regex.test(str.toLowerCase());
}

function stringToHex(str: string): string {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return "0x" + hex;
}


function BridgeFetch(apiUrl: string, reqStr: string):any {

  // const bridgeApiEndpoint =`https://bridge-api.public.zkevm-test.net/bridges/${reqStr}`;
  const http =`${apiUrl}${reqStr}`;

  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
  };

  const response = pink.httpRequest({
    url:http,
    method: "GET",
    headers,
    returnTextBody: true
  });
  if (response.statusCode !== 200) {
    console.log(
      `wrong 200: ${response.statusCode}, error: ${
         response.body
      }}`
    );
    throw Error.FailedToFetchData;
  }
  console.info(response);
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  return JSON.parse(respBody);
}


function BridgeFetch2(deposit_cnt:string, net_id: number):any {
  const bridgeApiEndpoint2 =`https://bridge-api.public.zkevm-test.net/merkle-proof?deposit_cnt=${deposit_cnt}&net_id=${net_id}`

  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
  };

  const response = pink.httpRequest({
    url:bridgeApiEndpoint2,
    method: "GET",
    headers,
    returnTextBody: true
  });
  if (response.statusCode !== 200) {
    console.log(
      `wrong 200: ${response.statusCode}, error: ${
         response.body
      }}`
    );
    throw Error.FailedToFetchData;
  }
  console.info(response);
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  return JSON.parse(respBody);
}

function parseProfileId(hexx: string) {
  // var hex = hexx.toString();
  // if (!isHexString(hex)) {
  //   throw Error.BadLensProfileId;
  // }
  // hex = hex.slice(2);
  // var str = "";
  // for (var i = 0; i < hex.length; i += 2) {
  //   const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
  //   str += ch;
  // }
  // return str;
  // const hex = hexx.startsWith('0x') ? hexx.slice(2) : hexx;

  // if (!isHexString(hex)) {
  //   throw Error.BadLensProfileId;
  const address = ethers.utils.getAddress(hexx);
  return address;  

}

//   // Convert hex to BigNumber
//   const bigNumber = ethers.BigNumber.from('0x' + hex);

//   // Use ethers.js to format the address
//   const address = ethers.utils.getAddress(bigNumber);

//   return address;
// }

function parseReqStr(hexStr: string): string {
  var hex = hexStr.toString();
  if (!isHexString(hex)) {
    throw Error.BadRequestString;
  }
  hex = hex.slice(2);
  var str = "";
  for (var i = 0; i < hex.length; i += 2) {
    const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    str += ch;
  }
  return str;
}
function parseHexToAddress(hexStr: string): string {
  // Remove '0x' prefix if present
  const hex = hexStr.startsWith('0x') ? hexStr.slice(2) : hexStr;

  // Check if the input is a valid hex string
  if (!/^[0-9A-Fa-f]*$/.test(hex)) {
    console.log("Invalid hex string");
  }

  // Extract the last 20 bytes (40 characters) of the hex string
  const addressHex = hex.slice(-40);

  console.log("ad " +addressHex)
  // Convert the extracted hex to Ethereum address
  const ethereumAddress = '0x' + addressHex;

  return ethereumAddress;
}

export default function main(request: HexString, settings: string): HexString {
  console.log(`handle reqs are : ${request}`);
  let requestId, encodedAddress;
  try {
    [requestId, encodedAddress] = Coders.decode([uintCoder, addressCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, 'string',0,'0',['ysd','sdf','2','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],'23','string','0x333De8E1bac69F3F44C8a7ffFE6c9559e7CD83D8',3,'0x333De8E1bac69F3F44C8a7ffFE6c9559e7CD83D8',23,'0x54ebc53b8763a0da62d0ab89520117c1eed5151cec708cd44fda441b4feced9d']);
  }
  
  const add = parseHexToAddress(request as string)
  console.log(`Request received for addresssdfds   ${add}`);
  // const parsedHexReqStr = parseReqStr(encodedReqStr as string);
  // console.log(`Request received for profile ${parsedHexReqStr}`);

  try {
    console.info('try here ')
    // const respData = Bridge(secrets, parsedHexReqStr);
    const respData = BridgeFetch(settings, add);
    let stats1: string = respData.deposits[0].deposit_cnt;
    let stats2: number = respData.deposits[0].network_id;
    let stats10: number = respData.deposits[0].orig_net;
    let stats9: string = respData.deposits[0].orig_addr;
    let stats8: number = respData.deposits[0].dest_net;
    let stats7: string = respData.deposits[0].dest_addr;
    let stats6: string = respData.deposits[0].amount;
    let stats5: string = respData.deposits[0].metadata;
    
const respData2=BridgeFetch2(stats1,stats2)   

let stat3:string=respData2.proof.main_exit_root
let stat11:string=respData2.proof.rollup_exit_root

let stats4:string[]=respData2.proof.merkle_proof
console.info(stats4)
// console.info("father" +stats1 + stats7 + stats5 +stats2)
    return encodeReply([TYPE_RESPONSE, requestId,stats1,stats2,stat3,stats4,stats5,stats6,stats7,stats8,stats9,stats10,stat11]);
  }
 catch (error) {

    if (error === Error.FailedToFetchData) {
      throw error;
    } else {
      // ,number,number,string,string,number,string,number,string,number,number
      // Otherwise, tell the client we cannot process it
      console.log("errors", [TYPE_ERROR, requestId, error]);
      // return encodeReply([TYPE_ERROR, requestId, errorToCode(error as Error),1,1,['ysd','sdf','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],'23',2,'sd',3,'s',23,'0x54ebc53b8763a0da62d0ab89520117c1eed5151cec708cd44fda441b4feced9d']);
      return encodeReply([TYPE_ERROR, 0, 'string',0,'0',['ysd','sdf','2','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],'23','string','0x333De8E1bac69F3F44C8a7ffFE6c9559e7CD83D8',3,'0x333De8E1bac69F3F44C8a7ffFE6c9559e7CD83D8',23,'0x54ebc53b8763a0da62d0ab89520117c1eed5151cec708cd44fda441b4feced9d']);
      // uintCoder,uintCoder,stringCoder,uintCoder,bytesCoder,bytesArrayCoder,stringCoder,stringCoder,addressCoder,uintCoder,addressCoder,uintCoder32,bytesCoder
    }
  }
}