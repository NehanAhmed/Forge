import DarkVeil from '@/components/DarkVeil'
import Header from '@/components/Landing/header'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <DarkVeil
                hueShift={-115}
                noiseIntensity={0}
                scanlineIntensity={0}
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
                resolutionScale={1}
            />
            <main className='relative'>

            <Header />
            {children}
            </main>
        </>
    )
}

export default Layout