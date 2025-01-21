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

  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [account, setAccount] = useState("");
  const [factory, setFactory] = useState<ethers.Contract | undefined>(undefined);
  const [fee, setFee] = useState(Number);

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
      
    } else {
      console.error("Ethereum provider not found");
    }
  }

  useEffect(() => {
    loadBlockchainData();
  }, []);




  return (
    <div className="page">
      <Header account={account} setAccount={setAccount} />
    </div>
  );
}
