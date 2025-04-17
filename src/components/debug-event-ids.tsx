"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function DebugEventIds() {
  const [ids, setIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchIds = async () => {
      try {
        const response = await fetch("/api/debug/event-ids")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setIds(data.ids || [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    if (visible) {
      fetchIds()
    }
  }, [visible])

  if (!visible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
      >
        Debug IDs
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Event IDs Debug</h3>
        <Button variant="ghost" size="sm" onClick={() => setVisible(false)}>
          Close
        </Button>
      </div>

      {loading ? (
        <p>Loading event IDs...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : ids.length === 0 ? (
        <p>No event IDs found</p>
      ) : (
        <div>
          <p className="mb-2 text-sm">Available Event IDs:</p>
          <ul className="space-y-1 text-xs">
            {ids.map((id, index) => (
              <li key={index} className="flex items-center">
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{id}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(id)
                    alert("ID copied to clipboard!")
                  }}
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-6 text-xs"
                  onClick={() => {
                    window.location.href = `/club-events/${id}`
                  }}
                >
                  View
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
