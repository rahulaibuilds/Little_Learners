"use client"

import { useState, useEffect } from "react"
import { Avatar } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useRouter } from "next/navigation"

interface Child {
  id: string
  name: string
  avatar: string
  level: string
  age: number
  progress?: number
  lastActive?: string
}

interface ChildSelectorProps {
  children: Child[]
  onSelect: (child: Child) => void
  showMenu: boolean
  setShowMenu: (open: boolean) => void
}

export const ChildSelector = ({
  children,
  onSelect,
  showMenu,
  setShowMenu,
}: ChildSelectorProps) => {
  const router = useRouter()

  const handleSelect = (child: Child) => {
    onSelect(child)
    setShowMenu(false)
  }

  return (
    <div className="relative">
      {/* Child Avatar + Name */}
      <div className="flex items-center gap-3">
        <Avatar
          name={children[0]?.name || "Aarav"}
          className="w-10 h-10"
        >
          {children[0]?.avatar || "🐼"}
        </Avatar>

        <div>
          <p className="font-medium text-sm">{children[0]?.name || "Aarav"}</p>
          <p className="text-xs text-muted-foreground">{children[0]?.level || "UKG"} | Age {children[0]?.age || 5}</p>
        </div>
      </div>

      {/* Dropdown */}
      <div
        onClick={() => setShowMenu(!showMenu)}
        className="py-2 cursor-pointer hover:bg-primary/10 transition-colors"
        aria-haspopup="menu"
        aria-label="Select child"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            className="stroke-width-2"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 9l6 6 6-6"
          />
        </svg>
      </div>

      {/* Menu */}
      {showMenu && (
        <Card className="absolute right-0 mt-2 w-64 rounded-md shadow-lg border">
          {children.map((child) => (
            <div
              key={child.id}
              onClick={() => handleSelect(child)}
              className="p-3 cursor-pointer hover:bg-primary/5 transition-colors"
            >
              <Avatar
                name={child.name}
                className="w-8 h-8 mr-3"
              >
                {child.avatar}
              </Avatar>
              <div>
                <p className="font-medium">{child.name}</p>
                <p className="text-xs text-muted-foreground">
                  {child.level} | Age {child.age}
                </p>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}