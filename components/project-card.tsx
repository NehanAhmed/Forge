import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { IconArrowRight, IconBrandNextjs, IconEye, IconGitFork } from '@tabler/icons-react'
import { Badge } from './ui/badge'
import { Project } from '@/lib/db/schema'
import Link from 'next/link'

const ProjectCard = ({ data }: { data: Project }) => {
    return (
        <Card className='w-full max-h-[300px] h-full font-hanken-grotesk'>
            <CardContent className='w-full flex items-center justify-start gap-5'>
                <div className='w-11/12 flex flex-col gap-6'>

                    <div>
                        <div className='flex items-center justify-start gap-6'>
                            <h1 className='text-2xl md:text-3xl font-bold'>{data.title}</h1>
                            <div className='flex items-center justify-center gap-2'>
                                <Badge variant={'secondary'}><IconEye />{data.viewCount}</Badge>
                                <Badge variant={'secondary'}><IconGitFork />{data.forkCount}</Badge>

                            </div>
                        </div>
                        <p className='text-sm text-neutral-400'>{data.description}</p>
                    </div>


                    <div className='flex justify-start items-center '>
                        {data.techStack?.frontend?.map((val) => (
                            <Button variant={'outline'}>
                                <IconBrandNextjs />
                                {val}
                            </Button>
                        ))}
                        <Button variant={'outline'}>
                            <IconBrandNextjs />
                            NextJs
                        </Button>
                        <Button variant={'outline'}>
                            <IconBrandNextjs />
                            NextJs
                        </Button>
                        <Button variant={'outline'}>
                            <IconBrandNextjs />
                            NextJs
                        </Button>
                    </div>
                </div>
                <div>
                    <Link href={`/p/${data.slug}`}>
                        <Button variant={'link'}>View this Project <IconArrowRight /></Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard