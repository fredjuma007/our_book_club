export interface BookTag {
    mood?: string[]
    themes?: string[]
    discussion_topics?: string[]
  }
  
  export interface Book {
    _id: string
    title: string
    author: string
    summary?: string
    genre?: string
    recommender?: string
    image?: any
    publishDate?: string
    _createdDate?: string
    tags?: BookTag
  }
  
  export interface BookWithMatch extends Book {
    matchScore: number
    matchReason?: string
  }
  
  export interface BookEmbedding {
    _id: string
    embedding: number[]
  }
  