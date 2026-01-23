'use server'

import { db } from "../db";
import { projects } from "../db/schema";
import { eq, desc } from "drizzle-orm";
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
    } catch (error: any) {
        console.error("Error fetching projects:", error);
        throw new Error(`Failed to fetch projects: ${error.message}`);
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
    } catch (error: any) {
        console.error("Error fetching user projects:", error);
        throw new Error(`Failed to fetch user projects: ${error.message}`);
    }
}

/**
 * Retrieves a single project by slug
 */
export async function getProjectBySlug(slug: string) {
    try {
        const [project] = await db
            .select()
            .from(projects)
            .where(eq(projects.slug, slug))
            .limit(1);

        return project || null;
    } catch (error: any) {
        console.error("Error fetching project by slug:", error);
        throw new Error(`Failed to fetch project: ${error.message}`);
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
    } catch (error: any) {
        console.error("Error creating project:", error);
        throw new Error(error.message || "Failed to create project");
    }
}
/**
 * Updates an existing project
 */
export async function updateProject(
    projectId: string,
    data: Partial<Omit<typeof projects.$inferInsert, 'id' | 'createdAt'>>
) {
    try {
        const [updatedProject] = await db
            .update(projects)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, projectId))
            .returning();

        return updatedProject;
    } catch (error: any) {
        console.error("Error updating project:", error);
        throw new Error(`Failed to update project: ${error.message}`);
    }
}

/**
 * Deletes a project
 */
export async function deleteProject(projectId: string) {
    try {
        await db
            .delete(projects)
            .where(eq(projects.id, projectId));

        return true;
    } catch (error: any) {
        console.error("Error deleting project:", error);
        throw new Error(`Failed to delete project: ${error.message}`);
    }
}

/**
 * Increments the view count for a project
 */
export async function incrementViewCount(projectId: string) {
    try {
        const [project] = await db
            .select()
            .from(projects)
            .where(eq(projects.id, projectId))
            .limit(1);

        if (!project) {
            throw new Error("Project not found");
        }

        const [updated] = await db
            .update(projects)
            .set({
                viewCount: (project.viewCount || 0) + 1,
                updatedAt: new Date(),
            })
            .where(eq(projects.id, projectId))
            .returning();

        return updated;
    } catch (error: any) {
        console.error("Error incrementing view count:", error);
        throw new Error(`Failed to increment view count: ${error.message}`);
    }
}