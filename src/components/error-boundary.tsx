"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Something went wrong</h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => this.setState({ hasError: false, error: null })} variant="destructive">
              Try again
            </Button>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
