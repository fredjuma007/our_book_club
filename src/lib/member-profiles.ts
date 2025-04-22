/**
 * ALX Reading Circle Member Profiles
 *
 * This file contains structured information about reading circle members
 * extracted from WhatsApp chat history to enhance the Gladwell AI assistant.
 */

export interface MemberProfile {
    name: string
    alternateNames?: string[]
    phoneNumber?: string
    role?: "moderator" | "member" | "admin"
    bookPreferences?: string[]
    favoriteAuthors?: string[]
    notableContributions?: string[]
    participationStyle?: string
    joinedDate?: string
    personalInterests?: string[]
    notableQuotes?: string[]
  }
  
  export const memberProfiles: MemberProfile[] = [
    {
      name: "Esther Mboche",
      alternateNames: ["Mboche Esther"],
      role: "moderator",
      bookPreferences: ["non-fiction", "fiction", "poetry"],
      notableContributions: ["Organizes monthly book selections", "Leads discussion sessions"],
      participationStyle: "Active facilitator who ensures discussions stay on track",
      notableQuotes: ["Let's hear from those who haven't shared yet"],
    },
    {
      name: "Brenda Frenjo",
      role: "moderator",
      bookPreferences: ["fiction", "mystery"],
      notableContributions: ["Coordinates virtual meetups", "Manages the club website"],
      participationStyle: "Thoughtful contributor who asks insightful questions",
    },
    {
      name: "Fred Juma",
      role: "moderator",
      bookPreferences: ["historical non-fiction", "biographies"],
      notableContributions: ["Regularly shares book summaries", "Contributes to book selection process"],
      participationStyle: "Analytical reader who focuses on historical context",
      personalInterests: ["history", "technology", "video games"],
    },
    {
      name: "WANJAH",
      alternateNames: ["Emily Wanja"],
      bookPreferences: ["contemporary fiction", "memoirs"],
      participationStyle: "Enthusiastic participant who relates books to personal experiences",
      personalInterests: ["writing", "storytelling"],
    },
    {
      name: "Emma Mwangi",
      bookPreferences: ["business books", "psychology"],
      notableContributions: ["Shares business insights from readings"],
      participationStyle: "Practical reader who looks for applicable lessons",
      personalInterests: ["entrepreneurship", "personal development"],
    },
    {
      name: "Vaal",
      alternateNames: ["Valeria", "Val"],
      bookPreferences: ["thriller", "fiction"],
      participationStyle: "Poetic analyzer who appreciates literary techniques big fan of Freida McFadden",
      personalInterests: ["creative writing", "arts"],
    },
    {
      name: "Brian Obiero",
      bookPreferences: ["science fiction", "technology books"],
      notableContributions: ["Provides technical perspective on readings", "Maintains a flower plantation"],
      participationStyle: "Analytical thinker who examines futuristic concepts",
      personalInterests: ["technology", "innovation", "gardening"],
      notableQuotes: ["I'd be happy to bring roses for the ladies at our next meeting"],
    },
    {
      name: "Christine Sparkle",
      bookPreferences: ["inspirational", "spiritual growth"],
      participationStyle: "Reflective reader who connects books to spiritual insights",
      personalInterests: ["mindfulness", "personal growth"],
    },
    {
      name: "Fibonacci",
      bookPreferences: ["mathematics", "science", "logic puzzles"],
      notableContributions: ["Brings mathematical perspective to discussions"],
      participationStyle: "Logical thinker who appreciates structure and patterns",
      personalInterests: ["mathematics", "puzzles"],
    },
    {
      name: "Stacey Nduta",
      bookPreferences: ["romance novels", "contemporary fiction"],
      participationStyle: "Emotional reader who connects with characters deeply",
      personalInterests: ["relationshiujps", "human connections"],
    },
    {
      name: "Sumaiya Juma",
      bookPreferences: ["cultural studies", "international literature"],
      participationStyle: "Global thinker who appreciates diverse perspectives",
      personalInterests: ["travel", "cultural exchange"],
    },
    {
      name: "Dennis",
      alternateNames: ["Ha unijui"],
      bookPreferences: ["humor", "satire"],
      participationStyle: "Witty contributor who finds humor in readings",
      notableQuotes: ["Books are just trees with opinions"],
    },
    {
      name: "Shannia",
      notableContributions: ["Provides Tanzanian perspective on readings"],
      participationStyle: "International member who shares cross-cultural insights",
      personalInterests: ["cultural studies", "East African literature"],
    },
    {
      name: "Victor Mburu",
      bookPreferences: ["political thrillers", "current affairs"],
      participationStyle: "Current events connector who relates books to news",
      personalInterests: ["politics", "current events"],
    },
    {
      name: "Emmanuel Njeru",
      bookPreferences: ["philosophy", "classics"],
      notableContributions: ["Shares philosophical insights from readings"],
      participationStyle: "Deep thinker who examines underlying themes",
      personalInterests: ["philosophy", "ethics"],
    },
    {
      name: "George Gichogu",
      bookPreferences: ["historical fiction", "war stories"],
      participationStyle: "Historical context provider who appreciates accuracy",
      personalInterests: ["history", "military strategy"],
    },
    {
      name: "Joyce Kariuki",
      bookPreferences: ["self-improvement", "psychology"],
      participationStyle: "Practical implementer who applies book lessons to life",
      personalInterests: ["psychology", "behavior change"],
    },
    {
      name: "Tracy Nyambura",
      joinedDate: "recent",
      bookPreferences: ["young adult", "coming-of-age stories"],
      participationStyle: "Fresh perspective provider who asks clarifying questions",
      personalInterests: ["youth development", "education"],
    },
    {
      name: "Alex Mutisya",
      bookPreferences: ["science", "technology"],
      notableContributions: ["Shares scientific perspective on readings"],
      participationStyle: "Fact-checker who values accuracy and evidence",
      personalInterests: ["scientific research", "technology trends"],
    },
  ]
  