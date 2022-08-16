import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Router from 'next/router'

import Navbar from '../components/Navbar'

import { useEffect, useState } from "react"

import { Connection, PublicKey} from '@solana/web3.js';

import {
    Program, AnchorProvider, web3
  } from '@project-serum/anchor';

import { useTypingText } from "../useTypingText";

const Writer = dynamic(() => import('../components/editorjs/editor'), {
    ssr: false,
})

const solana_config = require("../solana.config")

import kp from "../keypair.json"

import idl from '../idl.json'

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

const getProvider = () => {
  const connection = new Connection(solana_config.network, solana_config.opts.preflightCommitment);
  const provider = new AnchorProvider(connection, window.solana, solana_config.opts.preflightCommitment);
  return provider;
}

export default function Post() {

    const [walletAddress, setWalletAddress] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
          const { solana } = window;
          if (solana) {
            if (solana.isPhantom) {
              const response = await solana.connect({ onlyIfTrusted: true });
    
              setWalletAddress(response.publicKey.toString());


            }
          } else {
            alert('Solana object not found! Get a Phantom Wallet 👻');
          }
        } catch (error) {
          console.error(error);
        }
      };

    
      useEffect(() => {
        const onLoad = async () => {
          await checkIfWalletIsConnected();
        };
    
        if(document.readyState == "complete"){
          onLoad()
        }
      }, []);

      const renderNotConnectedContainer = () => {
        return(
          <div>
            <button onClick={() => {Router.push("/")}} className="px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md">Error, Click Me</button>
          </div>
        )
      }

      const renderConnectedContainer = () => {
        return(
          <div>
            <Writer walletAddress={walletAddress} idl={idl} programID={programID} provider={getProvider()} baseAccount={baseAccount}/>
          </div>
        )
      }

      const { word, stop, start } = useTypingText(
        ["Story", "Blog", "Piece"],
        130,
        20
      );

    return (
    <div className="bg-purple-400 flex overflow-x-hidden">
      <Head>
        <title>SolNews</title>
      </Head>
      <Navbar />
      <div className="bg-white flex flex-col">
          <Head>
              <meta charset="utf-8" />
          </Head>
          <div className="w-screen flex flex-col place-items-center m-10">
              <h1 className="font-sans font-normal underline">Write a {word}</h1>
          </div>
          <div className="w-2/5 place-self-center">
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
              
          </div>
          
      </div>
    </div>
    )
}
