import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'


export default function Post() {

    const router = useRouter()
    const { user } = router.query

    return (
    <div className="bg-black">
        <p className="text-red-500 font-serif">{user}</p>
        <button></button>
    </div>
    )
}
