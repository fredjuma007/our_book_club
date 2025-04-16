/**
 * Custom fetch utility with timeout and abort controller support
 */
export async function fetchWithTimeout(
    resource: RequestInfo,
    options: RequestInit & { timeout?: number } = {},
  ): Promise<Response> {
    const { timeout = 8000, ...fetchOptions } = options
  
    // Create an abort controller for this request
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
  
    try {
      // Add the signal to the fetch options
      const response = await fetch(resource, {
        ...fetchOptions,
        signal: controller.signal,
      })
  
      return response
    } catch (error) {
      // Rethrow AbortError with a more descriptive message
      if (error instanceof Error && error.name === "AbortError") {
        console.warn(`Request to ${resource} timed out after ${timeout}ms`)
        throw new Error(`Request timed out after ${timeout}ms`)
      }
      throw error
    } finally {
      clearTimeout(id)
    }
  }
  
  /**
   * Fetch with retry logic and timeout
   */
  export async function fetchWithRetry(
    resource: RequestInfo,
    options: RequestInit & {
      timeout?: number
      retries?: number
      retryDelay?: number
    } = {},
  ): Promise<Response> {
    const { retries = 3, retryDelay = 1000, ...fetchOptions } = options
  
    let lastError: Error = new Error("Unknown error")
  
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fetchWithTimeout(resource, fetchOptions)
      } catch (error) {
        console.warn(`Attempt ${attempt + 1}/${retries} failed:`, error)
        if (error instanceof Error) {
          lastError = error
        } else {
          lastError = new Error(String(error))
        }
  
        if (attempt < retries - 1) {
          // Wait before retrying with exponential backoff
          const delay = retryDelay * Math.pow(1.5, attempt)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }
  
    throw lastError
  }
  