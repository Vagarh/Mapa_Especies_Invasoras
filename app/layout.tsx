import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mapa Interactivo de Especies Invasoras de Colombia",
  description:
    "Visualización interactiva de las especies invasoras presentes en Colombia. Datos de GBIF, SiB Colombia y Resolución 0067/2023 del Ministerio de Ambiente.",
  keywords: ["especies invasoras", "Colombia", "biodiversidad", "GBIF", "SiB Colombia", "mapa interactivo"],
  openGraph: {
    title: "Mapa Interactivo de Especies Invasoras de Colombia",
    description: "Explora las especies invasoras de Colombia en un mapa interactivo con fichas, filtros y línea de tiempo.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
