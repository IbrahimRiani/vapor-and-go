"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/context/AuthProvider"
import { marketplaceConfig } from "@/src/config/marketplace.config"

const cfg = marketplaceConfig

type AuthMode = "login" | "register"

export default function AuthPage() {
  const { signIn, signUp, user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nombreCompleto, setNombreCompleto] = useState("")
  const [dniNif, setDniNif] = useState("")
  const [submitLoading, setSubmitLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  const inputClass = "w-full px-4 py-[14px] bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] text-[var(--vg-text-primary)] text-[15px] font-medium outline-none box-border transition-colors duration-200 focus:border-[#FFDE00] focus:shadow-[0_0_0_2px_rgba(255,222,0,0.3)]"
  const labelClass = "text-[12px] font-bold text-[var(--vg-text-secondary)] tracking-[0.06em] uppercase"

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/mi-cuenta")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitLoading(true)
    setMessage(null)

    const action = mode === "login" ? signIn : signUp
    const meta = mode === "register"
      ? { display_name: nombreCompleto, document_id: dniNif, user_type: "cliente" }
      : undefined
    const { error } = await action(email, password, meta)

    if (error) {
      setMessage({ type: "error", text: error.message })
    } else if (mode === "register") {
      setMessage({
        type: "success",
        text: "Registro exitoso. Revisa tu bandeja de entrada para confirmar el correo.",
      })
    } else {
      router.push("/mi-cuenta")
    }

    setSubmitLoading(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--vg-bg)]">
        <div className="text-sm font-medium text-[var(--vg-text-secondary)] animate-pulse">Cargando...</div>
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--vg-bg)] pt-[84px] px-5 pb-5">
      <div className="w-full max-w-[440px] bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)]">
        <div className="pt-9 pb-6 px-8 text-center">
          <Link href="/" className="no-underline">
            <div className="font-black text-[26px] tracking-[-0.03em] text-[var(--vg-text-primary)] mb-2">
              {cfg.name}
            </div>
          </Link>
          <h1 className="text-[20px] font-extrabold text-[var(--vg-text-primary)] mb-1">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="text-[14px] font-medium text-[var(--vg-text-secondary)]">
            {mode === "login"
              ? "Accede a tu cuenta de Vapor&Go"
              : "Regístrate para comprar maquinaria o contratar servicios"}
          </p>
        </div>

        <div className="px-8 pb-7">
          <div className="flex gap-0 mb-7 border-2 border-[var(--vg-border)]">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 text-[14px] font-bold py-3 border-none cursor-pointer transition-all duration-200 ${
                mode === "login"
                  ? "bg-[var(--vg-accent)] text-black"
                  : "bg-transparent text-[var(--vg-text-secondary)]"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 text-[14px] font-bold py-3 border-none cursor-pointer transition-all duration-200 ${
                mode === "register"
                  ? "bg-[var(--vg-accent)] text-black"
                  : "bg-transparent text-[var(--vg-text-secondary)]"
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="auth-email" className={labelClass}>Correo electrónico</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@empresa.com"
                required
                className={inputClass}
              />
            </div>

            {mode === "register" && (
              <>
                <div className="flex flex-col gap-2">
                  <label htmlFor="auth-nombre" className={labelClass}>Nombre completo *</label>
                  <input
                    id="auth-nombre"
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    placeholder="Ej: María García López"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="auth-dni" className={labelClass}>DNI / NIF *</label>
                  <input
                    id="auth-dni"
                    type="text"
                    value={dniNif}
                    onChange={(e) => setDniNif(e.target.value)}
                    placeholder="12345678Z"
                    required
                    pattern="[0-9]{8}[A-Z]"
                    title="8 dígitos + letra mayúscula (ej: 12345678Z)"
                    className={inputClass}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="auth-password" className={labelClass}>Contraseña</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading || authLoading}
              className="text-[14px] font-bold tracking-[0.06em] uppercase py-4 px-0 bg-[#FFDE00] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-150 cursor-pointer hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_0px_#FFDE00] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFDE00] disabled:hover:text-black disabled:hover:shadow-[4px_4px_0px_0px_#000000]"
            >
              {submitLoading
                ? "Procesando..."
                : mode === "login"
                ? "Acceder"
                : "Crear cuenta"}
            </button>

            {message && (
              <div
                className={`text-[13px] font-semibold px-4 py-3 leading-[1.5] border-2 ${
                  message.type === "error"
                    ? "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]"
                    : "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]"
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
        </div>

        <div className="px-8 pb-7 pt-5 border-t-2 border-[var(--vg-border)] flex justify-center">
          <Link
            href="/"
            className="text-[12px] font-semibold text-[var(--vg-text-secondary)] no-underline tracking-[0.04em] transition-colors duration-200 hover:text-[var(--vg-text-primary)]"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
