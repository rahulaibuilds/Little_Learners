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
  const cls = [
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ].filter(Boolean).join(" ")

  return (
    <button className={cls} disabled={disabled} type={type} onClick={onClick}>
      {children}
    </button>
  )
}
