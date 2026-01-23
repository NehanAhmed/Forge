import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { IconBrandGithubFilled, IconBrandXFilled } from '@tabler/icons-react'
import { FlipLink } from './FlipLink'


const NAV_LINKS = [
    { id: 1, label: "Explore", href: "/explore" },
    { id: 2, label: "Create Project", href: "/create" },
    { id: 3, label: "Support Me", href: "/support" }

]

const Header = () => {
    return (
        <nav className="
    w-full px-16 py-6 
    flex items-center justify-center gap-4
    z-100
    backdrop-blur-lg 
    font-hanken-grotesk
  ">
            <div className='px-2'>
                <Link href={'/'}>
                <h1 className='text-3xl font-semibold font-space-grotesk uppercase'>Forge</h1>
                </Link>
            </div>
            <div className='w-10/12 px-15  flex items-end justify-start gap-6 font-hanken-grotesk'>
                {NAV_LINKS.map((val) => (

                    <FlipLink key={val.id} href={val.href}>
                        <p className='text-md '>{val.label}</p>
                    </FlipLink>

                ))}
            </div>
            <div className='flex items-center justify-center gap-2 font-hanken-grotesk'>
                <Link href={'https://x.com/@Nehanahmed988'} target='_blank' referrerPolicy='no-referrer'>
                    <Button size={'lg'} variant={'ghost'}><IconBrandXFilled className='text-white' /> Twitter</Button>
                </Link>
                <Link href={'https://github.com/NehanAhmed/Forge'} target='_blank' referrerPolicy='no-referrer' >
                    <Button size={'lg'} variant={'ghost'}><IconBrandGithubFilled /> 20.2K</Button>
                </Link>
                <FlipLink href={'/login'}>
                    <Button size={'lg'} variant={'outline'}>Login</Button>
                </FlipLink>
                <FlipLink href={'/get-started'}>
                    <Button size={'lg'}>Get Started</Button>
                </FlipLink>
            </div>
        </nav>
    )
}

export default Header