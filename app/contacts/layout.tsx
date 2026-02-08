import type { Metadata } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://rosi-ro.vercel.app")

export const metadata: Metadata = {
  title: "Контакти - Строителен надзор Хасково",
  description:
    "Свържете се с Роси Ро ЕООД в Хасково за строителен надзор, проектиране, промяна на предназначението и консултации по строителство.",
  keywords: [
    "контакти Роси Ро",
    "строителен надзор Хасково контакт",
    "Роси Ро ЕООД Хасково",
    "консултант строителен надзор Хасково",
  ],
  alternates: {
    canonical: "/contacts",
  },
  openGraph: {
    title: "Контакти - Rosy Ro (Роси Ро) ЕООД | Хасково",
    description:
      "Контакти на Роси Ро ЕООД — строителен надзор, проектиране, консултации в Хасково.",
    url: `${siteUrl}/contacts`,
    images: [{ url: "/og.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакти - Rosy Ro (Роси Ро) ЕООД | Хасково",
    description:
      "Контакти на Роси Ро ЕООД — строителен надзор, проектиране, консултации в Хасково.",
    images: ["/og.png"],
  },
}

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
