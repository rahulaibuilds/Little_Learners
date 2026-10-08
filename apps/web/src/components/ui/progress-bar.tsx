"use client"

import { ReactNode } from "react"

export interface ProgressBarProps {
  className?: string
  value: number
  max?: number
  showValue?: boolean
}

export const ProgressBar = ({
  className,
  value,
  max = 100,
  showValue = true,
}: ProgressBarProps) => {
  const progressPercent = (value / max) * 100
  const progressClass = `w-${progressPercent}%`

  return (
    <div className="relative rounded-full h-4 bg-muted overflow-hidden">
      <div
        className={`absolute inset-0 ${progressClass} bg-primary transition-all duration-500 ease-out`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs text-muted/60">
        {showValue && `${value}%`}
      </div>
    </div>
  )
}