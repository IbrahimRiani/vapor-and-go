import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/src/context/AuthProvider";
import { AppProvider } from "@/src/context/AppContext";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "Vapor&Go — Marketplace B2B de Maquinaria Industrial",
  description: "Busca, compara y adquiere maquinaria de limpieza profesional. Marketplace B2B para equipos Kärcher, generadores de vapor y más.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("vg-theme");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){}})()`
        }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <AuthProvider>
            <ClientShell>{children}</ClientShell>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
