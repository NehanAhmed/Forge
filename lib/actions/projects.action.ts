'use server'

import { db } from "../db";
import { projects } from "../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { planGenerator } from "@/ai";


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

async function generateUniqueSlug(baseTitle: string): Promise<string> {
    const baseSlug = generateSlug(baseTitle);
    let slug = baseSlug;
    let counter = 1;

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

    return slug;
}
/**
 * Creates a new project with direct database insertion
 */
export async function createProject({ data }: { data: CreateProjectInput }) {
    const MAX_RETRIES = 3;
    let lastError: Error | null = null;

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

        const userId = session?.session ? session.session.userId : null;

        console.log('🎯 Generating AI plan...');

        // Generate AI plan
        const response = await planGenerator({
            title,
            description,
            problemStatement,
            targetUsers,
            teamSize,
            timelineWeeks,
            budgetRange,
        });

        if (!response) {
            throw new Error("Failed to generate AI plan - no response received");
        }

        console.log('💾 Saving project to database...');

        // Retry logic for slug uniqueness
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                // Re-check and generate unique slug right before insertion
                const slug = await generateUniqueSlug(title);

                // Create the project with AI-generated data
                const [newProject] = await db
                    .insert(projects)
                    .values({
                        title,
                        description,
                        problemStatement,
                        targetUsers,
                        teamSize,
                        timelineWeeks: response.roadmap.adjustedTimelineWeeks,
                        budgetRange,
                        isPublic,
                        slug,
                        userId,
                        viewCount: 0,
                        forkCount: 0,
                        // AI-generated fields
                        databaseSchema: response.databaseSchema,
                        keyFeatures: response.keyFeatures,
                        risks: response.risks,
                        roadmap: response.roadmap,
                        techStack: response.techStack,
                    })
                    .returning();

                console.log('✅ Project created successfully:', newProject.id);

                return {
                    success: true,
                    project: newProject,
                    metadata: {
                        confidenceScore: response.metadata.confidenceScore,
                        adjustmentsMade: response.metadata.adjustmentsMade,
                    }
                };

            } catch (insertError: unknown) {
                const errorMessage = insertError instanceof Error ? insertError.message : String(insertError);

                // Check if it's a unique constraint violation on slug
                const isSlugConflict = errorMessage.toLowerCase().includes('unique') &&
                    errorMessage.toLowerCase().includes('slug');

                if (isSlugConflict && attempt < MAX_RETRIES - 1) {
                    console.log(`⚠️ Slug conflict detected, retrying... (attempt ${attempt + 1}/${MAX_RETRIES})`);
                    lastError = insertError instanceof Error ? insertError : new Error(errorMessage);
                    // Add small delay before retry to reduce race condition likelihood
                    await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
                    continue;
                }

                // If it's not a slug conflict or we've exhausted retries, throw
                throw insertError;
            }
        }

        // If we exhausted all retries
        throw lastError || new Error("Failed to create project after multiple attempts");

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("❌ Error creating project:", errorMessage);

        // Provide more specific error messages
        if (errorMessage.includes('parse')) {
            throw new Error("Failed to process AI response. Please try again.");
        } else if (errorMessage.includes('required')) {
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to create project. Please try again later.");
        }
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