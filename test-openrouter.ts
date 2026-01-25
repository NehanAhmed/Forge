import { openrouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"

async function test(){
    const apiKey = process.env.OPENROUTER_API_KEY
    const response = await generateText({
    
        model: openrouter('tngtech/deepseek-r1t2-chimera:free'),
        prompt:"Say hi."
    })
    console.log(response.output);
    
}

test()