'use server'

import { db } from "../db";
import { projects } from "../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";


function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 255);
}

type CreateProjectInput = {
    title: string;
    description: string;
    problemStatement: string;
    targetUsers?: number;
    teamSize?: number;
    timelineWeeks?: number;
    budgetRange?: string;
    isPublic: boolean;
};

/**
 * Retrieves all public projects, ordered by creation date (newest first)
 */
export async function getAllProjects() {
    try {
        const projectsData = await db
            .select()
            .from(projects)
            .where(eq(projects.isPublic, true))
            .orderBy(desc(projects.createdAt));

        return projectsData;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching projects:", errorMessage);
        throw new Error(`Failed to fetch projects: ${errorMessage}`);
    }
}

/**
 * Retrieves projects for a specific user
 */
export async function getUserProjects(userId: string) {
    try {
        const userProjects = await db
            .select()
            .from(projects)
            .where(eq(projects.userId, userId))
            .orderBy(desc(projects.createdAt));

        return userProjects;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching user projects:", errorMessage);
        throw new Error(`Failed to fetch user projects: ${errorMessage}`);
    }
}

/**
 * Retrieves a single project by slug
 * Returns the project only if it's public OR owned by the requesting user
 */
export async function getProjectBySlug(slug: string, userId?: string | null) {
    try {
        const [project] = await db
            .select()
            .from(projects)
            .where(eq(projects.slug, slug))
            .limit(1);

        // Check visibility: must be public OR owned by the requesting user
        if (!project) {
            return null;
        }

        const isAccessible = project.isPublic || (userId && project.userId === userId);

        return isAccessible ? project : null;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error fetching project by slug:", errorMessage);
        throw new Error(`Failed to fetch project: ${errorMessage}`);
    }
}

/**
 * Creates a new project with direct database insertion
 */
export async function createProject({ data }: { data: CreateProjectInput }) {
    try {
        // Get authenticated user
        const session = await auth.api.getSession({
            headers: await headers()
        });



        const {
            title,
            description,
            problemStatement,
            targetUsers,
            teamSize,
            timelineWeeks,
            budgetRange,
            isPublic,
        } = data;

        // Generate a unique slug
        const baseSlug = generateSlug(title);
        let slug = baseSlug;
        let counter = 1;

        // Check if slug exists and make it unique
        while (true) {
            const [existing] = await db
                .select()
                .from(projects)
                .where(eq(projects.slug, slug))
                .limit(1);

            if (!existing) break;

            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const userId = session?.session ? session.session.userId : null

        // Create the project
        const [newProject] = await db
            .insert(projects)
            .values({
                title,
                description,
                problemStatement,
                targetUsers,
                teamSize,
                timelineWeeks,
                budgetRange,
                isPublic,
                slug,
                userId,
                viewCount: 0,
                forkCount: 0,
            })
            .returning();

        // Revalidate relevant paths
        revalidatePath("/projects");
        revalidatePath("/dashboard");

        return newProject;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error creating project:", errorMessage);
        throw new Error(errorMessage || "Failed to create project");
    }
}
/**
 * Updates an existing project
 * Only the project owner can update their project
 */
export async function updateProject(
    projectId: string,
    data: Partial<Omit<typeof projects.$inferInsert, 'id' | 'createdAt'>>
) {
    try {
        // Get authenticated user
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.session) {
            throw new Error("Unauthorized: You must be logged in to update a project");
        }

        const userId = session.session.userId;

        // Update the project only if the user is the owner
        const [updatedProject] = await db
            .update(projects)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(and(
                eq(projects.id, projectId),
                eq(projects.userId, userId)
            ))
            .returning();

        if (!updatedProject) {
            throw new Error("Forbidden: You can only update projects you own");
        }

        // Revalidate relevant paths
        revalidatePath("/projects");
        revalidatePath(`/projects/${updatedProject.slug}`);
        revalidatePath("/dashboard");

        return updatedProject;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error updating project:", errorMessage);
        throw new Error(`Failed to update project: ${errorMessage}`);
    }
}

/**
 * Deletes a project
 */
export async function deleteProject(projectId: string) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.session) {
            throw new Error("Unauthorized");
        }
        const deleted = await db
            .delete(projects)
            .where(and(eq(projects.id, projectId), eq(projects.userId, session.session.userId)))
            .returning({ id: projects.id });
        if (!deleted.length) {
            throw new Error("Project not found or unauthorized");
        }
        return true;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error deleting project:", errorMessage);
        throw new Error(`Failed to delete project: ${errorMessage}`);
    }
}

/**
 * Increments the view count for a project
 */
export async function incrementViewCount(projectId: string) {
    try {

        const [updated] = await db
            .update(projects)
            .set({
                viewCount: sql`${projects.viewCount} + 1`,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, projectId))
            .returning();
        if (!updated) {
            throw new Error("Project not found");
        }
        return updated;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error incrementing view count:", errorMessage);
        throw new Error(`Failed to increment view count: ${errorMessage}`);
    }
}