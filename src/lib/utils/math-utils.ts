// Pure utility functions (no "use server" directive) just Fred magic

// Calculate cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same length")
    }
  
    let dotProduct = 0
    let normA = 0
    let normB = 0
  
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }
  
    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)
  
    if (normA === 0 || normB === 0) {
      return 0
    }
  
    return dotProduct / (normA * normB)
  }
  
  // Simple embedding function using dot product of term frequencies
  export function generateSimpleEmbedding(text: string): number[] {
    // Create a simple term frequency vector (very simplified version of embeddings)
    const terms = text
      .toLowerCase()
      .split(/\W+/)
      .filter((term) => term.length > 2)
    const uniqueTerms = [...new Set(terms)]
  
    // Create a fixed-size vector (using hash function to map terms to indices)
    const vectorSize = 100
    const vector = new Array(vectorSize).fill(0)
  
    for (const term of terms) {
      // Simple hash function to map term to vector index
      const index = Math.abs(term.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % vectorSize)
      vector[index] += 1
    }
  
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return magnitude === 0 ? vector : vector.map((val) => val / magnitude)
  }
  