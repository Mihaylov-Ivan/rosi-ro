"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, FileCheck, ClipboardCheck, Mail, Phone, Save, LogOut, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { HomeContent } from "@/lib/data/home"

export default function AdminHome() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadContent()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/check")
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
      if (!data.authenticated) {
        router.push("/admin/login")
      }
    } catch (error) {
      router.push("/admin/login")
    }
  }

  const loadContent = async () => {
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

  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    try {
      const response = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (!response.ok) {
        throw new Error("Failed to save")
      }

      alert("Home page content saved successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const updateHero = (field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    })
  }

  const updateService = (index: number, field: string, value: string) => {
    if (!content) return
    const newServices = [...content.services.items]
    newServices[index] = { ...newServices[index], [field]: value }
    setContent({
      ...content,
      services: { ...content.services, items: newServices },
    })
  }

  const updateAbout = (index: number, value: string) => {
    if (!content) return
    const newParagraphs = [...content.about.paragraphs]
    newParagraphs[index] = value
    setContent({
      ...content,
      about: { ...content.about, paragraphs: newParagraphs },
    })
  }

  const updateContact = (field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      contact: { ...content.contact, [field]: value },
    })
  }

  const updateFooter = (field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      footer: { ...content.footer, [field]: value },
    })
  }

  if (loading || !isAuthenticated || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Зареждане...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Controls - Floating */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
          className="shadow-lg"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Запазване..." : "Запазване"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/portfolio")}
          size="sm"
          className="shadow-lg"
        >
          Портфолио
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/contacts")}
          size="sm"
          className="shadow-lg"
        >
          Контакти
        </Button>
        <Button
          variant="outline"
          onClick={handleLogout}
          size="sm"
          className="shadow-lg"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Изход
        </Button>
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-8 px-4 py-4">
          <div className="flex items-center gap-3 cursor-default">
            <Image
              src="/images/logo.png"
              alt="Роси Ро ЕООД Лого"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <nav className="flex gap-6">
            <span
              className="text-sm font-medium hover:text-primary transition-colors cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              Начало
            </span>
            <span
              className="text-sm font-medium hover:text-primary transition-colors cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              Портфолио
            </span>
            <span
              className="text-sm font-medium text-primary cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              Контакти
            </span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-burgundy-light py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Input
              value={content.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
              className="mb-6 text-5xl font-bold leading-tight border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded"
            />
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="mb-4 text-2xl text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded"
            />
            <textarea
              value={content.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              className="mb-8 w-full text-lg text-muted-foreground leading-relaxed border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded resize-none whitespace-pre-wrap"
              rows={3}
            />
            <Button
              size="lg"
              className="text-base relative cursor-text"
              onClick={(e) => e.preventDefault()}
              asChild={false}
            >
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateHero("buttonText", e.currentTarget.textContent || "")}
                className="outline-none focus:ring-2 focus:ring-primary-foreground rounded px-1"
              >
                {content.hero.buttonText}
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-burgundy-dark py-16">
        <div className="container mx-auto px-4">
          <Input
            value={content.services.title}
            onChange={(e) =>
              setContent({
                ...content,
                services: { ...content.services, title: e.target.value },
              })
            }
            className="mb-12 text-3xl font-bold text-center border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
          />
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
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(index, "title", e.target.value)}
                    className="mb-3 text-xl font-semibold border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
                  />
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, "description", e.target.value)}
                    className="text-muted-foreground leading-relaxed border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full resize-none whitespace-pre-wrap"
                    rows={4}
                  />
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
            <Input
              value={content.about.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, title: e.target.value },
                })
              }
              className="mb-8 text-3xl font-bold border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
            />
            <div className="space-y-4 text-lg leading-relaxed">
              {content.about.paragraphs.map((paragraph, index) => (
                <textarea
                  key={index}
                  value={paragraph}
                  onChange={(e) => updateAbout(index, e.target.value)}
                  className={`w-full border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded resize-none whitespace-pre-wrap ${index === content.about.paragraphs.length - 1 ? "font-medium" : ""
                    }`}
                  rows={3}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Input
              value={content.footer.copyright}
              onChange={(e) => updateFooter("copyright", e.target.value)}
              className="text-sm text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full md:w-auto"
            />
            <Input
              value={content.footer.tagline}
              onChange={(e) => updateFooter("tagline", e.target.value)}
              className="text-sm text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full md:w-auto"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
