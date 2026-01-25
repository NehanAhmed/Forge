import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from '../ui/button'
import Link from 'next/link'
import { IconBrandGithubFilled, IconBrandXFilled, IconCalendarCheck, IconCapProjecting, IconLogout2, IconMenu2, IconSettings2 } from '@tabler/icons-react'
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
import LogoutButton from "../logout-button"

const NAV_LINKS = [
    { id: 1, label: "Browse Ideas", href: "/explore" },
    { id: 2, label: "Ship Something", href: "/create" },
    { id: 3, label: "Buy Me Coffee", href: "/support" }
]



interface User {
    name: string
    email: string

}

function getUserInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    if (email) {
        return email.slice(0, 2).toUpperCase();
    }
    return 'U';
}

function ProfileDropdown({ user }: {
    user: { name?: string | null; email?: string | null; image?: string | null };
    role?: string;
}) {
    const initials = getUserInitials(user.name, user.email);
    const displayName = user.name || 'Valued Dev';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-10 w-10 border border-border transition-all hover:border-accent">
                        <AvatarImage src={user.image || undefined} alt={displayName} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-cinzel font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 mb-2 bg-destructive ">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none font-cinzel text-foreground ">{displayName}</p>
                        {/* <p className="text-[10px] font-bold text-accent uppercase tracking-tighter"></p> */}
                    </div>
                </DropdownMenuLabel>

                {/* VENDOR VIEW: Show Dashboard */}
                <DropdownMenuItem asChild className="cursor-pointer py-2.5 ">
                    <Link href="/my/p" className="flex items-center">
                        <IconCapProjecting className="mr-3 h-4 w-4" />
                        <span>My Projects</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                    <Link href="/settings" className="flex items-center">
                        <IconSettings2 className="mr-3 h-4 w-4" />
                        <span>Account Settings</span>
                    </Link>
                </DropdownMenuItem>



                <DropdownMenuSeparator className="my-2" />

                <div className="px-2">
                    <LogoutButton />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}



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
            <div className='hidden h-8 lg:flex items-end justify-start gap-5 flex-1 px-8'>
                {NAV_LINKS.map((val) => (
                    <FlipLink key={val.id} href={val.href}>
                        <p className='text-md'>{val.label}</p>
                    </FlipLink>
                ))}
               
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
                {session?.session ? (
                    <div className="px-2">
                        <ProfileDropdown user={session.user} />
                    </div>
                ) : (
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