'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  IconBrandNextjs, 
  IconBrandReact, 
  IconBrandTailwind,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandDocker,
  IconBrandMongodb,
  IconDatabase,
  IconX
} from '@tabler/icons-react'
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
  const [teamSize, setTeamSize] = useState(searchParams.get('teamSize') || '')
  const [budget, setBudget] = useState(searchParams.get('budget') || '')
  const [timeline, setTimeline] = useState<number[]>(
    searchParams.get('timeline')?.split(',').map(Number) || [1, 52]
  )
  const [complexity, setComplexity] = useState(searchParams.get('complexity') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '')

  // Function to update URL params
  const updateSearchParams = useCallback((updates: Record<string, string | string[] | number[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','))
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  // Update URL when query changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateSearchParams({ query })
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [query])

  // Update URL when timeline changes (with debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (timeline[0] !== 1 || timeline[1] !== 52) {
        updateSearchParams({ timeline })
      } else {
        updateSearchParams({ timeline: null })
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [timeline])

  const handleProjectTypeChange = (value: string) => {
    setPType(value)
    updateSearchParams({ projectType: value })
  }

  const handleAppTypeChange = (value: string) => {
    setAType(value)
    updateSearchParams({ appType: value })
  }

  const handleTeamSizeChange = (value: string) => {
    setTeamSize(value)
    updateSearchParams({ teamSize: value })
  }

  const handleBudgetChange = (value: string) => {
    setBudget(value)
    updateSearchParams({ budget: value })
  }

  const handleComplexityChange = (value: string) => {
    setComplexity(value)
    updateSearchParams({ complexity: value })
  }

  const handleSortByChange = (value: string) => {
    setSortBy(value)
    updateSearchParams({ sortBy: value })
  }

  const toggleTechStack = (tech: string) => {
    const newTechStack = techStack.includes(tech)
      ? techStack.filter(t => t !== tech)
      : [...techStack, tech]
    
    setTechStack(newTechStack)
    updateSearchParams({ tech: newTechStack })
  }

  const clearAllFilters = () => {
    setQuery('')
    setPType('')
    setAType('')
    setTechStack([])
    setTeamSize('')
    setBudget('')
    setTimeline([1, 52])
    setComplexity('')
    setSortBy('')
    router.push(pathname)
    
  }

  const activeFiltersCount = [
    query,
    pType,
    aType,
    techStack.length > 0,
    teamSize,
    budget,
    timeline[0] !== 1 || timeline[1] !== 52,
    complexity,
    sortBy
  ].filter(Boolean).length

  return (
    <div className='w-full flex flex-col gap-6 px-10 py-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h2 className='text-lg font-semibold'>Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllFilters}
          >
            <IconX className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left Column */}
        <div className='space-y-6'>
          {/* Search Input */}
          <div className='space-y-3'>
            <Label htmlFor='search-input'>Search Project</Label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type='search'
              id='search-input'
              placeholder='e.g: Ecommerce, Chat App, SaaS Platform'
            />
          </div>

          {/* Project Type & App Type */}
          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-3">
              <Label htmlFor='project-type'>Project Type</Label>
              <Select  value={pType} onValueChange={handleProjectTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any type" className='w-full'/>
                </SelectTrigger>
                <SelectContent className='w-full'>
                  <SelectGroup>
                    <SelectItem value="web">Web Application</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="desktop">Desktop App</SelectItem>
                    <SelectItem value="api">API/Backend</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
                    <SelectItem value="microservices">Microservices</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor='app-type'>Application Type</Label>
              <Select value={aType} onValueChange={handleAppTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="productivity">Productivity</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team Size & Budget */}
          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-3 ">
              <Label htmlFor='team-size'>Team Size</Label>
              <Select value={teamSize} onValueChange={handleTeamSizeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="solo">Solo (1)</SelectItem>
                    <SelectItem value="small">Small (2-5)</SelectItem>
                    <SelectItem value="medium">Medium (6-10)</SelectItem>
                    <SelectItem value="large">Large (11-20)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (20+)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor='budget'>Budget Range</Label>
              <Select value={budget} onValueChange={handleBudgetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="under-5k">Under $5k</SelectItem>
                    <SelectItem value="5k-10k">$5k - $10k</SelectItem>
                    <SelectItem value="10k-25k">$10k - $25k</SelectItem>
                    <SelectItem value="25k-50k">$25k - $50k</SelectItem>
                    <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                    <SelectItem value="100k-plus">$100k+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-3">
            <div className='flex items-center justify-between'>
              <Label>Timeline (weeks)</Label>
              <span className='text-sm text-muted-foreground'>
                {timeline[0]} - {timeline[1]} weeks
              </span>
            </div>
            <Slider
              min={1}
              max={52}
              step={1}
              value={timeline}
              onValueChange={setTimeline}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Tech Stack */}
          <div className="space-y-3">
            <Label>Tech Stack</Label>
            <div className="flex flex-wrap gap-2">
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('nextjs') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('nextjs')}
              >
                <IconBrandNextjs className="mr-2 h-4 w-4" />
                Next.js
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('react') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('react')}
              >
                <IconBrandReact className="mr-2 h-4 w-4" />
                React
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('tailwind') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('tailwind')}
              >
                <IconBrandTailwind className="mr-2 h-4 w-4" />
                Tailwind
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('nodejs') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('nodejs')}
              >
                <IconBrandNodejs className="mr-2 h-4 w-4" />
                Node.js
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('python') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('python')}
              >
                <IconBrandPython className="mr-2 h-4 w-4" />
                Python
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('docker') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('docker')}
              >
                <IconBrandDocker className="mr-2 h-4 w-4" />
                Docker
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('mongodb') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('mongodb')}
              >
                <IconBrandMongodb className="mr-2 h-4 w-4" />
                MongoDB
              </Button>
              <Button 
                type="button"
                size="sm"
                variant={techStack.includes('postgresql') ? 'default' : 'outline'}
                onClick={() => toggleTechStack('postgresql')}
              >
                <IconDatabase className="mr-2 h-4 w-4" />
                PostgreSQL
              </Button>
            </div>
          </div>

          <Separator />

          {/* Complexity & Sort */}
          <div className='grid grid-cols-2 gap-4'>
            <div className="space-y-3">
              <Label htmlFor='complexity'>Complexity</Label>
              <Select value={complexity} onValueChange={handleComplexityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor='sort-by'>Sort By</Label>
              <Select value={sortBy} onValueChange={handleSortByChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Most recent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
                    <SelectItem value="forks">Most Forked</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter