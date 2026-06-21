"use client"

import React from "react"
import GlobalNav from "@/components/marketplace/GlobalNav"

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalNav />
      {children}
    </>
  )
}
