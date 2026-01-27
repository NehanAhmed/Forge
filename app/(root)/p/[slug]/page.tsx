import * as React from "react"
import { notFound } from "next/navigation"
import { headers } from "next/headers"

import { auth } from "@/auth"
import { ProjectActions } from "@/components/project/project-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getProjectBySlug,
  incrementViewCount,
} from "@/lib/actions/projects.action"

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Auth is optional for viewing; used only to allow owners to access private projects.
  let userId: string | null = null
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    userId = session?.session?.userId ?? null
  } catch {
    userId = null
  }

  const project = await getProjectBySlug(slug, userId)
  if (!project) notFound()

  // Fire-and-forget (best effort): keep server render fast
  void incrementViewCount(project.id)

  const tech = project.techStack ?? null
  const schema = project.databaseSchema ?? null
  const risks = project.risks ?? null
  const roadmap = project.roadmap ?? null
  const keyFeatures = project.keyFeatures ?? null
  const isGuest = project.userId == null

  const fmtDateTime = (d: Date) =>
    new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)

  return (
    <main className="w-full px-6 pt-20 font-hanken-grotesk md:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {project.title}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="shrink-0">
              <ProjectActions project={project} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isGuest && (
              <Badge variant="secondary">
                Guest{project.expiresAt ? ` · expires ${fmtDateTime(project.expiresAt)}` : ""}
              </Badge>
            )}
            <Badge variant="outline" className="text-muted-foreground">
              /p/{project.slug}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {project.isPublic ? "public" : "private"}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {project.viewCount ?? 0} views
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {project.forkCount ?? 0} forks
            </Badge>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="text-sm font-medium">Problem</div>
              <div className="text-muted-foreground text-xs">
                Why this exists.
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {project.problemStatement}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="text-sm font-medium">Quick facts</div>
              <div className="text-muted-foreground text-xs">
                Constraints and scope.
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {project.timelineWeeks != null && (
                <Badge variant="secondary">{project.timelineWeeks} weeks</Badge>
              )}
              {project.teamSize != null && (
                <Badge variant="secondary">{project.teamSize} people</Badge>
              )}
              {project.targetUsers != null && (
                <Badge variant="secondary">{project.targetUsers} users</Badge>
              )}
              {project.budgetRange && (
                <Badge variant="secondary">{project.budgetRange}</Badge>
              )}
              {project.createdAt && (
                <Badge variant="outline" className="text-muted-foreground">
                  created {fmtDateTime(project.createdAt)}
                </Badge>
              )}
              {project.updatedAt && (
                <Badge variant="outline" className="text-muted-foreground">
                  updated {fmtDateTime(project.updatedAt)}
                </Badge>
              )}
              {!project.timelineWeeks &&
                !project.teamSize &&
                !project.targetUsers &&
                !project.budgetRange && (
                  <span className="text-muted-foreground text-sm">
                    No extra details provided.
                  </span>
                )}
            </CardContent>
          </Card>
        </div>

        {tech && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader className="pb-2">
                <div className="text-sm font-medium">Tech stack</div>
                <div className="text-muted-foreground text-xs">
                  What the plan recommends.
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {(tech.frontend ?? []).map((t) => (
                    <Badge key={`fe-${t}`} variant="outline">
                      {t}
                    </Badge>
                  ))}
                  {(tech.backend ?? []).map((t) => (
                    <Badge key={`be-${t}`} variant="outline">
                      {t}
                    </Badge>
                  ))}
                  {(tech.database ?? []).map((t) => (
                    <Badge key={`db-${t}`} variant="outline">
                      {t}
                    </Badge>
                  ))}
                  {(tech.devops ?? []).map((t) => (
                    <Badge key={`do-${t}`} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tech.rationale}
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {schema && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader className="pb-2">
                <div className="text-sm font-medium">Database schema</div>
                <div className="text-muted-foreground text-xs">
                  Tables, columns, and relationships.
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="text-xs font-medium">Tables</div>
                  <div className="space-y-3">
                    {(schema.tables ?? []).map((t) => (
                      <div key={t.name} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{t.name}</Badge>
                          <span className="text-muted-foreground text-xs">
                            {(t.columns ?? []).length} cols
                          </span>
                        </div>
                        <div className="text-muted-foreground text-xs font-mono leading-relaxed">
                          {(t.columns ?? []).slice(0, 8).map((c) => (
                            <div key={`${t.name}.${c.name}`}>
                              {c.name}: {c.type}
                              {c.nullable ? "" : " (not null)"}
                            </div>
                          ))}
                          {(t.columns ?? []).length > 8 && (
                            <div>…</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {(schema.tables ?? []).length === 0 && (
                      <div className="text-muted-foreground text-sm">
                        No schema tables provided.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-medium">Relationships</div>
                  <div className="space-y-2">
                    {(schema.relationships ?? []).map((r, idx) => (
                      <div key={`${r.from}-${r.to}-${idx}`} className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{r.from}</Badge>
                        <span className="text-muted-foreground text-xs">→</span>
                        <Badge variant="outline">{r.to}</Badge>
                        <Badge variant="secondary">{r.type}</Badge>
                      </div>
                    ))}
                    {(schema.relationships ?? []).length === 0 && (
                      <div className="text-muted-foreground text-sm">
                        No relationships provided.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {Array.isArray(keyFeatures) && keyFeatures.length > 0 && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader className="pb-2">
                <div className="text-sm font-medium">Key features</div>
                <div className="text-muted-foreground text-xs">
                  Prioritized, estimated.
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {keyFeatures.map((f, idx) => (
                  <div key={`${f.feature}-${idx}`} className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{f.feature}</span>
                      <Badge
                        variant={f.priority === "P0" ? "destructive" : f.priority === "P1" ? "secondary" : "outline"}
                      >
                        {f.priority}
                      </Badge>
                      <Badge variant="outline" className="text-muted-foreground">
                        {f.complexity}
                      </Badge>
                      <Badge variant="outline" className="text-muted-foreground">
                        {f.estimatedDays}d
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {Array.isArray(risks) && risks.length > 0 && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader className="pb-2">
                <div className="text-sm font-medium">Risks</div>
                <div className="text-muted-foreground text-xs">
                  What can go wrong and how to mitigate it.
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {risks.map((r, idx) => (
                  <div key={`${r.title}-${idx}`} className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{r.title}</span>
                      <Badge
                        variant={
                          r.severity === "Critical" || r.severity === "High"
                            ? "destructive"
                            : r.severity === "Medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {r.severity}
                      </Badge>
                      <Badge variant="outline" className="text-muted-foreground">
                        {r.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {r.description}
                    </p>
                    <p className="text-sm leading-relaxed">{r.mitigation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {roadmap && Array.isArray(roadmap.phases) && roadmap.phases.length > 0 && (
          <>
            <Separator className="my-6" />
            <Card>
              <CardHeader className="pb-2">
                <div className="text-sm font-medium">Roadmap</div>
                <div className="text-muted-foreground text-xs">
                  Phased plan with tasks and deliverables.
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-muted-foreground">
                    adjusted: {roadmap.adjustedTimelineWeeks} weeks
                  </Badge>
                </div>
                {roadmap.phases.map((p, idx) => (
                  <div key={`${p.name}-${idx}`} className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{p.name}</span>
                      <Badge variant="secondary">{p.duration}</Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-xs">Tasks</div>
                        <ul className="text-sm leading-relaxed list-disc pl-4">
                          {(p.tasks ?? []).slice(0, 6).map((t, i) => (
                            <li key={`${idx}-t-${i}`}>{t}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-xs">Deliverables</div>
                        <ul className="text-sm leading-relaxed list-disc pl-4">
                          {(p.deliverables ?? []).slice(0, 6).map((d, i) => (
                            <li key={`${idx}-d-${i}`}>{d}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-xs">Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {(p.skillsRequired ?? []).slice(0, 10).map((s) => (
                            <Badge key={`${idx}-s-${s}`} variant="outline">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}


