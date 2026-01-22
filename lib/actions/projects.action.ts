import { db } from "../db";
import { projects } from "../db/schema";

export async function getAllProjects() {
    try {
        const projectsData = await db
            .select()
            .from(projects)

        return projectsData

    } catch (error: any) {
        throw new Error(error)
        
    }
}