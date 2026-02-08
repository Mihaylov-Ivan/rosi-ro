import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Контакти - Роси Ро ЕООД | Строителен надзор Хасково",
  description:
    "Свържете се с Роси Ро ЕООД в Хасково за строителен надзор, проектиране, промяна на предназначението и консултации по строителство.",
  keywords: [
    "контакти Роси Ро",
    "строителен надзор Хасково контакт",
    "Роси Ро ЕООД Хасково",
    "консултант строителен надзор Хасково",
  ],
  openGraph: {
    title: "Контакти - Rosy Ro (Роси Ро) ЕООД | Хасково",
    description:
      "Контакти на Роси Ро ЕООД — строителен надзор, проектиране, консултации в Хасково.",
  },
}

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
