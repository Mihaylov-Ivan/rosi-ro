import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://rosi-ro.vercel.app")

export const metadata: Metadata = {
  title: "Услуги - Строителен надзор, проектиране, консултации",
  description:
    "Услуги в Хасково: строителен надзор, проектиране, промяна на предназначението, консултации по строителство. Роси Ро ЕООД — консултант строителен надзор.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Услуги - Строителен надзор, проектиране, консултации",
    description:
      "Услуги: строителен надзор, проектиране, промяна на предназначението, консултации в Хасково. Роси Ро ЕООД.",
    url: `${siteUrl}/services`,
    images: [{ url: "/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Услуги - Строителен надзор, проектиране, консултации",
    description:
      "Услуги: строителен надзор, проектиране, промяна на предназначението, консултации в Хасково. Роси Ро ЕООД.",
    images: ["/og.png"],
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
