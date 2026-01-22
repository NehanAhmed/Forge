import DarkVeil from '@/components/DarkVeil'
import Footer from '@/components/Landing/footer'
import Header from '@/components/Landing/header'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative w-full min-h-screen">
            {/* Background effect - positioned absolutely to cover entire viewport */}
            <div className="absolute  inset-0 z-0 h-1/4">
               {/* <DarkVeil
                hueShift={-115}
                noiseIntensity={0}
                scanlineIntensity={0}   
                speed={0.5}
                scanlineFrequency={0}
                warpAmount={0}
                resolutionScale={1}
            /> */}
            </div>
            
            {/* Header - fixed at top */}
            <Header />
            
            {/* Main content - with padding to account for fixed header */}
            <div className="relative z-10 pt-24">
                {children}
            </div>
            <Footer />

        </div>
    )
}

export default Layout