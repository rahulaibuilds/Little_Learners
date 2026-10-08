"use client"

import { ReactNode } from "react"

export interface AvatarProps {
  className?: string
  children: ReactNode
  name?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export const Avatar = ({
  className,
  children,
  name,
  size = "md",
}: AvatarProps) => {
  const sizeMap = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14", xl: "w-20 h-20" }

  return (
    <div
      className={`relative flex items-center justify-center rounded-full ${sizeMap[size]} ${className}`}
    >
      {children}
      {name && (
        <div
          className={`absolute -inset-1 flex items-center justify-center text-xs font-medium ${size === "md" ? "text-white" : "text-black"}`}
        >
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
    </div>
  )
}