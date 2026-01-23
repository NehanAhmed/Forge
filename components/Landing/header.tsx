import { Button } from '../ui/button'
import Link from 'next/link'
import { IconBrandGithubFilled, IconBrandXFilled, IconMenu2 } from '@tabler/icons-react'
import { FlipLink } from './FlipLink'
import { authClient } from '@/lib/auth-client'
import { auth } from '@/auth'
import { headers } from 'next/headers'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const NAV_LINKS = [
    { id: 1, label: "Explore", href: "/explore" },
    { id: 2, label: "Create Project", href: "/create" },
    { id: 3, label: "Support Me", href: "/support" }
]

const Header = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    return (
        <nav className="
            w-full px-4 md:px-8 lg:px-16 py-6 
            flex items-center justify-between
            z-100
            backdrop-blur-lg 
            font-hanken-grotesk
        ">
            {/* Logo */}
            <div className='px-2'>
                <Link href={'/'}>
                    <h1 className='text-2xl md:text-3xl font-semibold font-space-grotesk uppercase'>Forge</h1>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center justify-start gap-6 flex-1 px-8'>
                {NAV_LINKS.map((val) => (
                    <FlipLink key={val.id} href={val.href}>
                        <p className='text-md'>{val.label}</p>
                    </FlipLink>
                ))}
                {session?.session && (
                    <FlipLink href='/p'>My Projects</FlipLink>
                )}
            </div>

            {/* Desktop Actions */}
            <div className='hidden lg:flex items-center justify-center gap-2'>
                <Link href={'https://x.com/@Nehanahmed988'} target='_blank' referrerPolicy='no-referrer'>
                    <Button size={'lg'} variant={'ghost'}>
                        <IconBrandXFilled className='text-white' /> 
                        <span className='ml-2'>Twitter</span>
                    </Button>
                </Link>
                <Link href={'https://github.com/NehanAhmed/Forge'} target='_blank' referrerPolicy='no-referrer'>
                    <Button size={'lg'} variant={'ghost'}>
                        <IconBrandGithubFilled /> 
                        <span className='ml-2'>20.2K</span>
                    </Button>
                </Link>
                {!session?.session && (
                    <>
                        <FlipLink href={'/login'}>
                            <Button size={'lg'} variant={'outline'}>Login</Button>
                        </FlipLink>
                        <FlipLink href={'/get-started'}>
                            <Button size={'lg'}>Get Started</Button>
                        </FlipLink>
                    </>
                )}
            </div>

            {/* Mobile Menu */}
            <div className='lg:hidden font-hanken-grotesk'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <IconMenu2 className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] px-10">
                        <SheetHeader>
                            <SheetTitle className="text-left font-space-grotesk text-2xl">FORGE</SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-6 mt-8">
                            {/* Navigation Links */}
                            <div className="flex flex-col gap-4">
                                {NAV_LINKS.map((val) => (
                                    <FlipLink 
                                        key={val.id} 
                                        href={val.href}
                                        className="text-lg hover:text-primary transition-colors font-hanken-grotesk"
                                    >
                                        {val.label}
                                    </FlipLink>
                                ))}
                                {session?.session && (
                                    <FlipLink 
                                        href='/p'
                                        className="text-lg hover:text-primary transition-colors"
                                    >
                                        My Projects
                                    </FlipLink>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* Social Links */}
                            <div className="flex flex-col gap-3">
                                <Link href={'https://x.com/@Nehanahmed988'} target='_blank' referrerPolicy='no-referrer'>
                                    <Button size={'lg'} variant={'ghost'} className="w-full justify-start">
                                        <IconBrandXFilled className='text-white' /> 
                                        <span className='ml-2'>Twitter</span>
                                    </Button>
                                </Link>
                                <Link href={'https://github.com/NehanAhmed/Forge'} target='_blank' referrerPolicy='no-referrer'>
                                    <Button size={'lg'} variant={'ghost'} className="w-full justify-start">
                                        <IconBrandGithubFilled /> 
                                        <span className='ml-2'>20.2K Stars</span>
                                    </Button>
                                </Link>
                            </div>

                            {/* Auth Buttons */}
                            {!session?.session && (
                                <>
                                    <div className="border-t border-border" />
                                    <div className="flex flex-col gap-3">
                                        <FlipLink href={'/login'} className="w-full">
                                            <Button size={'lg'} variant={'outline'} className="w-full">
                                                Login
                                            </Button>
                                        </FlipLink>
                                        <FlipLink href={'/get-started'} className="w-full">
                                            <Button size={'lg'} className="w-full">
                                                Get Started
                                            </Button>
                                        </FlipLink>
                                    </div>
                                </>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    )
}

export default Header