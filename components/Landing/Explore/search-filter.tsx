'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconBrandNextjs, IconBrandReact, IconBrandTailwind } from '@tabler/icons-react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useState, useEffect, useCallback } from 'react'

const SearchFilter = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // Initialize state from URL params
    const [query, setQuery] = useState(searchParams.get('query') || '')
    const [pType, setPType] = useState(searchParams.get('projectType') || '')
    const [aType, setAType] = useState(searchParams.get('appType') || '')
    const [techStack, setTechStack] = useState<string[]>(
        searchParams.get('tech')?.split(',').filter(Boolean) || []
    )

    // Function to update URL params
    const updateSearchParams = useCallback((updates: Record<string, string | string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                params.delete(key)
            } else if (Array.isArray(value)) {
                params.set(key, value.join(','))
            } else {
                params.set(key, value)
            }
        })

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }, [searchParams, pathname, router])

    // Update URL when query changes (with debounce effect)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateSearchParams({ query })
        }, 300)
        
        return () => clearTimeout(timeoutId)
    }, [query])

    // Update URL when project type changes
    const handleProjectTypeChange = (value: string) => {
        setPType(value)
        updateSearchParams({ projectType: value })
    }

    // Update URL when application type changes
    const handleAppTypeChange = (value: string) => {
        setAType(value)
        updateSearchParams({ appType: value })
    }

    // Toggle tech stack selection
    const toggleTechStack = (tech: string) => {
        const newTechStack = techStack.includes(tech)
            ? techStack.filter(t => t !== tech)
            : [...techStack, tech]
        
        setTechStack(newTechStack)
        updateSearchParams({ tech: newTechStack })
    }

    return (
        <div className='w-full max-h-[40vh] flex items-start justify-start gap-5 px-10'>
            <div>
                <div className='flex items-start justify-start gap-10'>
                    <div className='flex flex-col gap-4 py-4'>
                        <div className='space-y-3'>
                            <Label htmlFor='search-input'>Search Project using Name</Label>
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                type='search'
                                id='search-input'
                                placeholder='e.g: Ecommerce, Chat App'
                                className='w-full max-w-[560px]'
                            />
                        </div>
                        
                        <div className='flex items-center justify-start gap-3'>
                            <div className="space-y-3">
                                <Label htmlFor='project-type'>Project Type</Label>
                                <Select value={pType} onValueChange={handleProjectTypeChange}>
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="Select a Project Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="web">Web Application</SelectItem>
                                            <SelectItem value="mobile">Mobile App</SelectItem>
                                            <SelectItem value="desktop">Desktop App</SelectItem>
                                            <SelectItem value="api">API/Backend</SelectItem>
                                            <SelectItem value="fullstack">Full Stack</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-3">
                                <Label htmlFor='app-type'>Application Type</Label>
                                <Select value={aType} onValueChange={handleAppTypeChange}>
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="Select an Application Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                                            <SelectItem value="social">Social Media</SelectItem>
                                            <SelectItem value="productivity">Productivity</SelectItem>
                                            <SelectItem value="entertainment">Entertainment</SelectItem>
                                            <SelectItem value="education">Education</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <Label>Tech Stack</Label>
                            <div className="flex gap-2">
                                <Button 
                                    type="button"
                                    variant={techStack.includes('nextjs') ? 'default' : 'outline'}
                                    onClick={() => toggleTechStack('nextjs')}
                                >
                                    <IconBrandNextjs className="mr-2" />
                                    Next.js
                                </Button>
                                <Button 
                                    type="button"
                                    variant={techStack.includes('tailwind') ? 'default' : 'outline'}
                                    onClick={() => toggleTechStack('tailwind')}
                                >
                                    <IconBrandTailwind className="mr-2" />
                                    Tailwind CSS
                                </Button>
                                <Button 
                                    type="button"
                                    variant={techStack.includes('react') ? 'default' : 'outline'}
                                    onClick={() => toggleTechStack('react')}
                                >
                                    <IconBrandReact className="mr-2" />
                                    React
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchFilter