import Link from "next/link"
import { useState, useEffect } from "react";

export default function Navbar() {

    const [walletAddress, setWalletAddress] = useState(null);

    const connectWallet = async () => {
        const { solana } = window;
    
        if (solana) {
          const response = await solana.connect();
          setWalletAddress(response.publicKey.toString());
        }
      };

      const checkIfWalletIsConnected = async () => {
        try {
          const { solana } = window;
          if (solana) {
            if (solana.isPhantom) {
              const response = await solana.connect({ onlyIfTrusted: true });
    
              setWalletAddress(response.publicKey.toString());
            }
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

    const [active, setActive] = useState(false);

    const handleClick = () => {
      setActive(!active);
    };

    return (
      <div className="basis-1/12">
      <nav className='h-screen flex items-center place-content-center flex-wrap bg-purple-400 p-3 '>
        <Link href='/'>
        <a className='inline-flex items-center p-2 '>
            <span className='text-2xl text-white font-bold uppercase tracking-wide'>
              SolNews
            </span>
          </a>
        </Link>
          <div className='w-auto flex items-center justify-center'>
            <Link href='/'>
                <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-purple-500 hover:text-white '>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                   
                </a>
            </Link>
            <Link href='/create'>
              <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-purple-500 hover:text-white '>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </a>
            </Link>
            <Link href={`/${walletAddress}/account`}>
                <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-purple-500 hover:text-white '>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </a>
            </Link>
            {/*<Link href={`/${walletAddress}/account`}>
                <a className='lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-white font-bold items-center justify-center hover:bg-purple-500 hover:text-white '>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </a>
              </Link>*/}
          </div>
      </nav>
      </div>
    );
  }