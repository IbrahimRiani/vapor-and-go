"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useApp } from "@/src/context/AppContext"
import { useAuth } from "@/src/context/AuthProvider"

export default function GlobalNav() {
  const { isEmpresaMode, setIsEmpresaMode, isDarkMode, toggleTheme, activeCount } = useApp()
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome = pathname === "/"

  const handleModeClick = (mode: boolean) => {
    if (isHome) {
      setIsEmpresaMode(mode)
    } else {
      setIsEmpresaMode(mode)
      router.push("/")
    }
    setMenuOpen(false)
  }

  const navItems = (
    <>
      <button
        onClick={toggleTheme}
        className="text-lg leading-none px-[10px] py-2 bg-transparent text-[var(--vg-accent)] border-2 border-[var(--vg-border)] cursor-pointer transition-all duration-150 shrink-0 hover:border-[var(--vg-accent)]"
        title={isDarkMode ? "Modo claro" : "Modo oscuro"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <button
        onClick={() => handleModeClick(false)}
        className="text-[11px] font-bold tracking-[0.06em] uppercase px-[14px] py-2 cursor-pointer transition-all duration-150 whitespace-nowrap shrink-0"
        style={{
          background: !isEmpresaMode ? "var(--vg-accent)" : "transparent",
          color: !isEmpresaMode ? "#000000" : "var(--vg-text-secondary)",
          border: !isEmpresaMode ? "2px solid var(--vg-accent)" : "2px solid var(--vg-border)",
        }}
      >
        Catálogo
      </button>

      <button
        onClick={() => handleModeClick(true)}
        className="text-[11px] font-bold tracking-[0.06em] uppercase px-[14px] py-2 cursor-pointer transition-all duration-150 whitespace-nowrap shrink-0"
        style={{
          background: isEmpresaMode ? "var(--vg-accent)" : "transparent",
          color: isEmpresaMode ? "#000000" : "var(--vg-text-secondary)",
          border: isEmpresaMode ? "2px solid var(--vg-accent)" : "2px solid var(--vg-border)",
        }}
      >
        Empresas
      </button>

      {loading ? null : user ? (
        <div className="flex items-center gap-[6px] shrink-0">
          <Link
            href="/mi-cuenta"
            className="text-xs font-bold text-black no-underline tracking-[0.02em] flex items-center gap-[6px] px-4 py-2 bg-[var(--vg-accent)] border-2 border-black shadow-[3px_3px_0px_0px_#000000] whitespace-nowrap hover:opacity-85 transition-opacity duration-200"
          >
            Cuenta
          </Link>
          <button
            onClick={signOut}
            className="text-[11px] font-bold text-[var(--vg-text-secondary)] tracking-[0.04em] bg-transparent border-2 border-[var(--vg-border)] cursor-pointer px-3 py-2 transition-all duration-150 whitespace-nowrap hover:text-[var(--vg-text-primary)] hover:border-[var(--vg-text-primary)]"
          >
            Salir
          </button>
        </div>
      ) : (
        <Link
          href="/auth"
          className="text-xs font-bold text-black no-underline tracking-[0.02em] flex items-center gap-[6px] px-4 py-2 bg-[var(--vg-accent)] border-2 border-black shadow-[3px_3px_0px_0px_#000000] whitespace-nowrap shrink-0 hover:opacity-85 transition-opacity duration-200"
        >
          Acceder
        </Link>
      )}
    </>
  )

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[9998] border-b-2 border-[var(--vg-border)]"
        style={{ background: "color-mix(in srgb, var(--vg-bg) 97%, transparent)", backdropFilter: "blur(16px) saturate(1.2)" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 h-16 max-w-[1600px] mx-auto w-full">
          <Link
            href="/"
            className="font-black text-[22px] tracking-[-0.03em] text-[var(--vg-text-primary)] no-underline whitespace-nowrap shrink-0"
          >
            VAPOR&amp;GO
          </Link>

          {activeCount > 0 && (
            <span className="hidden lg:block text-[11px] font-semibold text-[var(--vg-text-secondary)] tracking-[0.02em] whitespace-nowrap ml-auto mr-2">
              {activeCount} {isEmpresaMode ? "servicios" : "equipos"}
            </span>
          )}

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {navItems}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-xl leading-none px-[10px] py-2 bg-transparent text-[var(--vg-text-primary)] border-2 border-[var(--vg-border)] cursor-pointer"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-[9997] flex flex-col items-stretch gap-3 p-4 border-t-2 border-[var(--vg-border)] overflow-y-auto"
          style={{ background: "color-mix(in srgb, var(--vg-bg) 98%, transparent)", backdropFilter: "blur(20px) saturate(1.2)" }}
        >
          {activeCount > 0 && (
            <span className="text-center text-[11px] font-semibold text-[var(--vg-text-secondary)] tracking-[0.02em] py-2">
              {activeCount} {isEmpresaMode ? "servicios" : "equipos"}
            </span>
          )}
          {navItems}
        </div>
      )}
    </>
  )
}
