"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

type AppContextType = {
  isEmpresaMode: boolean
  setIsEmpresaMode: (v: boolean) => void
  isDarkMode: boolean
  toggleTheme: () => void
  activeCount: number
  setActiveCount: (n: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isEmpresaMode, setIsEmpresaMode] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeCount, setActiveCount] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem("vg-theme")
    if (saved === "light") {
      setIsDarkMode(false)
      document.documentElement.classList.remove("dark")
    } else {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDarkMode((p) => {
      const next = !p
      if (next) {
        document.documentElement.classList.add("dark")
        localStorage.setItem("vg-theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("vg-theme", "light")
      }
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{ isEmpresaMode, setIsEmpresaMode, isDarkMode, toggleTheme, activeCount, setActiveCount }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be inside AppProvider")
  return ctx
}
