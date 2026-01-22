import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { IconArrowRight, IconBrandNextjs } from '@tabler/icons-react'
import { Badge } from './ui/badge'

const ProjectCard = () => {
    return (
        <Card className='w-full max-h-[300px] h-full font-hanken-grotesk'>
            <CardContent className='w-full flex items-center justify-start gap-5'>
                <div className='w-11/12 flex flex-col gap-6'>

                    <div>
                        <div className='flex items-center justify-start gap-6'>
                            <h1 className='text-2xl md:text-3xl font-bold'>Ecommerce Platform</h1>
                            <div className='flex items-center justify-center gap-2'>
                                <Badge  variant={'secondary'}>Good</Badge>
                                <Badge variant={'secondary'}>Good</Badge>
                                <Badge variant={'secondary'}>Good</Badge>
                            </div>
                        </div>
                        <p className='text-sm text-neutral-400'>This is soemthing i also dont know about nad it is a clena adn modern tagline or ecomm lpatforl cjncdjcndc</p>
                    </div>


                    <div className='flex justify-start items-center '>
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
                    <Button variant={'link'}>View this Project <IconArrowRight /></Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProjectCard