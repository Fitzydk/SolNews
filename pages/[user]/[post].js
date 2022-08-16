import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic';

import Navbar from '../../components/Navbar';

const Output = dynamic(
    async () => (await import('editorjs-react-renderer')).default,
    { ssr: false }
  );

import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, AnchorProvider, web3
} from '@project-serum/anchor';

import { Buffer } from 'buffer';

import kp from "../../keypair.json"

import idl from '../../idl.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

const solana_config = require("../../solana.config")

const opts = solana_config.opts
const network = solana_config.network

export default function Home() {


  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [Article, setArticle] = useState(null);

  const router = useRouter()

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


  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
    return provider;
  }

  const createArticleAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      await program.rpc.initialize({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      await getArticle();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }


  function openArticle(address, contentId){
    router.push(`/${address}/${contentId}`)
  }


  const renderConnectedContainer = () => {
    const provider = getProvider();
    if (Article === null) {
    //   router.push("/")
    } 
    else {
        let blogData = Article
        return(
        <div className="bg-white w-10/12 h-5/6 rounded-2xl font-sans p-10">
            <Output data={JSON.parse('{"blocks": '+blogData.content+"}")}/>
        </div>
        )
    }
}


  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    if(document.readyState == "complete"){
      onLoad()
    }
  }, []);

  const getArticle= async() => {
    try {
        const provider = getProvider();
        const program = new Program(idl, programID, provider);
        const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
        let articles = account.articles
        
        const postIDfromQuery = router.query.post

        for(var i = 0; i < articles.length; i++){
            if(articles[i]["articleId"] == postIDfromQuery){
                setArticle(articles[i])
            }
        }
  
    } catch (error) {
      console.log("Error in getArticleList: ", error)
      setArticle(null);
    }
  }
  useEffect(() => {
    if (walletAddress) {
      getArticle()
    }
  }, [walletAddress]);


  return (
    <div className="bg-slate-900 h-screen flex place-items-center">
      <Navbar/>
          <Head>
            <title>SolNews</title>
          </Head>
          <div className='flex items-center justify-center w-screen h-screen'>
            {walletAddress && renderConnectedContainer()}
          </div>
    </div>
  )
}
