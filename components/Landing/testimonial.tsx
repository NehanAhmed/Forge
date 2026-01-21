import { Tweet } from 'react-tweet'

const Testimonial = () => {
    return (
        <section className='w-full min-h-[50vh] flex flex-col items-center justify-start gap-10 mt-20'>
            <div className='w-1/2 text-center mx-auto flex flex-col gap-3 justify-center items-center '>
                <div className='flex flex-col gap-5 items-start justify-start'>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-sm font-medium text-primary">
                            Our Lovers
                        </span>
                    </div>


                </div>
                <h1 className='text-4xl md:text-5xl font-bold '><span className='bg-gradient-to-r from-primary via-destructive to-secondary bg-clip-text text-transparent'>
                    Devs Ship.</span> Forge Helps.

                </h1>
                <p className='text-lg text-muted-foreground max-w-2xl mx-auto font-hanken-grotesk'>Real developers. Real projects. Fewer late nights debugging things that should’ve been planned better. Forge helped them ship faster — and sleep slightly more.
                </p>
            </div>
            <div  className='w-full flex items-center justify-center gap-4'>
                <Tweet id='1996143465558835216'  />
                <Tweet id='2013302602931265571'  />
                <Tweet id='1683920951807971329'  />
            </div>
        </section>
    )
}

export default Testimonial