"use client"

import { ReactNode } from "react"

interface ActivityCardProps {
  title: string
  description: string
  icon: string
  color: string
  progress: number
  onStart: () => void
}

export const ActivityCard = ({
  title,
  description,
  icon,
  color,
  progress,
  onStart,
}: ActivityCardProps) => {
  return (
    <Card className="p-4 hover:bg-primary/5 transition-colors cursor-pointer" onClick={onStart}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span>{progress}% complete</span>
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            className="stroke-width-2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </Card>
  )
}