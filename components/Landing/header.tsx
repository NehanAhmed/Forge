import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { IconBrandGithubFilled, IconBrandXFilled } from '@tabler/icons-react'


const NAV_LINKS = [
    { id: 1, label: "Explore", href: "/explore" },
    { id: 2, label: "Create Project", href: "/create" }
]

const Header = () => {
    return (
        <nav className="
    w-full px-16 py-6 
    flex items-center justify-center gap-4
    fixed top-0 z-50
    backdrop-blur-lg 
  ">
            <div className='px-2'>
                <h1 className='text-3xl font-semibold font-space-grotesk uppercase'>Forge</h1>
            </div>
            <div className='w-10/12 px-15  flex items-end justify-start gap-6 font-hanken-grotesk'>
                {NAV_LINKS.map((val) => (
                    <Link key={val.id} href={val.href}>
                        <p className='text-md '>{val.label}</p>
                    </Link>
                ))}
            </div>
            <div className='flex items-center justify-center gap-2 font-hanken-grotesk'>
                <Link href={'https://x.com/@Nehanahmed988'} target='_blank' referrerPolicy='no-referrer'>
                    <Button size={'lg'} variant={'ghost'}><IconBrandXFilled className='text-white' /> Twitter</Button>
                </Link>
                <Link href={'https://github.com/NehanAhmed/Forge'} target='_blank' referrerPolicy='no-referrer' >
                    <Button variant={'ghost'}><IconBrandGithubFilled /> 20.2K</Button>
                </Link>
                <Link href={'/login'}>
                    <Button size={'lg'} variant={'outline'}>Login</Button>
                </Link>
                <Link href={'/get-started'}>
                    <Button size={'lg'}>Get Started</Button>
                </Link>
            </div>
        </nav>
    )
}

export default Header