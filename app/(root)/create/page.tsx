import { ProjectForm } from '@/components/Landing/Create/project-form'
import { Separator } from '@/components/ui/separator'
import React from 'react'

const Page = () => {
    return (
        <main className='w-full font-hanken-grotesk mt-14 px-10'>
            <div className='flex flex-col gap-2 px-10'>
                <h1 className='text-2xl md:text-3xl font-bold'>Create Your Project Blueprint
                </h1>
                <p className='text-sm text-neutral-400'>Describe your idea. Forge generates architecture, roadmap, and system design automatically.
                </p>
            </div>
            <Separator className='mt-5' />
            <ProjectForm />
        </main>
    )
}

export default Page