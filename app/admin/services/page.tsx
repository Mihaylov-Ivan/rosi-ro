"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { HomeContent } from "@/lib/data/home"
import { LogOut, Save } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminServices() {
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

      alert("Services saved successfully!")
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

  const updateService = (index: number, field: string, value: string) => {
    if (!content) return
    const newServices = [...content.services.items]
    newServices[index] = { ...newServices[index], [field]: value }
    setContent({
      ...content,
      services: { ...content.services, items: newServices },
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
          onClick={() => router.push("/admin/home")}
          size="sm"
          className="shadow-lg"
        >
          Начало
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
              className="text-sm font-medium text-primary cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              Услуги
            </span>
            <span
              className="text-sm font-medium hover:text-primary transition-colors cursor-default"
              onClick={(e) => e.preventDefault()}
            >
              Контакти
            </span>
          </nav>
        </div>
      </header>

      {/* Services Header */}
      <section className="bg-bone-light py-8">
        <div className="container mx-auto px-4">
          <Input
            value={content.services.title}
            onChange={(e) =>
              setContent({
                ...content,
                services: { ...content.services, title: e.target.value },
              })
            }
            className="mb-4 text-4xl font-bold text-balance border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
          />
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-bone-base py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {content.services.items.map((service, index) => (
              <div
                key={service.id}
                className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg min-w-0"
              >
                <Input
                  value={service.title}
                  onChange={(e) => updateService(index, "title", e.target.value)}
                  className="mb-3 text-lg font-semibold border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full break-words"
                />
                <textarea
                  value={service.description}
                  onChange={(e) => updateService(index, "description", e.target.value)}
                  className="text-base text-muted-foreground leading-relaxed border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full resize-none whitespace-pre-wrap break-words"
                  rows={6}
                />
              </div>
            ))}
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

