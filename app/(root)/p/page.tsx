import * as React from "react"

import ProjectCard from "@/components/project-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getAllProjects } from "@/lib/actions/projects.action"

export default async function ProjectsPage() {
  const projects = await getAllProjects()
  const guestCount = projects.filter((p) => p.userId == null).length

  return (
    <main className="w-full px-6 pt-20 font-hanken-grotesk md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Projects
              </h1>
              <p className="text-muted-foreground text-sm">
                Minimal blueprints you can read, fork, and ship.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-muted-foreground">
                {projects.length} total
              </Badge>
              {guestCount > 0 && (
                <Badge variant="secondary">{guestCount} guest</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <Separator className="my-6" />

        {guestCount > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="text-sm font-medium">Guest projects</div>
              <div className="text-muted-foreground text-xs">
                Created without an account. We automatically delete these after ~24h.
              </div>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-relaxed">
              Tip: Fork a guest project to save your own copy (fork requires login).
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} data={project} />
          ))}
        </div>
      </div>
    </main>
  )
}


