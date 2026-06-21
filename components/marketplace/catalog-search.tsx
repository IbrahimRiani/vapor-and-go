"use client"

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as THREE from "three"
import { marketplaceConfig } from "@/src/config/marketplace.config"
import { cn } from "@/lib/utils"

const cfg = marketplaceConfig
const { symbol } = cfg.currency
const { clientMode } = cfg.localization

const serviciosData = [
  { ref: "SVC-HDS", name: "Servicio de Desengrasado y Alta Presión HDS", category: "Limpieza Técnica", status: "Disponible", price: 25000, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "SVC-V4", name: "Tratamiento de Desinfección Térmica por Vapor V4", category: "Sanitaria e Alimentaria", status: "Disponible", price: 38000, year: 2025, duration: "1 jornada", staff: "2 técnicos" },
  { ref: "SVC-HD", name: "Limpieza de Fachadas y Estructuras HD", category: "Mantenimiento Industrial", status: "Stock bajo", price: 19000, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "SVC-SS", name: "Aspirado y Saneamiento de Suelos Continuos", category: "Logística y Almacenes", status: "Disponible", price: 22000, year: 2025, duration: "1 jornada", staff: "1 operario" },
]

const maquinariaData = [
  { ref: "KS-07P", name: "Kärcher K7 Premium", category: "Hidrolimpiadoras", status: "Disponible", price: 12900, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "VGS-2000", name: "Generador de Vapor 2000W", category: "Generadores", status: "Disponible", price: 34500, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "KS-SCV", name: "Kärcher SC 5 EasyFix", category: "Generadores", status: "Stock bajo", price: 8900, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "VGS-HP", name: "Hidrolimpiadora Profesional HP", category: "Hidrolimpiadoras", status: "Disponible", price: 28500, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "KS-BR", name: "Kärcher BR 30/4 C", category: "Fregadoras", status: "Disponible", price: 15600, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "KS-IV", name: "Kärcher IV 60/36", category: "Aspiradoras", status: "Disponible", price: 23000, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "VGS-ST", name: "Equipo de Vapor Seco", category: "Generadores", status: "Disponible", price: 19800, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "KS-OC", name: "Kärcher OC 3", category: "Lavado exterior", status: "Disponible", price: 4500, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "VGS-PRO", name: "Generador Vapor PRO-5", category: "Generadores", status: "Disponible", price: 52000, year: 2025, duration: "1 jornada", staff: "2 técnicos" },
  { ref: "KS-SV", name: "Kärcher SE 6.500", category: "Aspiradoras", status: "Disponible", price: 17900, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "KS-FC", name: "Kärcher FC 7 Premium", category: "Limpiacristales", status: "Disponible", price: 6800, year: 2025, duration: "1 jornada", staff: "1 operario" },
  { ref: "KS-K7", name: "Kärcher K7 Compact", category: "Hidrolimpiadoras", status: "Disponible", price: 11200, year: 2025, duration: "1 jornada", staff: "1 operario" },
]

const categoriasServicios = ["Todas", "Limpieza Técnica", "Sanitaria e Alimentaria", "Mantenimiento Industrial", "Logística y Almacenes"]
const categoriasMaquinaria = ["Todas", "Hidrolimpiadoras", "Generadores", "Fregadoras", "Aspiradoras", "Limpiacristales", "Lavado exterior"]

const statusColor: Record<string, string> = {
  Disponible: "#22C55E",
  "Stock bajo": "#F59E0B",
  Agotado: "#EF4444",
}

function VaporParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const particlesGeo = new THREE.BufferGeometry()
    const count = 400
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10
      sizes[i] = Math.random() * 3 + 0.5
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particlesGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    const texture = (() => {
      const c = document.createElement("canvas")
      c.width = 32
      c.height = 32
      const ctx = c.getContext("2d")!
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
      grad.addColorStop(0, "rgba(255,255,255,0.6)")
      grad.addColorStop(0.3, "rgba(200,230,255,0.3)")
      grad.addColorStop(1, "rgba(255,255,255,0)")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 32, 32)
      return new THREE.CanvasTexture(c)
    })()

    const material = new THREE.PointsMaterial({
      size: 1.2,
      map: texture,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: "#FFCC00",
    })

    const particles = new THREE.Points(particlesGeo, material)
    scene.add(particles)

    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    const clock = new THREE.Clock()

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const positions2 = particles.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        positions2[i * 3 + 1] += Math.sin(elapsed * 0.3 + i) * 0.004
        positions2[i * 3] += Math.cos(elapsed * 0.2 + i * 0.5) * 0.003
      }
      particles.geometry.attributes.position.needsUpdate = true

      particles.rotation.y = elapsed * 0.01 + mouseX * 0.02
      particles.rotation.x = Math.sin(elapsed * 0.005) * 0.1 + mouseY * 0.01

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    const animId = requestAnimationFrame(animate)

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      particlesGeo.dispose()
      material.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30" />
}

function ScrollReveal({ children, className, delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function CatalogSearch() {
  const [viewMode, setViewMode] = useState<"maquinaria" | "servicios">("maquinaria")
  const [categoryFilter, setCategoryFilter] = useState("Todas")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("name")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const categories = viewMode === "maquinaria" ? categoriasMaquinaria : categoriasServicios

  const switchMode = (mode: "maquinaria" | "servicios") => {
    setViewMode(mode)
    setCategoryFilter("Todas")
    setStatusFilter([])
    setPriceRange([0, 60000])
    setSearchQuery("")
    setSortBy("name")
  }

  const clearFilters = useCallback(() => {
    setCategoryFilter("Todas")
    setStatusFilter([])
    setPriceRange([0, 60000])
    setSearchQuery("")
    setSortBy("name")
  }, [])

  const activeData = viewMode === "maquinaria" ? maquinariaData : serviciosData

  const results = useMemo(() => {
    let data = [...activeData]

    if (categoryFilter !== "Todas") {
      data = data.filter((e) => e.category === categoryFilter)
    }

    if (statusFilter.length > 0) {
      data = data.filter((e) => statusFilter.includes(e.status))
    }

    data = data.filter(
      (e) => e.price >= priceRange[0] && e.price <= priceRange[1]
    )

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.ref.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
    }

    if (sortBy === "price-asc") data.sort((a, b) => a.price - b.price)
    else if (sortBy === "price-desc") data.sort((a, b) => b.price - a.price)
    else data.sort((a, b) => a.name.localeCompare(b.name))

    return data
  }, [activeData, categoryFilter, statusFilter, priceRange, searchQuery, sortBy])

  const activeFilterCount =
    (categoryFilter !== "Todas" ? 1 : 0) +
    statusFilter.length +
    (priceRange[0] > 0 || priceRange[1] < 60000 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0)

  const formatPrice = (cents: number) =>
    `${symbol}${(cents / 100).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const statusMeta: Record<string, { label: string, color: string }> = {
    Disponible: { label: "Disponible", color: "#22C55E" },
    "Stock bajo": { label: "Stock bajo", color: "#F59E0B" },
    Agotado: { label: "Agotado", color: "#EF4444" },
  }

  return (
    <div className="bg-[var(--vg-bg)] text-[var(--vg-text-primary)] min-h-screen flex pt-16">
      <style>{`
        .card-catalog { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-catalog:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0px 0px #000000; }
        @media (max-width: 1024px) {
          .sidebar-panel {
            position: fixed; top: 64px; left: -320px; bottom: 0; width: 300px; z-index: 9997;
            transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .sidebar-panel.open { left: 0; }
        }
      `}</style>

      <VaporParticles />

      <div
        className="fixed inset-0 z-[9996]"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className="sidebar-panel w-[300px] min-w-[300px] h-[calc(100vh-64px)] sticky top-16 bg-[var(--vg-bg-card)] border-r-2 border-[var(--vg-border)] flex flex-col overflow-hidden z-[9995] hidden lg:flex"
      >
        <div className="px-6 py-7 pb-5 border-b-2 border-[var(--vg-border)]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={clientMode.searchPlaceholder}
              className="w-full p-3 pl-10 bg-[var(--vg-bg)] border-2 border-[var(--vg-border)] text-sm font-medium text-[var(--vg-text-primary)] outline-none box-border"
            />
            <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[var(--vg-text-secondary)] text-sm font-semibold">
              ⌕
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 pb-6">
          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--vg-text-secondary)] mb-3.5">
            Categorías
          </div>
          <div className="flex flex-col gap-[2px] mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[13px] text-left px-[14px] py-[10px] border-none cursor-pointer transition-all duration-200 tracking-[0.02em] border-l-3 ${
                  categoryFilter === cat
                    ? "bg-[#FFFBEB] text-black font-bold border-l-[#FFCC00]"
                    : "bg-transparent text-[#475569] font-medium border-l-transparent hover:bg-[var(--vg-bg)] hover:text-black focus:bg-[var(--vg-bg)] focus:text-black active:bg-[var(--vg-bg)] active:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--vg-text-secondary)] mb-3.5">
            Estado
          </div>
          <div className="flex flex-col gap-2 mb-8">
            {Object.entries(statusMeta).map(([key, meta]) => (
              <label
                key={key}
                className="flex items-center gap-3 cursor-pointer py-[6px] text-sm font-medium transition-colors duration-200"
                style={{ color: statusFilter.includes(key) ? "#000000" : "#475569" }}
              >
                <span
                  className="w-[18px] h-[18px] flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    border: statusFilter.includes(key) ? "2px solid #FFCC00" : "2px solid var(--vg-border)",
                    background: statusFilter.includes(key) ? "#FFCC00" : "transparent",
                  }}
                >
                  {statusFilter.includes(key) && (
                    <span className="text-black text-[10px] font-extrabold">✓</span>
                  )}
                </span>
                <span className="w-2 h-2 shrink-0" style={{ background: meta.color }} />
                {meta.label}
              </label>
            ))}
          </div>

          <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--vg-text-secondary)] mb-3.5">
            Rango de precio
          </div>
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-[var(--vg-text-secondary)] mb-[10px]">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
            <div className="relative h-[6px] bg-[var(--vg-border)]">
              <div
                className="absolute top-0 bottom-0 bg-[#FFCC00]"
                style={{
                  left: `${(priceRange[0] / 60000) * 100}%`,
                  right: `${100 - (priceRange[1] / 60000) * 100}%`,
                }}
              />
            </div>
            <div className="flex gap-2 mt-[10px]">
              <input
                type="range"
                min={0}
                max={60000}
                step={1000}
                value={priceRange[0]}
                onChange={(e) => setPriceRange(([, max]) => [Math.min(Number(e.target.value), max - 1000), max])}
                className="w-full accent-[#FFCC00]"
                style={{ height: 1, background: "transparent" }}
              />
              <input
                type="range"
                min={0}
                max={60000}
                step={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange(([min]) => [min, Math.max(Number(e.target.value), min + 1000)])}
                className="w-full accent-[#FFCC00]"
                style={{ height: 1, background: "transparent" }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t-2 border-[var(--vg-border)]">
          <button
            onClick={clearFilters}
            className={`w-full py-[14px] text-xs font-bold tracking-[0.10em] uppercase cursor-pointer transition-all duration-150 ${
              activeFilterCount > 0
                ? "bg-[#FFCC00] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000]"
                : "bg-transparent text-[#475569] border-2 border-[var(--vg-border)] shadow-none hover:bg-[#FFCC00] hover:text-black hover:border-black hover:shadow-[4px_4px_0px_0px_#000000]"
            }`}
          >
            Limpiar filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </button>

          <Link
            href="/mi-cuenta"
            className="block text-center mt-3.5 text-[13px] font-bold tracking-[0.05em] no-underline py-[14px] px-0 transition-all duration-150 bg-[#FFCC00] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_#FFCC00]"
          >
            Mi Cuenta →
          </Link>
        </div>
      </aside>

      <main className="flex-1 min-w-0 relative z-[1]">
        <div className="sticky top-16 z-10 px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between"
          style={{
            background: "color-mix(in srgb, var(--vg-bg) 97%, transparent)",
            backdropFilter: "blur(12px) saturate(1.2)",
            borderBottom: "2px solid var(--vg-border)",
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden bg-transparent border-2 border-[var(--vg-border)] text-[var(--vg-text-secondary)] px-3 py-2 cursor-pointer text-base font-bold"
            >
              ≡
            </button>

            <button
              onClick={() => switchMode("maquinaria")}
              className="text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-[6px] cursor-pointer transition-all duration-150 shrink-0"
              style={{
                background: viewMode === "maquinaria" ? "var(--vg-accent)" : "transparent",
                color: viewMode === "maquinaria" ? "#000000" : "var(--vg-text-secondary)",
                border: viewMode === "maquinaria" ? "2px solid var(--vg-accent)" : "2px solid var(--vg-border)",
              }}
            >
              Máquinas
            </button>

            <button
              onClick={() => switchMode("servicios")}
              className="text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-[6px] cursor-pointer transition-all duration-150 shrink-0"
              style={{
                background: viewMode === "servicios" ? "var(--vg-accent)" : "transparent",
                color: viewMode === "servicios" ? "#000000" : "var(--vg-text-secondary)",
                border: viewMode === "servicios" ? "2px solid var(--vg-accent)" : "2px solid var(--vg-border)",
              }}
            >
              Servicios
            </button>

            <div className="flex items-center gap-[10px]">
              <div className="w-2 h-2 bg-[#22C55E]"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="text-base font-bold text-[var(--vg-text-primary)] tracking-[0.02em]">
                {results.length}
              </span>
              <span className="text-[15px] font-medium text-[var(--vg-text-secondary)]">
                resultados encontrados
              </span>
              {activeFilterCount > 0 && (
                <span className="text-[11px] font-bold text-black bg-[#FFCC00] px-3 py-1 border-2 border-black tracking-[0.05em]">
                  {activeFilterCount} filtros
                </span>
              )}
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-xs font-semibold px-4 py-[10px] bg-[var(--vg-bg-card)] text-[var(--vg-text-secondary)] border-2 border-[var(--vg-border)] cursor-pointer tracking-[0.05em] uppercase"
          >
            <option value="name">Nombre A–Z</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
          </select>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[100px] px-5 text-center">
              <div className="text-4xl font-black text-[var(--vg-text-primary)] mb-4 tracking-[-0.03em]">
                Sin resultados
              </div>
              <p className="text-base font-medium text-[var(--vg-text-secondary)] max-w-[40ch] leading-[1.6]">
                No encontramos resultados con esos filtros. Prueba a ajustar los criterios de búsqueda.
              </p>
              <button
                onClick={clearFilters}
                className="mt-8 text-xs font-bold px-8 py-[14px] cursor-pointer tracking-[0.10em] uppercase transition-all duration-150 bg-[#FFCC00] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-black hover:text-white hover:shadow-[4px_4px_0px_0px_#FFCC00]"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7">
              {results.map((item, i) => (
                <ScrollReveal key={item.ref} delay={Math.min(i * 40, 400)}>
                  <div className="card-catalog bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] cursor-pointer relative overflow-hidden shadow-[6px_6px_0px_0px_color-mix(in_srgb,var(--vg-text-primary)_10%,transparent)]"
                  >
                    <div className="px-6 pb-5 pt-6 border-b-2 border-[var(--vg-border)]">
                      <div className="flex justify-between items-start mb-[10px]">
                        <span className="text-xs font-bold text-[var(--vg-text-secondary)] tracking-[0.03em]">
                          {item.ref}
                        </span>
                        <span className="text-[11px] font-semibold text-[var(--vg-text-secondary)] tracking-[0.05em]">
                          {item.duration}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-[var(--vg-text-primary)] my-0 mb-[10px] tracking-[-0.02em] leading-[1.15]">
                        {item.name}
                      </h3>

                      <div className="flex items-center gap-[10px] flex-wrap">
                        <span className="text-[11px] font-semibold text-[var(--vg-text-secondary)] bg-[var(--vg-bg-card)] px-[10px] py-1 border border-[var(--vg-border)] tracking-[0.04em]">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-[6px]">
                          <div className="w-[6px] h-[6px]" style={{
                            background: statusColor[item.status] || "#475569",
                            animation: item.status === "Disponible" ? "pulse-dot 2s ease-in-out infinite" : "none",
                          }} />
                          <span className="text-[11px] font-bold" style={{ color: statusColor[item.status] || "#475569" }}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-5 flex justify-between items-center">
                      <div className="flex gap-5">
                        <div>
                          <div className="text-[9px] font-bold text-[var(--vg-text-secondary)] tracking-[0.08em] uppercase mb-[2px]">Duración</div>
                          <div className="text-[13px] font-bold text-[var(--vg-text-primary)]">{item.duration}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-[var(--vg-text-secondary)] tracking-[0.08em] uppercase mb-[2px]">Personal</div>
                          <div className="text-[13px] font-bold text-[var(--vg-text-primary)]">{item.staff}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-[var(--vg-text-primary)] tracking-[-0.02em]">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-[10px] font-semibold text-[var(--vg-text-secondary)] tracking-[0.04em]">
                          {cfg.currency.code} · /jornada
                        </div>
                      </div>
                    </div>

                    <div className="border-t-2 border-[var(--vg-border)] px-6 py-[14px] flex gap-[10px]">
                      <button
                        onClick={() => router.push(`/resumen-pedido?ref=${item.ref}&mode=empresa&action=reservar`)}
                        className="flex-1 text-xs font-bold tracking-[0.06em] uppercase py-[14px] px-0 cursor-pointer transition-all duration-150 bg-[var(--vg-accent)] text-black border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:bg-[var(--vg-text-primary)] hover:text-[var(--vg-bg)] hover:shadow-[3px_3px_0px_0px_var(--vg-accent)]"
                      >
                        Reservar Servicio
                      </button>
                      <button
                        onClick={() => router.push(`/resumen-pedido?ref=${item.ref}&mode=empresa&action=solicitar`)}
                        className="flex-1 text-xs font-bold tracking-[0.06em] uppercase py-[14px] px-0 bg-transparent text-[var(--vg-text-primary)] border-2 border-[var(--vg-border)] cursor-pointer transition-all duration-150 hover:bg-[var(--vg-text-primary)] hover:text-[var(--vg-bg)]"
                      >
                        Contratar Jornada
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <ScrollReveal delay={200}>
              <div className="flex justify-center items-center gap-[10px] py-14 pb-8">
                <span className="text-[13px] font-bold text-[var(--vg-text-primary)] border-b-2 border-[#FFCC00] pb-1">
                  {1}
                </span>
                <span className="text-[13px] font-semibold text-[var(--vg-text-secondary)]">2</span>
                <span className="text-[13px] font-semibold text-[var(--vg-text-secondary)]">3</span>
                <span className="text-[var(--vg-text-secondary)] text-[13px] font-semibold">…</span>
                <span className="text-[13px] font-semibold text-[var(--vg-text-secondary)]">
                  {Math.ceil(results.length / 12)}
                </span>
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>
    </div>
  )
}
