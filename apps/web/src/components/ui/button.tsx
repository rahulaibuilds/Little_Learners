"use client"

import { ReactNode } from "react"

export interface ButtonProps {
  className?: string
  children: ReactNode
  variant?: "default" | "outline" | "ghost"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: (e: React.MouseEvent) => void
}

export const Button = ({
  className,
  children,
  variant = "default",
  disabled,
  type = "button",
  onClick,
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "hover:bg-accent/10",
  }

  return (
    <button
      className={[
        baseClasses,
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      ].filter(Boolean).join(" ")},
      disabled,
      type,
      onClick,
    >
      {children}
    </button>
  )
}