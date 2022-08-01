import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'


export default function Post() {

    const router = useRouter()
    const { post, user } = router.query

    return (
    <div className="bg-black justify-items-end w-full h-screen grid">
        <p className="text-red-500 font-serif">{post}</p>
        <p className="text-gray-500 font-serif">{user}</p>
        <button className="text-white bg-slate-500 ">test</button>
    </div>
    )
}
