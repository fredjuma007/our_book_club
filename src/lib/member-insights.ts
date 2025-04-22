/**
 * ALX Reading Circle Member Insights
 *
 * This file provides additional analysis and insights about reading patterns,
 * preferences, and group dynamics based on member data.
 */

import { memberProfiles } from "./member-profiles"



/**
 * Generate insights about reading circle members that Gladwell can use
 * to provide more personalized and contextually relevant responses
 */
export function generateMemberInsights() {
  // Analyze book preferences across members
  const genrePreferences = new Map<string, number>()

  memberProfiles.forEach((member) => {
    member.bookPreferences?.forEach((genre) => {
      const currentCount = genrePreferences.get(genre) || 0
      genrePreferences.set(genre, currentCount + 1)
    })
  })

  // Sort genres by popularity
  const popularGenres = Array.from(genrePreferences.entries())
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0])

  // Identify moderators
  const moderators = memberProfiles.filter((member) => member.role === "moderator").map((member) => member.name)

  // Identify active contributors
  const activeContributors = memberProfiles
    .filter((member) => member.notableContributions && member.notableContributions.length > 0)
    .map((member) => member.name)

  // Identify members with specific interests
  const interestGroups = new Map<string, string[]>()

  memberProfiles.forEach((member) => {
    member.personalInterests?.forEach((interest) => {
      if (!interestGroups.has(interest)) {
        interestGroups.set(interest, [])
      }
      interestGroups.get(interest)?.push(member.name)
    })
  })

  return {
    popularGenres,
    moderators,
    activeContributors,
    interestGroups: Object.fromEntries(interestGroups),
    memberCount: memberProfiles.length,

    // Function to suggest book recommendations based on group preferences
    suggestGroupReads: (): string[] => {
      // This would contain logic to suggest books that align with the group's preferences
      // For now, returning placeholder suggestions based on popular genres
      if (popularGenres.includes("fiction") || popularGenres.includes("African literature")) {
        return ["Things Fall Apart by Chinua Achebe", "Americanah by Chimamanda Ngozi Adichie"]
      } else if (popularGenres.includes("non-fiction") || popularGenres.includes("self-help")) {
        return ["Atomic Habits by James Clear", "Thinking, Fast and Slow by Daniel Kahneman"]
      } else {
        return ["The Alchemist by Paulo Coelho", "Born a Crime by Trevor Noah"]
      }
    },

    // Function to suggest discussion topics based on member interests
    suggestDiscussionTopics: (): string[] => {
      const topics: string[] = []

      if (interestGroups.has("history")) {
        topics.push("How historical context shapes literature")
      }

      if (interestGroups.has("psychology") || interestGroups.has("personal development")) {
        topics.push("Character development and psychological growth in narratives")
      }

      if (interestGroups.has("technology") || interestGroups.has("innovation")) {
        topics.push("The impact of technology on modern storytelling")
      }

      if (topics.length === 0) {
        topics.push("Comparing writing styles across different authors")
        topics.push("The role of setting in creating atmosphere")
      }

      return topics
    },
  }
}
