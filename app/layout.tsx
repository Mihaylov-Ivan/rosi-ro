import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { toJsonLd } from "@/lib/jsonld"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://rosi-ro.vercel.app")

const siteName = "Роси Ро ЕООД"
const defaultTitle = "Rosy Ro (Роси Ро) ЕООД - Консултант строителен надзор"
const defaultDescription =
  "Rosy Ro / Роси Ро ЕООД - строителен надзор, проектиране, промяна на предназначението и консултации в Хасково. Професионални услуги за строителен надзор, одити и разрешителни за строителни обекти."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    locale: "bg_BG",
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: "Роси Ро ЕООД",
    alternateName: ["Rosy Ro", "Rosy Ro Ltd.", "Роси Ро", "Роси Ро ЕООД", "Rosy", "Роси", "РосиРо", "росиро", "RosyRO", "rosyrO"],
    description: defaultDescription,
    url: siteUrl,
    areaServed: {
      "@type": "City",
      name: "Хасково",
      "@id": "https://www.wikidata.org/wiki/Q1845",
    },
    serviceType: [
      "Строителен надзор",
      "Консултант строителен надзор",
      "Проектиране",
      "Промяна на предназначението",
      "Консултации по строителство",
      "Строителни одити",
      "Разрешителни за строителство",
    ],
    knowsAbout: [
      "строителен надзор",
      "проектиране",
      "промяна на предназначението",
      "консултации",
      "Хасково",
    ],
  }

  return (
    <html lang="bg">
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
