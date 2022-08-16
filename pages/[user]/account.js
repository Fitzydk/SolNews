import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import Select from "react-select"
import Navbar from '../../components/Navbar'
import ArticleCard from '../../components/ArticleCard'

import { useEffect, useState } from 'react'

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

export default function Account() {
    const router = useRouter()
    const { user } = router.query

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [articleList, setArticleList] = useState([]);
  const [articleTags, setArticleTags] = useState([])
  const [SearchTags, setSearchTags] = useState([])
  const [CacheArticleDivs, setCacheArticleDivs] = useState([])

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
      await getArticleList();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }



  const renderNotConnectedContainer = () => (
    <div>
        <button
        className="px-16 py-8 bg-gradient-to-r from-[#DC1FFF] to-[#00ffa2] text-white font-bold text-xl font-mono leading-tight uppercase rounded shadow-md background-animate hover:shadow-black transition ease-in shadow-xl"
        onClick={connectWallet}
        >
        Connect to Wallet
      </button>
      <style jsx>{`
          .background-animate {
            background-size: 400%;
        
            -webkit-animation: AnimationName 3s ease infinite;
            -moz-animation: AnimationName 3s ease infinite;
            animation: AnimationName 3s ease infinite;
          }
        
          @keyframes AnimationName {
            0%,
            100% {
              background-position: 0% 50%;
              border-
            }
            50% {
              background-position: 100% 50%;
            }
          }
      `}</style>
    </div>
  )

  const renderConnectedContainer = () => {
    const provider = getProvider();
    if (articleList === null) {
      return (
        <div className="bg-blue-200">
          <button className="px-16 py-8 bg-gradient-to-r from-[#DC1FFF] to-[#00ffa2] text-white font-bold text-xl font-mono leading-tight uppercase rounded shadow-md background-animate hover:shadow-black transition ease-in shadow-xl" onClick={createArticleAccount}>
            Do One-Time Initialization For Articles Program Account
          </button>
        </div>
      )
    } 
    else {
      return(
      <div className="Articles">
        {articleList.map((items, index) => {
        if(items.walletAdd == user){
            return <ArticleCard key={index} articleId={items["articleId"]} walletAdd={items["walletAdd"]} content={items["content"]} articleTags={articleTags[articleTags.findIndex((item, i) => {return item.id === items["articleId"]})]}/>
        }
        })}
      </div>
      )
    }
}


  useEffect(() => {
    fetch('.././api/getCategories', {
      method: "POST",
      body: "GetCategories",
    }).then((resp) => {
        return resp.json()
    }).then((data) => {
      
        setArticleTags(data)
    })
    fetch('.././api/getCategories', {
      method: "POST",
      body: "",
    }).then((resp) => {
        return resp.json()
    }).then((data) => {
        setSearchTags(data)
    })

    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };

    if(document.readyState == "complete"){
      onLoad()
    }
  }, []);

  const getArticleList= async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      setArticleList(account.articles)
  
    } catch (error) {
      console.log("Error in getArticleList: ", error)
      setArticleList(null);
    }
  }
  useEffect(() => {
    if (walletAddress) {
      getArticleList()
    }
  }, [walletAddress]);

  function contains(a, s) {
    for(var i = 0, l = s.length; i < l; i++) {
       if(!~a.indexOf(s[i])) {
          return false;
       }
    }
    return true;
 }

 function handleChange(items){
    if(CacheArticleDivs.length == 0){
      setCacheArticleDivs(document.getElementsByClassName("Articles")[0].children)
    }

    const selectedTags = items.map((tag) => {
        return tag.value
    })


    let articles = document.getElementsByClassName("Articles")[0].children
    let matchedArticles = []
    for(var i = 0; i < articles.length; i++){
      let tags = articles[i].getAttribute("data-tags").split(",")
      let doesContain = contains(tags, selectedTags)
      doesContain ? matchedArticles.push(articles[i].getAttribute("data-id")) : null
      articles[i].style.display = "none"
    }

    for(var v = 0; v < matchedArticles.length; v++){
      let block = document.querySelector(`[data-id="${matchedArticles[v]}"]`)
      block.style.display = "block"
    }
  } 

  return (
    <div className="flex">
        <Head>
            <title>SolNews</title>
        </Head>
      <Navbar/>
      <div className="bg-slate-900 h-screen w-screen grid place-items-center">
        <h1 className="text-white font-medium leading-tight uppercase underline underline-offset-8">Your writings</h1>
        <Select
                className='w-1/2'
                id="long-value-select" 
                instanceId="long-value-select"
                isMulti={true}
                options={SearchTags}
                onChange={(element) => handleChange(element)}
            />
            {!walletAddress && renderNotConnectedContainer()}
            {walletAddress && renderConnectedContainer()}
      </div>
    </div>
  )
}