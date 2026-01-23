import React from 'react'
import { ContainerScroll } from '../ui/container-scroll-animation'

const ProjectDemo = () => {
    return (
        <section className='w-full min-h-[20vh] flex justify-start items-center px-10 py-8 mt-12 '>
            <div className=' w-full   shadow-sm border-8  flex items-start justify-center'>
                <video className='w-full ' autoPlay loop muted>
                    <source src="https://www.pexels.com/download/video/7102266/" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </section>
    )
}

export default ProjectDemo