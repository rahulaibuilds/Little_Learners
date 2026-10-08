"use client"

import { ReactNode } from "react"

export interface SelectProps<T> {
  className?: string
  options: { value: T; label: string }[]
  value: T
  onValueChange: (value: T) => void
  placeholder?: string
}

export const Select = <T>({
  className,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
}: SelectProps<T>) => {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(value)

  const handleSelect = (option: { value: T; label: string }) => {
    setSelected(option.value)
    onValueChange(option.value)
    setOpen(false)
  }

  return (
    <div className={className}>
      <div
        onClick={() => setOpen(!open)}
        className="relative rounded-md border border-input bg-background px-3 py-2 cursor-pointer text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span
          className="select-selected"
        >
          {selected ? options.find((o) => o.value === selected)?.label : placeholder}
        </span>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
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

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-md bg-popover border border-input shadow-lg py-1"
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="px-3 py-2 cursor-pointer hover:bg-accent/10 select-item"
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}