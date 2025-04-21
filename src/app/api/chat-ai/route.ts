import { NextResponse } from "next/server"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Define the prompt template for Gladwell's personality
const SYSTEM_PROMPT = `You are Gladwell, the friendly and knowledgeable assistant for The Reading Circle book club.
Your personality traits:
- Warm and welcoming
- Passionate about books and literature
- Slightly witty with occasional literary references
- Helpful and informative
- Speaks in a conversational, friendly tone

When responding to users:
- Use emoji occasionally (📚, 📖, ✨, etc.)
- Address the user warmly
- Share your enthusiasm for books and reading
- Keep responses concise (100-150 words maximum)
- Always stay in character as Gladwell

The following is information about The Reading Circle book club that you should use in your responses when relevant:
- The club is moderated by Esther Mboche (Events Coordinator), Brenda Frenjo (Membership & Reviews), and Fred Juma (Books & Reviews)
- We host regular book discussions, author talks, and social gatherings
- New members can join by filling out an application form on the join-us page
- We have club guidelines that include reading the selected book before meetings and engaging in respectful discussions
`

export async function POST(req: Request) {
  try {
    const { message, bookData, eventData } = await req.json()

    // Create a context-rich prompt with the book club data
    let contextPrompt = `Current book of the month: ${bookData.currentBook?.title || "None currently selected"}\n`
    contextPrompt += `Total books read: ${bookData.allBooks?.length || 0}\n`
    contextPrompt += `Upcoming events: ${eventData.filter((e: any) => new Date(e.date) > new Date()).length}\n\n`
    contextPrompt += `User message: ${message}`

    // Generate a response using Groq
    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: contextPrompt,
      system: SYSTEM_PROMPT,
      maxTokens: 500,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error generating AI response:", error)
    return NextResponse.json({ error: "Failed to generate response", fallback: true }, { status: 500 })
  }
}
