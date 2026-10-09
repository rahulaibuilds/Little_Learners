"use client"

import { InputHTMLAttributes, forwardRef } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    const cls = [
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
      "placeholder:text-gray-400",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    ].filter(Boolean).join(" ")

    return <input ref={ref} type={type} className={cls} {...props} />
  }
)

Input.displayName = "Input"