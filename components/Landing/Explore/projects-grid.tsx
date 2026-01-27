import ProjectCard from '@/components/project-card'
import { Project } from '@/lib/db/schema'
import React from 'react'

const ProjectsGrid = ({ projects }: { projects: Project[] }) => {

  return (
    <div className='w-full min-h-[30vh] px-10 flex flex-col gap-10 py-4'>
      <div>
        <h1>{projects.length} Projects found</h1>
      </div>
      {projects.length === 0 ? (
        <div>
          <h1 className='text-xl font-bold font-hanken-grotesk'>No Projects Found</h1>
          <p>Try Adjusting your filter and then trying again.</p>
        </div>
      ) : (
        <>
          {projects.map((project) => (
            <div key={project.id} className='w-full grid grid-cols-1 '>
              <ProjectCard data={project} />
            </div>
          ))}
        </>
      )
      }

    </div >
  )
}

export default ProjectsGrid