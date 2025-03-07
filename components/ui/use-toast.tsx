"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { Toaster as Sonner } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toast: (props: ToastProps) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    setToasts((prev) => [...prev, props])
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Sonner
        toasts={toasts.map((t) => ({
          title: t.title,
          description: t.description,
          className: t.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "",
        }))}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

