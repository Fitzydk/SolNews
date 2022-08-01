import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Writer = dynamic(() => import('../components/editorjs/editor'), {
    ssr: false,
})

export default function Post() {


    return (
    <div className="bg-white grid">
        <Head>
            <meta charset="utf-8" />
        </Head>
        <div>
            <p>Write a story</p>
        </div>
        <div className="w-2/5 place-self-center">
            <Writer />
        </div>
        
    </div>
    )
}
