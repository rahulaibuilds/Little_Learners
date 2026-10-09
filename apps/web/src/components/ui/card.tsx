"use client"

import { ReactNode, HTMLAttributes, forwardRef } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const cls = [
      "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm",
      className,
    ].filter(Boolean).join(" ")

    return <div ref={ref} className={cls} {...props}>{children}</div>
  }
)

Card.displayName = "Card"