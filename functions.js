import Head from 'next/head'
import Image from 'next/image'

import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, AnchorProvider, web3, BN
} from '@project-serum/anchor';

import { Buffer } from 'buffer';

import kp from "./keypair.json"

import idl from './idl.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts.preflightCommitment);
    return provider;
}

const provider = getProvider();
const program = new Program(idl, programID, provider);
const account = await program.account.baseAccount.fetch(baseAccount.publicKey);

      

module.exports = {
    sendArticle: async function(walletAdd, content, articleId) {
          try {
            const provider = getProvider();
            const program = new Program(idl, programID, provider);
        
            let test = await program.rpc.addArticle(walletAdd, content, articleId, {
              accounts: {
                baseAccount: baseAccount.publicKey,
                user: provider.wallet.publicKey,
              },
            });
            return {"Article Success": inputValue}
        
          } catch (error) {
            return {"Error sending Article": error}
          }
    },
    sendSol: async function(amount, toAddress) {
        try{
            const program = new Program(idl, programID, provider);
            const LamportToSol = amount * 1000000000
            const value = new BN(parseFloat(LamportToSol))
            let tx = await program.rpc.sendSol(value, {
              accounts: {
                from: provider.wallet.publicKey,
                to: address,
                systemProgram: systemProgram.programId,
              },
            });
            return "https://explorer.solana.com/tx/" + tx + "?cluster=devnet"
        }
        catch(error) {
          return {"Error sending sol": error}
        }
    }
}