"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconDots,
  IconExternalLink,
  IconGitFork,
  IconLink,
} from "@tabler/icons-react"

import type { Project } from "@/lib/db/schema"
import { forkProject } from "@/lib/actions/projects.action"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ProjectActions({ project }: { project: Project }) {
  const router = useRouter()
  const [isForking, startFork] = React.useTransition()

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/p/${project.slug}`)
      toast.success("Link copied")
    } catch {
      toast.error("Could not copy link")
    }
  }

  const onFork = () => {
    startFork(async () => {
      const t = toast.loading("Forking…")
      try {
        const forked = await forkProject(project.id)
        toast.success("Fork created", { id: t })
        router.push(`/p/${forked.slug}`)
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to fork"
        toast.error(msg, { id: t })
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={onFork}
        disabled={isForking}
        className="gap-1.5"
      >
        <IconGitFork />
        Fork
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More actions">
            <IconDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyLink}>
            <IconLink />
            Copy link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.open(`/p/${project.slug}`, "_blank")}
          >
            <IconExternalLink />
            Open in new tab
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}


