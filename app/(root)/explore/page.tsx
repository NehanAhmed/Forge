import ProjectsGrid from '@/components/Landing/Explore/projects-grid'
import SearchFilter from '@/components/Landing/Explore/search-filter'
import { Separator } from '@/components/ui/separator'
import { getAllProjects } from '@/lib/actions/projects.action'
import { Project } from '@/lib/db/schema'
import React from 'react'


const Page = async () => {
    const projects = await getAllProjects()
    return (

        <main className='w-full px-10 font-hanken-grotesk mt-14'>
            <div className='flex flex-col gap-2 px-10'>
                <h1 className='text-3xl md:text-4xl font-bold '><span className='bg-gradient-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent'>Good Ideas. </span> Zero Blank Screens.
                </h1>
                <p className='text-lg text-neutral-400 w-240'>Explore real project blueprints and architectures. Clone smarter, ship faster, think less.                </p>
            </div>
            <Separator className='mt-10' />
            <SearchFilter />
            <Separator className='mt-10' />
            <ProjectsGrid projects={projects} />
        </main>
    )
}

export default Page