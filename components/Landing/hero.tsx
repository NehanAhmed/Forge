import React from 'react'
import { Button } from '../ui/button'
import { IconArrowRight, IconGlobe, IconGlobeFilled, IconWorldSearch } from '@tabler/icons-react'
import Link from 'next/link'
import { FlipLink } from './FlipLink'
import { Badge } from '../ui/badge'

const Hero = () => {
    return (
        <section className='w-full min-h-[70vh] flex flex-col items-start justify-end px-10'>

            <div className='flex flex-col gap-5 items-start justify-start'>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-sm font-medium text-primary">
                        AI-Powered Planning
                    </span>
                </div>

                <h1 className='text-6xl tracking-tight font-extrabold font-hanken-grotesk '> <span className='bg-gradient-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent'> Project Planning</span> at <br /> the Speed of Thought
                </h1>
                <p className='text-lg text-neutral-400 w-200'>Describe your idea. Get a complete technical plan with stack recommendations, database schema, risk analysis, and a development roadmap. In seconds, not sprints.</p>
            </div>
            <div className='mt-6 flex items-center justify-center gap-4'>
                <FlipLink href={'/create'}>
                    <Button size={'lg'}
                    >

                        Start Planning
                        <IconArrowRight /></Button>
                </FlipLink>
                <FlipLink>
                    <Button size={'lg'} variant={'outline'}>
                        <IconWorldSearch />
                        Explore
                    </Button>
                </FlipLink>
            </div>

        </section>
    )
}

export default Hero