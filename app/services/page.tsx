"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { HomeContent } from "@/lib/data/home"

export default function Services() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/home")
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-8 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Роси Ро ЕООД Лого"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Начало
            </Link>
            <Link href="/services" className="text-sm font-medium text-primary">
              Услуги
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
              Контакти
            </Link>
          </nav>
        </div>
      </header>

      {/* SEO: keywords for findability (screen-reader only) */}
      <div className="sr-only" aria-hidden="true">
        Услуги: строителен надзор Хасково, проектиране, промяна на предназначението, консултации в Хасково. Консултации строителен надзор, проектиране строителство, промяна на предназначението Хасково. Роси Ро ЕООД.
      </div>

      {/* Services Header */}
      <section className="bg-bone-light py-8">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-balance">Услуги</h1>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-bone-base py-16">
        <div className="container mx-auto px-4">
          {loading || !content ? (
            <div className="py-12 text-center text-muted-foreground">Зареждане...</div>
          ) : (
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
              {content.services.items.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg min-w-0"
                >
                  <h3 className="mb-3 text-lg font-semibold break-words">{service.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              {content?.footer.copyright || "© 2025 Роси Ро ЕООД. Всички права запазени."}
            </p>
            <p className="text-sm text-muted-foreground">
              {content?.footer.tagline || "Консултант строителен надзор"}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

