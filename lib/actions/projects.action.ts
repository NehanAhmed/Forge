'use server'

import { db } from "../db";
import { projects } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";


/**
 * Produce a URL-friendly slug from a title.
 *
 * Converts the input to lowercase, replaces sequences of non-alphanumeric characters with single dashes, trims leading and trailing dashes, and truncates the result to 255 characters.
 *
 * @returns The normalized, URL-safe slug for the provided `title`, truncated to 255 characters.
 */
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
 * Retrieves all public projects ordered by creation date descending.
 *
 * @returns An array of public project records, ordered newest first.
 * @throws When fetching projects fails.
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
 * Fetches projects belonging to a given user, ordered by creation date descending.
 *
 * @param userId - The ID of the user whose projects to retrieve
 * @returns An array of projects for the given user, ordered with newest projects first
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
 * Fetches the project that matches the given slug.
 *
 * @param slug - The URL-friendly identifier for the project
 * @returns The matching project object if found, `null` otherwise
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
 * Create a new project record in the database and return the inserted project.
 *
 * Generates a URL-friendly unique slug from the title (appending a numeric suffix if needed), assigns the current authenticated user as the owner when available, initializes `viewCount` and `forkCount` to 0, inserts the record, and triggers revalidation for "/projects" and "/dashboard".
 *
 * @param data - The input data for the new project
 * @returns The newly created project record
 * @throws Error if the project cannot be created
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
 * Apply partial updates to a project identified by its ID.
 *
 * @param projectId - The ID of the project to update
 * @param data - Partial set of project fields to update; `id` and `createdAt` are excluded
 * @returns The updated project record, or `undefined` if no project matched the provided ID
 * @throws Error if the update operation fails
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
 * Delete a project by its ID.
 *
 * @param projectId - The ID of the project to delete
 * @returns `true` if the project was deleted successfully
 * @throws Error when deletion fails
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
 * Increment a project's view count by one.
 *
 * @param projectId - The ID of the project whose view count will be incremented
 * @returns The updated project record as returned by the database
 * @throws If no project with the given `projectId` is found
 * @throws If the database operation fails
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