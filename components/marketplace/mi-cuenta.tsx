"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/src/context/AuthProvider"

function DataGridParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 4, 22)
    camera.lookAt(0, 0, 0)

    const cols = 24, rows = 14, spacing = 1.2
    const count = cols * rows
    const positions = new Float32Array(count * 3)
    const opacities = new Float32Array(count)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c
        positions[i * 3] = (c - cols / 2) * spacing
        positions[i * 3 + 1] = (r - rows / 2) * spacing
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
        opacities[i] = Math.random() * 0.5 + 0.15
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1))

    const tex = (() => {
      const c = document.createElement("canvas")
      c.width = 16; c.height = 16
      const ctx = c.getContext("2d")!
      const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
      g.addColorStop(0, "rgba(255,255,255,0.9)")
      g.addColorStop(0.4, "rgba(255,204,0,0.5)")
      g.addColorStop(1, "rgba(255,255,255,0)")
      ctx.fillStyle = g; ctx.fillRect(0, 0, 16, 16)
      return new THREE.CanvasTexture(c)
    })()

    const material = new THREE.PointsMaterial({
      size: 0.9, map: tex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
      color: "#FFCC00", opacity: 0.2,
    })

    const particles = new THREE.Points(geo, material)
    scene.add(particles)

    let mouseX = 0, mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    const clock = new THREE.Clock()
    const baseOpacities = new Float32Array(opacities)

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      const posArr = particles.geometry.attributes.position.array as Float32Array
      const opArr = particles.geometry.attributes.opacity.array as Float32Array
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          posArr[i * 3 + 2] = Math.sin(elapsed * 0.6 + c * 0.3 + r * 0.2) * 0.15
          opArr[i] = baseOpacities[i] + Math.sin(elapsed * 0.4 + c * 0.25 + r * 0.2) * 0.12
        }
      }
      particles.geometry.attributes.position.needsUpdate = true
      particles.geometry.attributes.opacity.needsUpdate = true
      particles.rotation.y = elapsed * 0.008 + mouseX * 0.03
      particles.rotation.x = Math.sin(elapsed * 0.003) * 0.05 + mouseY * 0.02
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    const animId = requestAnimationFrame(animate)
    const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight) }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose(); geo.dispose(); material.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30" />
}

function StatusBadge({ status, activeColor, activeBg }: { status: string; activeColor: string; activeBg: string }) {
  const isActive = status === "Activo" || status === "Confirmado"
  const color = isActive ? activeColor : (activeColor === "#22C55E" ? "#F59E0B" : "#FFCC00")
  const bg = isActive ? activeBg : (activeBg === "rgba(34,197,94,0.1)" ? "rgba(245,158,11,0.1)" : "rgba(255,204,0,0.1)")
  return (
    <span
      className="text-[11px] font-bold tracking-[0.06em] uppercase px-[10px] py-1"
      style={{ color, border: `2px solid ${color}`, background: bg }}
    >
      {status}
    </span>
  )
}

function LoadingSkeleton() {
  return (
    <div className="bg-[var(--vg-bg)] text-[var(--vg-text-primary)] min-h-screen relative flex items-center justify-center">
      <div className="text-sm font-medium text-[var(--vg-text-secondary)] animate-pulse">Cargando tu cuenta...</div>
    </div>
  )
}

export default function MiCuenta() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth")
    }
  }, [user, loading, router])

  if (loading) return <LoadingSkeleton />
  if (!user) return null

  const userName: string = user.user_metadata?.display_name || user.email?.split("@")[0] || "Usuario"
  const userEmail: string = user.email || ""
  const userDocId: string = user.user_metadata?.document_id || "—"
  return (
    <div className="bg-[var(--vg-bg)] text-[var(--vg-text-primary)] min-h-screen relative">
      <DataGridParticles />

      <div className="relative z-[2] max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-[100px] sm:pt-[112px] lg:pt-[124px] pb-[48px] sm:pb-[64px] lg:pb-[80px]">
        <div className="mb-12">
          <div className="text-xs font-bold text-[#FFCC00] tracking-[0.18em] uppercase mb-3">MI CUENTA</div>
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-black tracking-[-0.03em] leading-[0.95] mt-0 mb-3 text-[var(--vg-text-primary)]">
            Bienvenido, {userName}
          </h1>
          <p className="text-base font-medium text-[var(--vg-text-secondary)] mt-0">
            Aquí puedes ver tus máquinas alquiladas, servicios contratados y gestionar tus datos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {[
            { label: "Equipos activos", value: "3", sub: "Alquileres en curso" },
            { label: "Servicios contratados", value: "2", sub: "Jornadas programadas" },
            { label: "Próximo pago", value: "€380,00", sub: "Desinfección V4 · 15 jul" },
            { label: "Historial total", value: "€2.847", sub: "Desde enero 2026" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] px-6 py-7 relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FFCC00]" />
              <div className="text-[10px] font-bold text-[var(--vg-text-muted)] tracking-[0.1em] uppercase mb-2">{kpi.label}</div>
              <div className="text-[28px] font-black text-[var(--vg-text-primary)] tracking-[-0.02em] mb-1">{kpi.value}</div>
              <div className="text-[13px] font-medium text-[var(--vg-text-muted)]">{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          <div className="bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] px-6 sm:px-7 py-8 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FFCC00]" />
            <div className="text-[11px] font-bold text-[#FFCC00] tracking-[0.12em] uppercase mb-5">Equipos en alquiler</div>
            {[
              { name: "Kärcher K7 Premium", ref: "KS-07P", status: "Activo", until: "30 jun 2026" },
              { name: "Generador Vapor 2000W", ref: "VGS-2000", status: "Activo", until: "15 jul 2026" },
              { name: "Kärcher BR 30/4 C", ref: "KS-BR", status: "Finalizando", until: "22 jun 2026" },
            ].map((eq) => (
              <div key={eq.ref} className="flex justify-between items-center py-[14px] border-b border-[var(--vg-border)]">
                <div>
                  <div className="text-sm font-bold text-[var(--vg-text-primary)] mb-[2px]">{eq.name}</div>
                  <div className="text-[11px] font-medium text-[var(--vg-text-muted)]">{eq.ref} · Hasta {eq.until}</div>
                </div>
                <StatusBadge status={eq.status} activeColor="#22C55E" activeBg="rgba(34,197,94,0.1)" />
              </div>
            ))}
          </div>

          <div className="bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] px-6 sm:px-7 py-8 relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FFCC00]" />
            <div className="text-[11px] font-bold text-[#FFCC00] tracking-[0.12em] uppercase mb-5">Servicios de limpieza</div>
            {[
              { name: "Desengrasado HDS", ref: "SVC-HDS", date: "28 jun 2026", status: "Confirmado" },
              { name: "Desinfección Térmica V4", ref: "SVC-V4", date: "5 jul 2026", status: "Pendiente" },
            ].map((s) => (
              <div key={s.ref} className="flex justify-between items-center py-[14px] border-b border-[var(--vg-border)]">
                <div>
                  <div className="text-sm font-bold text-[var(--vg-text-primary)] mb-[2px]">{s.name}</div>
                  <div className="text-[11px] font-medium text-[var(--vg-text-muted)]">{s.ref} · {s.date}</div>
                </div>
                <StatusBadge status={s.status} activeColor="#22C55E" activeBg="rgba(34,197,94,0.1)" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--vg-bg-card)] border-2 border-[var(--vg-border)] px-6 sm:px-7 py-8 relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FFCC00]" />
          <div className="text-[11px] font-bold text-[#FFCC00] tracking-[0.12em] uppercase mb-5">Datos de la cuenta</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: "Titular", value: userName },
              { label: "Email", value: userEmail },
              { label: "DNI / NIF", value: userDocId },
            ].map((d) => (
              <div key={d.label}>
                <div className="text-[10px] font-bold text-[rgba(255,255,255,0.3)] tracking-[0.08em] uppercase mb-2">{d.label}</div>
                <div className="text-sm font-semibold text-[var(--vg-text-primary)] whitespace-pre-line">{d.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-[var(--vg-border)] flex justify-between items-center">
            <Link href="/auth" className="text-xs font-bold text-[var(--vg-text-secondary)] no-underline tracking-[0.06em] transition-colors duration-200 hover:text-[#FFCC00]">
              Editar datos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
