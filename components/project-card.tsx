import React from "react"
import Link from "next/link"

import { Project } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import {
  IconArrowRight,
  IconEye,
  IconGitFork,
} from "@tabler/icons-react"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

const ProjectCard = ({ data }: { data: Project }) => {
  const tech = data.techStack?.frontend ?? []
  const maxTech = 4
  const visibleTech = tech.slice(0, maxTech)
  const remainingTech = Math.max(0, tech.length - visibleTech.length)
  const isGuest = data.userId == null

  return (
    <Card
      size="sm"
      className={cn(
        "w-full font-hanken-grotesk transition",
        "hover:ring-foreground/15 hover:bg-muted/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight md:text-lg truncate">
              {data.title}
            </h2>
            <p className="text-muted-foreground text-xs/relaxed line-clamp-2">
              {data.description}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {isGuest && (
              <Badge variant="secondary" className="text-xs">
                Guest
              </Badge>
            )}
            <Badge variant="outline" className="text-muted-foreground">
              <IconEye />
              {data.viewCount}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              <IconGitFork />
              {data.forkCount}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {visibleTech.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTech.map((val) => (
              <Badge key={val} variant="secondary" className="text-xs">
                {val}
              </Badge>
            ))}
            {remainingTech > 0 && (
              <Badge variant="outline" className="text-muted-foreground">
                +{remainingTech}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="justify-end gap-2">
        <Button asChild variant="link" className="px-0">
          <Link href={`/p/${data.slug}`}>
            View project <IconArrowRight />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProjectCard