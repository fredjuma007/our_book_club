"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"
import { generateGoogleCalendarUrl } from "@/lib/calendar-utils"
import type { Event } from "@/lib/event-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AddToCalendarProps {
  event: Event
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function AddToCalendar({
  event,
  variant = "outline",
  size = "default",
  className = "",
}: AddToCalendarProps) {
  const googleCalendarUrl = generateGoogleCalendarUrl(event)

  const handleCalendarItemClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Open in a new tab
    window.open(googleCalendarUrl, "_blank")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`font-serif ${className}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Add to Calendar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <DropdownMenuItem onClick={handleCalendarItemClick} className="flex items-center cursor-pointer">
          <Plus className="w-4 h-4 mr-2" />
          Google Calendar
        </DropdownMenuItem>
        {/* You can add more calendar options here in the future */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
