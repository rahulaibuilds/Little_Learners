"use client"

import { ReactNode, HTMLAttributes, forwardRef } from "react"

export interface AlertDialogProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(
  ({ className, children, open = true, onOpenChange, ...props }, ref) => {
    const cls = [
      "fixed inset-0 z-50 flex items-center justify-center",
      className,
    ].filter(Boolean).join(" ")

    if (!open) return null

    return (
      <div ref={ref} className={cls} {...props}>
        <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
        <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          {children}
        </div>
      </div>
    )
  }
)

AlertDialog.displayName = "AlertDialog"

export interface AlertDialogTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const cls = ["inline-flex items-center justify-center rounded-md text-sm font-medium", className]
      .filter(Boolean)
      .join(" ")

    return <button ref={ref} className={cls} {...props}>{children}</button>
  }
)

AlertDialogTrigger.displayName = "AlertDialogTrigger"

export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const cls = ["", className].filter(Boolean).join(" ")

    return <div ref={ref} className={cls} {...props}>{children}</div>
  }
)

AlertDialogContent.displayName = "AlertDialogContent"

export interface AlertDialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const cls = ["mb-4", className].filter(Boolean).join(" ")

    return <div ref={ref} className={cls} {...props}>{children}</div>
  }
)

AlertDialogHeader.displayName = "AlertDialogHeader"

export interface AlertDialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, AlertDialogTitleProps>(
  ({ className, children, ...props }, ref) => {
    const cls = ["text-lg font-semibold", className].filter(Boolean).join(" ")

    return <h2 ref={ref} className={cls} {...props}>{children}</h2>
  }
)

AlertDialogTitle.displayName = "AlertDialogTitle"

export interface AlertDialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export const AlertDialogDescription = forwardRef<HTMLParagraphElement, AlertDialogDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    const cls = ["text-sm text-gray-500 mt-1", className].filter(Boolean).join(" ")

    return <p ref={ref} className={cls} {...props}>{children}</p>
  }
)

AlertDialogDescription.displayName = "AlertDialogDescription"

export interface AlertDialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ className, children, ...props }, ref) => {
    const cls = ["flex justify-end gap-2 mt-4", className].filter(Boolean).join(" ")

    return <div ref={ref} className={cls} {...props}>{children}</div>
  }
)

AlertDialogFooter.displayName = "AlertDialogFooter"

export interface AlertDialogActionProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, children, ...props }, ref) => {
    const cls = [
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "bg-blue-600 text-white hover:bg-blue-700",
      className,
    ].filter(Boolean).join(" ")

    return <button ref={ref} className={cls} {...props}>{children}</button>
  }
)

AlertDialogAction.displayName = "AlertDialogAction"

export interface AlertDialogCancelProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ className, children, ...props }, ref) => {
    const cls = [
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "bg-gray-100 text-gray-900 hover:bg-gray-200",
      className,
    ].filter(Boolean).join(" ")

    return <button ref={ref} className={cls} {...props}>{children}</button>
  }
)

AlertDialogCancel.displayName = "AlertDialogCancel"