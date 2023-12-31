import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { ProxyAgent, setGlobalDispatcher } from 'undici';

if (process.env.http_proxy || process.env.https_proxy) {
  const proxy = (process.env.http_proxy || process.env.https_proxy)!;
  const proxyAgent = new ProxyAgent(proxy);
  setGlobalDispatcher(proxyAgent);
}

// If not set, it uses the hardhat account 0 private key.
const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// Get a free POLYGONSCAN_API_KEY at https://polygonscan.com.
const POLYGONSCAN_API_KEY ='CHJJP7NHMSU6EFTKEP3ADM3ICHUTMHVUDE'

const config: HardhatUserConfig = {
  solidity:{
    version:"0.8.17",
     settings: {
      viaIR: true,
      optimizer: {
       enabled: true,
       runs: 200,
      },
     },
},

  networks: {
    polygon: {
      // If not set, you can get your own Alchemy API key at https://dashboard.alchemyapi.io or https://infura.io
      url: process.env.POLYGON_RPC_URL ?? '',
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
    mumbai: {
      // If not set, you can get your own Alchemy API key at https://dashboard.alchemyapi.io or https://infura.io
      url: process.env.MUMBAI_RPC_URL ?? '',
      accounts: [DEPLOYER_PRIVATE_KEY],
      allowUnlimitedContractSize: true,
      gas: 5000000, //units of gas you are willing to pay, aka gas limit
      gasPrice:  50000000000, //gas is typically in units of gwei, but you must enter it as wei here

    },
    zkEvm: {
      chainId: 1442,
      // If not set, you can get your own Alchemy API key at https://dashboard.alchemyapi.io or https://infura.io
      url: process.env.MUMBAI_RPC_URL ?? '',
      accounts: [DEPLOYER_PRIVATE_KEY],
    },
  },
  
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
    customChains: [
      {
        network: "zkEvm",
        chainId: 1442,
        urls: {
          apiURL:"https://rpc.public.zkevm-test.net",
          browserURL: "https://testnet-zkevm.polygonscan.com"
        }
      }
    ]
  },
};

export default config;
