import ProjectCard from '@/components/project-card'
import React from 'react'

const ProjectsGrid = () => {
  return (
    <div className='w-full min-h-[30vh] px-10 flex flex-col gap-10 py-4'>
        <div>
            <h1>20 Projects found</h1>
        </div>
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
        <ProjectCard />
    </div>
  )
}

export default ProjectsGrid