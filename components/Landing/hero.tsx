import React from 'react'
import { Button } from '../ui/button'
import { IconArrowRight, IconGlobe, IconGlobeFilled, IconWorldSearch } from '@tabler/icons-react'
import Link from 'next/link'
import { FlipLink } from './FlipLink'
import { Badge } from '../ui/badge'

const Hero = () => {
    return (
        <section className='w-full min-h-[60vh] flex flex-col items-start justify-end px-10'>

            <div className='flex flex-col gap-5 items-start justify-start'>
                <h1 className='text-7xl tracking-tight font-extrabold font-space-grotesk uppercase'> <span className='text-accent'> Project Plan</span> at <br /> the Speed of Thought
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