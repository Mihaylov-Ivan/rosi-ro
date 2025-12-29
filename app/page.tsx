"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Building2, FileCheck, ClipboardCheck, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { HomeContent } from "@/lib/data/home"

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch("/api/home")
        const data = await response.json()
        setContent(data)
      } catch (error) {
        console.error("Error loading home content:", error)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  if (loading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Зареждане...</div>
      </div>
    )
  }

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
            <Link href="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">
              Портфолио
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
              Контакти
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Contact Info */}
      <section className="bg-burgundy-light py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance">{content.hero.title}</h1>
          <p className="mb-4 text-2xl text-muted-foreground text-balance">{content.hero.subtitle}</p>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {content.hero.description}
          </p>
          <Link href="/portfolio">
            <Button size="lg" className="text-base">
              {content.hero.buttonText}
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-burgundy-dark py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-3xl font-bold text-center">{content.services.title}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {content.services.items.map((service, index) => {
              const icons = [Building2, FileCheck, ClipboardCheck]
              const Icon = icons[index] || Building2
              const iconBgClass = "bg-salmon"
              return (
                <div
                  key={service.id}
                  className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg"
                >
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${iconBgClass}`}>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{service.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-burgundy-light py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">{content.about.title}</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              {content.about.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`whitespace-pre-wrap ${index === content.about.paragraphs.length - 1 ? "font-medium" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">{content.footer.copyright}</p>
            <p className="text-sm text-muted-foreground">{content.footer.tagline}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
