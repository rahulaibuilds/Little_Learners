"use client"

import { ReactNode } from "react"

export interface BadgeProps {
  className?: string
  variant?: "default" | "secondary" | "success" | "warning" | "error"
  children: ReactNode
}

export const Badge = ({
  className,
  variant = "default",
  children,
}: BadgeProps) => {
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    error: "bg-error text-error-foreground",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}