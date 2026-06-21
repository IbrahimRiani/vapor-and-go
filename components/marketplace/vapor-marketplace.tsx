"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { marketplaceConfig } from "@/src/config/marketplace.config"
import { useApp } from "@/src/context/AppContext"
import { cn } from "@/lib/utils"

const cfg = marketplaceConfig
const { symbol } = cfg.currency
const { clientMode } = cfg.localization

const IMG_HDS = "https://s1.kaercher-media.com/products/10719000/main/1/d0.jpg"
const IMG_FREGADORA = "https://s1.kaercher-media.com/products/11270110/main/1/d0.jpg"
const IMG_VAPOR = "https://s1.kaercher-media.com/products/10921040/main/1/d0.jpg"
const IMG_ASPIRADORA = "https://s1.kaercher-media.com/products/16672860/main/1/d0.jpg"

const serviciosEmpresa = [
  { ref: "SVC-HDS", name: "Servicio de Desengrasado y Alta Presión HDS", category: "Limpieza Técnica", status: "Disponible", price: 25000, imageUrl: IMG_HDS },
  { ref: "SVC-V4", name: "Tratamiento de Desinfección Térmica por Vapor V4", category: "Sanitaria e Alimentaria", status: "Disponible", price: 38000, imageUrl: IMG_VAPOR },
  { ref: "SVC-HD", name: "Limpieza de Fachadas y Estructuras HD", category: "Mantenimiento Industrial", status: "Stock bajo", price: 19000, imageUrl: IMG_HDS },
  { ref: "SVC-SS", name: "Aspirado y Saneamiento de Suelos Continuos", category: "Logística y Almacenes", status: "Disponible", price: 22000, imageUrl: IMG_FREGADORA },
]

const maquinariaCatalogo = [
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

const categoriasEmpresa = ["Todas", "Limpieza Técnica", "Sanitaria e Alimentaria", "Mantenimiento Industrial", "Logística y Almacenes"]
const categoriasMaquinaria = ["Todas", "Hidrolimpiadoras", "Generadores", "Fregadoras", "Aspiradoras", "Limpiacristales", "Lavado exterior"]

function useScrollReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, revealed }
}

function AnimatedReveal({ children, className, delay = 0, threshold }: {
  children: React.ReactNode
  className?: string
  delay?: number
  threshold?: number
}) {
  const { ref, revealed } = useScrollReveal(threshold)
  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const statusLabel: Record<string, string> = {
  Disponible: "DISPONIBLE",
  "Stock bajo": "STOCK BAJO",
  Agotado: "AGOTADO",
}

export default function VaporMarketplace() {
  const [filter, setFilter] = useState("Todas")
  const [scrollProgress, setScrollProgress] = useState(0)
  const { isEmpresaMode, setActiveCount } = useApp()
  const router = useRouter()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilter("Todas")
  }, [isEmpresaMode])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const max = document.documentElement.scrollHeight - window.innerHeight
          setScrollProgress(Math.min(1, Math.max(0, window.scrollY / max)))
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const activeData = isEmpresaMode ? serviciosEmpresa : maquinariaCatalogo
  const categories = isEmpresaMode ? categoriasEmpresa : categoriasMaquinaria

  useEffect(() => {
    setActiveCount(activeData.length)
  }, [activeData, setActiveCount])

  const totalEquipos = activeData.length

  const filtered = filter === "Todas"
    ? activeData
    : activeData.filter((e) => e.category === filter)

  const formatPrice = (cents: number) =>
    `${symbol}${(cents / 100).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const scStatus = (s: string) =>
    s === "Disponible" ? "#22C55E" : s === "Stock bajo" ? "#F59E0B" : "#EF4444"

  return (
    <div className="bg-[var(--vg-bg)] text-[var(--vg-text-primary)]">
      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .product-card { transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1); }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px color-mix(in srgb, var(--vg-text-primary) 15%, transparent); }
      `}</style>

      <div className="fixed top-0 left-0 right-0 h-[3px] z-[10000]"
        style={{ background: `linear-gradient(90deg, #FFCC00 ${scrollProgress * 100}%, transparent ${scrollProgress * 100}%)` }}
      />

      <div className="pt-16" />

      <section className="relative overflow-hidden border-b-2 border-[rgba(255,204,0,0.15)] bg-[var(--vg-bg)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-[60px] sm:pt-[80px] lg:pt-[100px] pb-[48px] sm:pb-[64px] lg:pb-[80px] relative">
          <AnimatedReveal>
            <div className="text-xs font-bold text-[#FFCC00] tracking-[0.18em] uppercase mb-5">
              {isEmpresaMode ? "SERVICIOS INDUSTRIALES" : "MAQUINARIA PROFESIONAL"} · 2026
            </div>
          </AnimatedReveal>
          <AnimatedReveal delay={120}>
            <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.92] mt-0 mb-6 text-[var(--vg-text-primary)] max-w-[14ch] text-balance">
              {isEmpresaMode ? "Servicios Industriales" : "Maquinaria Profesional"}
            </h1>
          </AnimatedReveal>
          <AnimatedReveal delay={240}>
            <p className="text-[clamp(1rem,1.3vw,1.25rem)] font-medium leading-[1.65] text-[var(--vg-text-secondary)] max-w-[56ch] mt-0 mb-12">
              {clientMode.searchPlaceholder}. {isEmpresaMode
                ? `Contrata el servicio técnico que necesitas entre ${totalEquipos} soluciones especializadas para empresas.`
                : `Encuentra el equipo que necesitas entre ${totalEquipos} máquinas profesionales.`}
            </p>
          </AnimatedReveal>
          <AnimatedReveal delay={360}>
            <div className="text-[11px] text-[var(--vg-text-muted)] tracking-[0.12em] uppercase mb-4 flex items-center gap-3">
              <span className="font-semibold">{isEmpresaMode ? "Catálogo de servicios" : "Catálogo de maquinaria"}</span>
              <span className="text-[rgba(255,204,0,0.3)] text-base">—</span>
              <span className="font-semibold">{filtered.length} {isEmpresaMode ? "servicios" : "equipos"}</span>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      <section className="sticky top-16 z-10 overflow-x-auto border-b-2 border-[rgba(255,204,0,0.15)]"
        style={{ background: "color-mix(in srgb, var(--vg-bg) 97%, transparent)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex gap-[6px] px-4 sm:px-6 lg:px-12 py-4 max-w-[1600px] mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat) }}
              className={cn("text-[11px] font-bold tracking-[0.08em] uppercase px-5 py-2 whitespace-nowrap cursor-pointer shrink-0",
                filter === cat
                  ? "bg-[#FFCC00] text-black border-2 border-[#FFCC00] hover:bg-black hover:text-[#FFCC00] hover:border-black focus:bg-black focus:text-[#FFCC00] active:bg-black active:text-[#FFCC00] transition-colors duration-150"
                  : "bg-transparent text-[var(--vg-text-secondary)] border-2 border-[var(--vg-border)] hover:bg-[#FFCC00] hover:text-black hover:border-[#FFCC00] focus:bg-[#FFCC00] focus:text-black active:bg-[#FFCC00] active:text-black transition-colors duration-150"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-0">
        {filtered.length === 0 && (
          <div className="w-full h-[40vh] flex items-center justify-center">
            <p className="text-lg font-semibold text-[var(--vg-text-muted)]">No hay resultados para esta categoría.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-7">
          {filtered.map((item, idx) => (
            <AnimatedReveal key={item.ref} delay={Math.min(idx * 60, 400)} threshold={0.04}>
              <div className="product-card bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] overflow-hidden relative flex flex-col">
                <div className="relative w-full h-[140px] sm:h-[180px] lg:h-[220px] overflow-hidden bg-[var(--vg-bg)]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover block"
                  />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, transparent 50%, color-mix(in srgb, var(--vg-bg) 80%, transparent) 100%)" }}
                  />
                  <span
                    className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.08em] uppercase px-3 py-[3px] text-black border-2 border-black"
                    style={{ background: scStatus(item.status) }}
                  >
                    {statusLabel[item.status] || item.status}
                  </span>
                  <span className="absolute bottom-4 left-4 text-[10px] font-semibold tracking-[0.04em] px-3 py-[3px] bg-[var(--vg-accent)] text-black border-2 border-black">
                    {item.category}
                  </span>
                </div>

                <div className="p-4 pb-4 sm:p-5 sm:pb-5 lg:p-6 lg:pb-5 flex-1 flex flex-col">
                  <div className="text-[11px] font-bold text-[var(--vg-accent)] tracking-[0.12em] uppercase mb-2">
                    {item.ref}
                  </div>

                  <h3 className="text-sm sm:text-lg lg:text-xl font-extrabold text-[var(--vg-text-primary)] my-0 mb-3 tracking-[-0.02em] leading-[1.2]">
                    {item.name}
                  </h3>

                  <div className="flex gap-4 mb-5 flex-wrap">
                    <div>
                      <div className="text-[9px] font-bold text-[var(--vg-text-muted)] tracking-[0.1em] uppercase mb-[2px]">Precio</div>
                      <div className="text-lg sm:text-xl lg:text-[26px] font-black text-[var(--vg-text-primary)] tracking-[-0.02em] leading-none">
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-[11px] font-medium text-[var(--vg-text-muted)] mt-[2px]">
                        {cfg.currency.code} · {isEmpresaMode ? "/jornada" : "Pago único"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 py-3 border-t border-[var(--vg-border)] border-b border-[var(--vg-border)] mb-5">
                    <div>
                      <div className="text-[9px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase mb-[2px]">Duración</div>
                      <span className="text-[13px] font-bold text-[var(--vg-text-primary)]">1 jornada</span>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase mb-[2px]">Personal</div>
                      <span className="text-[13px] font-bold text-[var(--vg-text-primary)]">Técnico certificado</span>
                    </div>
                  </div>

                  <div className="mt-auto flex gap-3">
                    <button
                      onClick={() => router.push(`/resumen-pedido?ref=${item.ref}&mode=${isEmpresaMode ? "empresa" : "maquinaria"}`)}
                      className="flex-1 text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase py-[10px] sm:py-[12px] lg:py-[14px] px-0 bg-[var(--vg-accent)] text-black border-2 border-[var(--vg-accent)] cursor-pointer transition-all duration-250 hover:bg-[var(--vg-bg)] hover:text-[var(--vg-text-primary)]"
                    >
                      {isEmpresaMode ? "Reservar Servicio" : "Comprar Equipo"}
                    </button>
                    <button
                      onClick={() => router.push(`/resumen-pedido?ref=${item.ref}&mode=${isEmpresaMode ? "empresa" : "maquinaria"}`)}
                      className="flex-1 text-[11px] sm:text-xs font-bold tracking-[0.08em] uppercase py-[10px] sm:py-[12px] lg:py-[14px] px-0 bg-transparent text-[var(--vg-text-primary)] border-2 border-[var(--vg-border)] cursor-pointer transition-all duration-250 hover:border-[var(--vg-accent)] hover:text-[var(--vg-accent)]"
                    >
                      {isEmpresaMode ? "Solicitar Jornada" : "Alquilar ahora"}
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>

      {filtered.length > 0 && (
        <section className="relative w-full py-20 bg-[var(--vg-bg)] border-b-2 border-[rgba(255,204,0,0.15)]">
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--vg-text-muted)] mb-5 tracking-[0.08em] uppercase">
              {filtered.length} {isEmpresaMode ? "servicios" : "equipos"} en catálogo
            </p>
            <Link
              href="/catalogo"
              className="text-[13px] font-bold tracking-[0.10em] uppercase py-[18px] px-12 bg-[var(--vg-accent)] text-black border-2 border-[var(--vg-accent)] cursor-pointer transition-all duration-250 inline-flex items-center gap-3 no-underline hover:bg-[var(--vg-bg)] hover:scale-[1.03]"
            >
              {isEmpresaMode ? "Ver todos los servicios" : "Ver catálogo completo"}
              <span className="text-xl leading-none">→</span>
            </Link>
          </div>
        </section>
      )}

      <section className="border-t-2 border-[rgba(255,204,0,0.15)] bg-[var(--vg-bg)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-[60px] sm:py-[80px] lg:py-[100px] grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 relative">
          <div>
            <div className="text-xs font-bold text-[#FFCC00] tracking-[0.18em] uppercase mb-5">NUESTRO EQUIPO</div>
            <h2 className="text-[clamp(2rem,3.5vw,3.2rem)] font-black tracking-[-0.03em] leading-[0.95] mt-0 mb-6 text-[var(--vg-text-primary)] max-w-[14ch]">
              Maquinaria oficial y servicios directos, sin intermediarios
            </h2>
            <p className="text-[1.05rem] font-medium leading-[1.7] text-[var(--vg-text-secondary)] max-w-[48ch] mt-0 mb-10">
              Nuestro equipo técnico especializado se encarga de todo. Desde el asesoramiento en la
              máquina adecuada hasta la ejecución de los servicios de limpieza industrial en tus
              instalaciones. Sin colaboradores externos, sin intermediarios.
            </p>
            <div className="flex flex-col gap-4">
              {[
                { label: "Equipo propio", desc: `${totalEquipos} técnicos certificados en plantilla` },
                { label: "Cobertura nacional", desc: "Servicios en toda la península · 48h" },
                { label: "Soporte directo", desc: "Respuesta en < 2h laborables · Sin terceros" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between items-center py-4 border-b-2 border-[var(--vg-border)]">
                  <span className="text-xs font-bold text-[var(--vg-text-muted)] tracking-[0.08em] uppercase">{stat.label}</span>
                  <span className="text-[15px] font-semibold text-[var(--vg-text-primary)]">{stat.desc}</span>
                </div>
              ))}
            </div>
            <Link
              href="/mi-cuenta"
              className="text-[13px] font-bold tracking-[0.10em] uppercase py-[18px] px-10 bg-[var(--vg-accent)] text-black border-2 border-black cursor-pointer transition-all duration-150 mt-10 inline-flex items-center gap-3 no-underline shadow-[5px_5px_0px_0px_#000000] hover:bg-black hover:text-white hover:shadow-[5px_5px_0px_0px_var(--vg-accent)]"
            >
              Acceder a Mi Cuenta
              <span className="text-xl leading-none">→</span>
            </Link>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-full h-[400px] bg-[var(--vg-bg-card)] border-2 border-[rgba(255,204,0,0.15)] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-5">
                <svg width="100%" height="100%" viewBox="0 0 400 400" className="absolute inset-0 opacity-15">
                  <defs><linearGradient id="grid-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFCC00" stopOpacity="0.3" /><stop offset="100%" stopColor="#FFCC00" stopOpacity="0" /></linearGradient></defs>
                  {Array.from({ length: 10 }).map((_, i) => (<line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="rgba(255,204,0,0.06)" strokeWidth="0.5" />))}
                  {Array.from({ length: 10 }).map((_, i) => (<line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="rgba(255,204,0,0.06)" strokeWidth="0.5" />))}
                </svg>
                <div className="w-[100px] h-[100px] border-3 border-[rgba(255,204,0,0.3)] flex items-center justify-center relative z-[1]">
                  <div className="w-10 h-10 bg-[#FFCC00] opacity-60" />
                </div>
                <div className="text-xs font-bold text-[var(--vg-text-muted)] tracking-[0.1em] uppercase relative z-[1]">Equipo Vapor&amp;Go · Operativo 24/7</div>
                <div className="absolute bottom-7 right-7 z-[1] text-right">
                  <div className="text-[11px] font-bold text-[#22C55E] tracking-[0.1em] uppercase">Online · Operativo</div>
                  <div className="flex gap-2 mt-[6px] justify-end">
                    {[1, 2, 3].map((i) => (<div key={i} className="w-[10px] h-[10px] bg-[#22C55E]" style={{ animation: `pulse-dot ${1.5 + i * 0.5}s ease-in-out infinite` }} />))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-[rgba(255,204,0,0.15)] bg-[var(--vg-bg)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-[60px] pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div>
              <div className="font-black text-[22px] tracking-[-0.03em] text-[var(--vg-text-primary)] mb-4">VAPOR&amp;GO</div>
              <p className="text-sm font-medium leading-[1.7] text-[var(--vg-text-secondary)] max-w-[36ch] mt-0">Venta de maquinaria profesional y servicios de limpieza industrial. {clientMode.searchPlaceholder}.</p>
            </div>
            {[
              { title: "Tienda", links: ["Catálogo Maquinaria", "Servicios Empresa", "Ofertas"] },
              { title: "Cuenta", links: ["Mi Cuenta", "Mis Pedidos", "Soporte"] },
              { title: "Legal", links: ["Aviso Legal", "Privacidad", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#FFCC00] mb-5">{col.title}</div>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <Link key={link} href={link === "Mi Cuenta" ? "/mi-cuenta" : link === "Catálogo Maquinaria" || link === "Servicios Empresa" ? "/" : link === "Mis Pedidos" || link === "Soporte" ? "/mi-cuenta" : "#"}
                      className="text-sm font-medium text-[var(--vg-text-secondary)] no-underline transition-colors duration-200 hover:text-[var(--vg-text-primary)]"
                    >
                      {link}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-[var(--vg-border)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-[11px] font-medium text-[var(--vg-text-muted)] tracking-[0.03em]">
              © 2026 {cfg.name} · Maquinaria profesional y servicios de limpieza industrial · Todos los precios en {cfg.currency.code}
            </div>
            <div className="text-[11px] font-medium text-[var(--vg-text-muted)] tracking-[0.08em] uppercase">
              {(isEmpresaMode ? "Servicios" : "Equipos")} registrados: {totalEquipos}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
