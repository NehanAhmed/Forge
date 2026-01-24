import { openrouter } from "@/lib/openrouter";
import { AIProjectPlanResponse, AIRequest, parseAIResponse, ParsedProjectPlan } from "./interface";
import { generateText } from 'ai'
import { SYSTEM_PROMPT } from "./ai-prompt";

const generateAiResponse = async (aiInputData: AIRequest): Promise<AIProjectPlanResponse> => {
    try {
        const response = await generateText({
            model: openrouter.completion(process.env.OPENROUTER_AI_MODEL as string),
            system: SYSTEM_PROMPT,
            prompt: `Please analyze this project and generate a comprehensive pre-production plan:

Title: ${aiInputData.title}
Description: ${aiInputData.description}
Problem Statement: ${aiInputData.problemStatement}
Target Users: ${aiInputData.targetUsers ?? 'Not specified'}
Team Size: ${aiInputData.teamSize ?? 'Not specified'}
Timeline: ${aiInputData.timelineWeeks ?? 'Not specified'} weeks
Budget Range: ${aiInputData.budgetRange ?? 'Not specified'}

Generate the complete JSON plan now.`
        });

        // Safe parsing with validation
        const parsedResult: ParsedProjectPlan = parseAIResponse(response.output);
        if (!parsedResult.success) {
            throw new Error(`Failed to parse AI response: ${parsedResult.error}`);
        }

        return parsedResult.data;
    } catch (error) {
        // Re-throw with more context
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new Error(`AI Response Generation Failed: ${errorMessage}`);
    }
}

export async function planGenerator({ data }: { data: AIRequest }): Promise<AIProjectPlanResponse> {
    try {
        const { budgetRange, description, problemStatement, targetUsers, teamSize, timelineWeeks, title } = data;

        // Validate required fields
        if (!title || !description || !problemStatement) {
            throw new Error("Title, description, and problem statement are required fields!");
        }

        // Generate and return the plan
        const plan = await generateAiResponse(data);
        return plan;

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        throw new Error(`Plan Generation Failed: ${errorMessage}`);
    }
}