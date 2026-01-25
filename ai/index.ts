import { openrouter } from "@/lib/openrouter";
import { AIProjectPlanResponse, AIRequest, parseAIResponse, ParsedProjectPlan } from "./interface";
import { generateText } from 'ai'
import { SYSTEM_PROMPT } from "./ai-prompt";

const generateAiResponse = async (aiInputData: AIRequest): Promise<AIProjectPlanResponse> => {
    try {
        // Validate environment variables
        const modelName = process.env.OPENROUTER_AI_MODEL;
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        if (!modelName) {
            throw new Error('OPENROUTER_AI_MODEL environment variable is not set');
        }
        
        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY environment variable is not set');
        }

        
        const response = await generateText({
            model: openrouter.completion(modelName),
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
        const parsedResult: ParsedProjectPlan = parseAIResponse(response.text);
        if (!parsedResult.success) {
            console.error('❌ Parse failed:', parsedResult.error);
            console.error('📄 First 500 chars:', response.text.substring(0, 500));
            throw new Error(`Failed to parse AI response: ${parsedResult.error}`);
        }

        return parsedResult.data;

    } catch (error) {
        // Enhanced error logging
        console.error('🔥 Error in generateAiResponse:', error);
        
        if (error instanceof Error) {
            // Check for specific OpenRouter errors
            if (error.message.includes('User not found')) {
                throw new Error('OpenRouter authentication failed. Please check your API key.');
            }
            if (error.message.includes('rate limit')) {
                throw new Error('API rate limit exceeded. Please try again later.');
            }
            if (error.message.includes('insufficient credits')) {
                throw new Error('Insufficient OpenRouter credits. Please add credits to your account.');
            }
            throw new Error(`AI Response Generation Failed: ${error.message}`);
        }
        
        throw new Error('AI Response Generation Failed: Unknown error occurred');
    }
}

export async function planGenerator(data: AIRequest): Promise<AIProjectPlanResponse> {
    try {
        
        const { title, description, problemStatement } = data;

        // Validate required fields
        if (!title || !description || !problemStatement) {
            throw new Error("Title, description, and problem statement are required fields!");
        }

        // Generate and return the plan
        const plan = await generateAiResponse(data);
        
        
        return plan;

    } catch (error: unknown) {
        console.error('🔥 Error in planGenerator:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        throw new Error(`Plan Generation Failed: ${errorMessage}`);
    }
}