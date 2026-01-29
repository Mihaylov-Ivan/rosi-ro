import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteTitle = "Rosy Ro (Роси Ро) ЕООД - Консултант строителен надзор"
const siteDescription =
  "Rosy Ro / Роси Ро ЕООД - професионални услуги за строителен надзор, одити и издаване на разрешителни за строителни обекти в гр. Хасково"

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "Rosy Ro",
    "Роси Ро",
    "Rosy Ro Ltd.",
    "Роси Ро ЕООД",
    "строителен надзор",
    "консултант строителен надзор",
    "Хасково",
    "строителни одити",
    "разрешителни строителство",
  ],
  generator: "v0.app",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "bg",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Роси Ро ЕООД",
    alternateName: ["Rosy Ro", "Rosy Ro Ltd.", "Роси Ро", "Роси Ро ЕООД"],
    description: siteDescription,
  }

  return (
    <html lang="bg">
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
