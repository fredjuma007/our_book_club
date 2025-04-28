"use server"

import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface EventData {
    title: string
    date: string
    type: string
    location: string
    isOnline?: boolean
    moderators: string[]
}

interface EventSummaryResult {
    summary: string
    insights: string[]
    recommendations: string[]
}

export async function generateAIEventSummary(events: EventData[]): Promise<EventSummaryResult> {
    const prompt = `
        Based on the following past events of our book club, generate a detailed summary, 3 key insights.
        The Book Club name is "The Reading Circle".
        refer in the summary as Our Book Club so that it is more personalized.

        Events:
        ${events.map((event, index) => `${index + 1}. ${event.title} on ${event.date} (${event.type}) at ${event.location} ${event.isOnline ? "(Online)" : "(In-person)"}, Moderators: ${event.moderators.join(", ")}`).join("\n")}

        Please respond strictly in this JSON format:
        {
            "summary": "A short paragraph summarizing the events",
            "insights": ["Insight 1", "Insight 2", "Insight 3"],
        }

        Only return the JSON object, nothing else.
    `

    const { text } = await generateText({
        model: groq("llama-3.1-8b-instant"),
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 1000,
    })

    const jsonMatch = text.match(/{[\s\S]*}/)
    if (jsonMatch) {
        const jsonText = jsonMatch[0]
        return JSON.parse(jsonText)
    } else {
        throw new Error("Failed to extract JSON from AI response")
    }
}
