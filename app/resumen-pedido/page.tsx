"use client"

import React, { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { marketplaceConfig } from "@/src/config/marketplace.config"

const cfg = marketplaceConfig
const { symbol } = cfg.currency

const IMG_HDS = "https://s1.kaercher-media.com/products/10719000/main/1/d0.jpg"
const IMG_FREGADORA = "https://s1.kaercher-media.com/products/11270110/main/1/d0.jpg"
const IMG_VAPOR = "https://s1.kaercher-media.com/products/10921040/main/1/d0.jpg"
const IMG_ASPIRADORA = "https://s1.kaercher-media.com/products/16672860/main/1/d0.jpg"

type ProductItem = {
  ref: string
  name: string
  category: string
  status: string
  price: number
  imageUrl: string
  duration?: string
  staff?: string
}

const maquinariaData: ProductItem[] = [
  { ref: "KS-07P", name: "Kärcher K7 Premium", category: "Hidrolimpiadoras", status: "Disponible", price: 12900, imageUrl: IMG_HDS },
  { ref: "VGS-2000", name: "Generador de Vapor 2000W", category: "Generadores", status: "Disponible", price: 34500, imageUrl: IMG_VAPOR },
  { ref: "KS-SCV", name: "Kärcher SC 5 EasyFix", category: "Limpiacristales", status: "Stock bajo", price: 8900, imageUrl: IMG_VAPOR },
  { ref: "VGS-HP", name: "Hidrolimpiadora Profesional HP", category: "Hidrolimpiadoras", status: "Disponible", price: 28500, imageUrl: IMG_HDS },
  { ref: "KS-BR", name: "Kärcher BR 30/4 C", category: "Fregadoras", status: "Disponible", price: 15600, imageUrl: IMG_FREGADORA },
  { ref: "KS-IV", name: "Kärcher IV 60/36", category: "Aspiradoras", status: "Disponible", price: 23000, imageUrl: IMG_ASPIRADORA },
  { ref: "VGS-ST", name: "Equipo de Vapor Seco", category: "Generadores", status: "Disponible", price: 19800, imageUrl: IMG_VAPOR },
  { ref: "KS-OC", name: "Kärcher OC 3", category: "Lavado exterior", status: "Disponible", price: 4500, imageUrl: IMG_HDS },
  { ref: "VGS-PRO", name: "Generador Vapor PRO-5", category: "Generadores", status: "Disponible", price: 52000, imageUrl: IMG_VAPOR },
  { ref: "KS-SV", name: "Kärcher SE 6.500", category: "Aspiradoras", status: "Disponible", price: 17900, imageUrl: IMG_ASPIRADORA },
  { ref: "KS-FC", name: "Kärcher FC 7 Premium", category: "Limpiacristales", status: "Disponible", price: 6800, imageUrl: IMG_VAPOR },
  { ref: "KS-K7", name: "Kärcher K7 Compact", category: "Hidrolimpiadoras", status: "Disponible", price: 11200, imageUrl: IMG_HDS },
]

const serviciosData: ProductItem[] = [
  { ref: "SVC-HDS", name: "Servicio de Desengrasado y Alta Presión HDS", category: "Limpieza Técnica", status: "Disponible", price: 25000, imageUrl: IMG_HDS, duration: "1 jornada", staff: "1 operario" },
  { ref: "SVC-V4", name: "Tratamiento de Desinfección Térmica por Vapor V4", category: "Sanitaria e Alimentaria", status: "Disponible", price: 38000, imageUrl: IMG_VAPOR, duration: "1 jornada", staff: "2 técnicos" },
  { ref: "SVC-HD", name: "Limpieza de Fachadas y Estructuras HD", category: "Mantenimiento Industrial", status: "Stock bajo", price: 19000, imageUrl: IMG_HDS, duration: "1 jornada", staff: "1 operario" },
  { ref: "SVC-SS", name: "Aspirado y Saneamiento de Suelos Continuos", category: "Logística y Almacenes", status: "Disponible", price: 22000, imageUrl: IMG_FREGADORA, duration: "1 jornada", staff: "1 operario" },
]

const IVA_RATE = 0.21
const GESTION_FEE = 0.02

function ResumenContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const ref = searchParams.get("ref") || ""
  const mode = searchParams.get("mode") || "maquinaria"
  const action = searchParams.get("action") || "comprar"

  const isEmpresa = mode === "empresa"
  const data = isEmpresa ? serviciosData : maquinariaData
  const item = data.find((p) => p.ref === ref)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [direccion, setDireccion] = useState("")

  if (!item) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--vg-bg)] flex-col gap-4 px-5">
        <p className="text-base font-semibold text-[var(--vg-text-secondary)]">Producto no encontrado</p>
        <Link href="/" className="text-xs font-bold text-[var(--vg-accent)] tracking-[0.06em] uppercase no-underline hover:underline">Volver al catálogo</Link>
      </div>
    )
  }

  const actionLabel: Record<string, string> = {
    comprar: "Compra",
    alquilar: "Alquiler",
    reservar: "Reserva de Servicio",
    solicitar: "Solicitud de Jornada",
  }

  const basePrice = item.price
  const iva = Math.round(basePrice * IVA_RATE)
  const gestion = Math.round(basePrice * GESTION_FEE)
  const total = basePrice + iva + gestion

  const formatCents = (c: number) => `${symbol}${(c / 100).toLocaleString("es-ES", { minimumFractionDigits: 2 })}`

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setLoading(false)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--vg-bg)] px-5">
        <div className="w-full max-w-[480px] bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.08)] text-center py-16 px-8">
          <div className="w-16 h-16 rounded-full bg-[#22C55E] flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--vg-text-primary)] mb-3 tracking-[-0.02em]">¡Simulación completada!</h2>
          <p className="text-sm font-medium text-[var(--vg-text-secondary)] mb-8 leading-[1.6]">
            {action === "comprar" && `Tu compra de ${item.name} ha sido registrada correctamente.`}
            {action === "alquilar" && `Tu alquiler de ${item.name} ha sido registrado correctamente.`}
            {action === "reservar" && `Tu reserva del servicio ${item.name} ha sido registrada correctamente.`}
            {action === "solicitar" && `Tu solicitud de jornada para ${item.name} ha sido registrada correctamente.`}
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-bold tracking-[0.06em] uppercase py-[14px] px-10 bg-[#FFDE00] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] no-underline transition-all duration-150 hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_0px_#FFDE00]"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--vg-bg)] pt-[100px] sm:pt-[112px] pb-[48px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1000px] mx-auto">
        <Link href="/" className="inline-block text-xs font-semibold text-[var(--vg-text-secondary)] no-underline tracking-[0.04em] mb-8 hover:text-[var(--vg-text-primary)]">← Volver al catálogo</Link>

        <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-black tracking-[-0.03em] text-[var(--vg-text-primary)] mb-1">{actionLabel[action]}</h1>
        <p className="text-sm font-medium text-[var(--vg-text-secondary)] mb-8">Revisa los detalles antes de confirmar</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 mb-6">
                <div className="w-full sm:w-[140px] h-[120px] sm:h-[140px] shrink-0 bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-[var(--vg-accent)] tracking-[0.12em] uppercase mb-1">{item.ref}</div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[var(--vg-text-primary)] tracking-[-0.02em] leading-[1.2] mb-2">{item.name}</h2>
                  <span className="inline-block text-[10px] font-bold tracking-[0.08em] uppercase px-3 py-[3px] bg-[var(--vg-accent)] text-black border-2 border-black">{item.category}</span>
                </div>
              </div>

              {(action === "alquilar" || action === "solicitar") && (
                <div className="space-y-4 pt-5 border-t-2 border-[var(--vg-border)]">
                  <h3 className="text-[11px] font-bold text-[var(--vg-accent)] tracking-[0.12em] uppercase">
                    {action === "alquilar" ? "Fechas de alquiler" : "Fecha de la jornada"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase block mb-2">
                        {action === "alquilar" ? "Recogida" : "Fecha"}
                      </label>
                      <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="w-full px-4 py-[12px] bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] text-[var(--vg-text-primary)] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#FFDE00]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase block mb-2">Devolución</label>
                      <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="w-full px-4 py-[12px] bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] text-[var(--vg-text-primary)] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#FFDE00]" />
                    </div>
                  </div>
                </div>
              )}

              {(action === "reservar" || action === "solicitar") && (
                <div className="space-y-4 pt-5 border-t-2 border-[var(--vg-border)]">
                  <h3 className="text-[11px] font-bold text-[var(--vg-accent)] tracking-[0.12em] uppercase">Condiciones del servicio</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase block mb-1">Duración</span><span className="font-bold text-[var(--vg-text-primary)]">{item.duration || "1 jornada"}</span></div>
                    <div><span className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase block mb-1">Personal</span><span className="font-bold text-[var(--vg-text-primary)]">{item.staff || "Técnico certificado"}</span></div>
                  </div>
                  <div className="pt-3">
                    <label className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase block mb-2">Dirección de la obra</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Calle, número, ciudad, código postal"
                      className="w-full px-4 py-[12px] bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] text-[var(--vg-text-primary)] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#FFDE00]"
                    />
                  </div>
                </div>
              )}

              {action === "comprar" && (
                <div className="space-y-4 pt-5 border-t-2 border-[var(--vg-border)]">
                  <h3 className="text-[11px] font-bold text-[var(--vg-accent)] tracking-[0.12em] uppercase">Entrega</h3>
                  <div className="pt-3">
                    <label className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase block mb-2">Dirección de envío</label>
                    <input
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      placeholder="Calle, número, ciudad, código postal"
                      className="w-full px-4 py-[12px] bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] text-[var(--vg-text-primary)] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#FFDE00]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] p-6 lg:p-8 sticky top-[120px]">
              <h3 className="text-[11px] font-bold text-[var(--vg-accent)] tracking-[0.12em] uppercase mb-5">Desglose de precio</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--vg-text-secondary)]">Precio base</span>
                  <span className="font-bold text-[var(--vg-text-primary)]">{formatCents(basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--vg-text-secondary)]">IVA (21%)</span>
                  <span className="font-bold text-[var(--vg-text-primary)]">{formatCents(iva)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--vg-text-secondary)]">Gastos de gestión</span>
                  <span className="font-bold text-[var(--vg-text-primary)]">{formatCents(gestion)}</span>
                </div>
                <div className="border-t-2 border-[var(--vg-border)] pt-3 flex justify-between">
                  <span className="font-extrabold text-[var(--vg-text-primary)]">Total</span>
                  <span className="text-xl font-black text-[var(--vg-text-primary)] tracking-[-0.02em]">{formatCents(total)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full mt-8 text-xs font-bold tracking-[0.06em] uppercase py-[14px] px-0 bg-[#FFDE00] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] transition-all duration-150 cursor-pointer hover:bg-black hover:text-white hover:shadow-[6px_6px_0px_0px_#FFDE00] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FFDE00] disabled:hover:text-black disabled:hover:shadow-[4px_4px_0px_0px_#000000]"
              >
                {loading ? "Verificando..." : "Confirmar y Procesar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumenPedidoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-[var(--vg-bg)]">
        <div className="text-sm font-medium text-[var(--vg-text-secondary)] animate-pulse">Cargando...</div>
      </div>
    }>
      <ResumenContent />
    </Suspense>
  )
}
