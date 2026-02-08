import { getHomeContent } from "@/lib/data/home"
import { toJsonLd } from "@/lib/jsonld"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://rosi-ro.vercel.app")

const siteName = "Роси Ро ЕООД"
const defaultTitle = "Rosy Ro (Роси Ро) ЕООД - Консултант строителен надзор Хасково"
const defaultDescription =
  "Rosy Ro / Роси Ро ЕООД - строителен надзор, проектиране, промяна на предназначението и консултации в Хасково. Професионални услуги за строителен надзор, одити и разрешителни за строителни обекти."

const defaultFacebookUrl = "https://www.facebook.com/profile.php?id=61586010500517&locale=bg_BG"

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let contact = { address: "", phone: "", email: "", facebook: defaultFacebookUrl }
  try {
    const content = await getHomeContent()
    contact = {
      address: content.contact.address,
      phone: content.contact.phone,
      email: content.contact.email,
      facebook: content.contact.facebook || defaultFacebookUrl,
    }
  } catch {
    // Fallback if data fetch fails; base JSON-LD without contact details
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: "Роси Ро ЕООД",
    alternateName: ["Rosy Ro", "Rosy Ro Ltd.", "Роси Ро", "Роси Ро ЕООД", "Rosy", "Роси", "РосиРо", "росиро", "RosyRO", "rosyrO"],
    description: defaultDescription,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/og.png`,
    ...(contact.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: contact.address,
        addressLocality: "Хасково",
        addressCountry: "BG",
      },
    }),
    ...(contact.phone && { telephone: contact.phone.replace(/\s/g, "") }),
    ...(contact.email && { email: contact.email }),
    sameAs: [contact.facebook],
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
