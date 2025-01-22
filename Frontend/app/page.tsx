'use client'

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";


import List from "./components/List";
import Token from "./components/Token";
import Header from "./components/Header";
import Trade from "./components/Trade";

// ABIs & Configs
import MemeFactory from "./constants/MemeFactory.json";
import config from "./constants/config.json";
import images from "./images.json";


interface Window {
  ethereum?: ExternalProvider;
}


export default function Home() {

//   interface tokenss {
//     token: string;
//     name: string;
//     creator: string;
//     sold: bigint;
//     raised: bigint;
//     isOpen: boolean;
//     image: string;
// }[]

  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [account, setAccount] = useState("");
  const [factory, setFactory] = useState<ethers.Contract | undefined>(undefined);
  const [fee, setFee] = useState(Number);
  const [showCreate, setShowCreate] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [token, setToken] = useState<any>();
  const [trade, setTrade] = useState(false);

  // function toggleCreate() {
  //   showCreate ? setShowCreate(false) : setShowCreate(true);
  // }

  async function loadBlockchainData() {
    if (typeof (window as any).ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(provider);
      console.log("Ethereum provider detected");
      console.log(provider)

        // BOTH of the requests works!
      // const accounts = await (window as any).ethereum.request({method: 'eth_requestAccounts'});
      // const accounts = await provider.send("eth_requestAccounts", []);
      // const account = await provider.getSigner();

      // console.log(accounts[0]);
      // console.log(account);

      // const signer = await provider.getSigner();
      // console.log(signer); Asking for signer also prompts metamask to pop up

      const network = await provider.getNetwork();
      console.log(network.chainId);

      const chainId = network.chainId.toString();
      const address = config[`${network.chainId}` as keyof typeof config].factory.address as string;
      console.log(address)

      const contractFactory = new ethers.Contract(address, MemeFactory, provider);
      console.log(contractFactory);

      setFactory(contractFactory);

      const fee = await contractFactory.fee();
      console.log(fee);

      setFee(fee);

      // Token details
      const totalTokens = await contractFactory.totalTokens();
      console.log(totalTokens);
      const tokens = [];

      for(let i = 0; i < totalTokens; i++) {

        const tokenSale = await contractFactory.getTokenSale(i);
        console.log("token", tokenSale);

        const token = {
          token: tokenSale.token,
          name: tokenSale.name,
          creator: tokenSale.creator,
          sold: tokenSale.sold,
          raised: tokenSale.raised,
          isOpen: tokenSale.isOpen,
          image: images[i]
        }

        tokens.push(token);
      }

      console.log(tokens.reverse())

      setTokens(tokens);
      
    } else {
      console.error("Ethereum provider not found");
    }
  }

  useEffect(() => {
    loadBlockchainData();
  }, [showCreate, trade]);




  return (
    <div className="page">
      <Header account={account} setAccount={setAccount} />

      <main>
        <div className="create">
          <button className="btn--fancy" onClick={() => {account && factory && setShowCreate(true)}}>
            {!factory ? (
              "[ Contract not deployed ]"
            ): !account ? (
              "[ Please connect wallet ]"
            ) : (
              "[ Start a new token ]"
            )}
          </button>
        </div>

        <div className="listings">
          <h1>New Listings</h1>

          <div className="tokens">
            {!account ? (
              <p>please connect wallet</p>
            ): tokens?.length == 0 ? (
              <p>No tokens listed</p>
            ) : (
              tokens?.map((token: any, index: any) => (
                <div key={index}>
                <Token setToken={setToken} setTrade={setTrade} token={token} />
                  </div>
            ))
            )}
          </div>
        </div>
      </main>

      {showCreate && <List setShowCreate={setShowCreate} fee={fee} provider={provider} factory={factory} />}

      {trade && <Trade token={token} setTrade={setTrade} provider={provider} factory={factory}/>}

    </div>
  );
}
