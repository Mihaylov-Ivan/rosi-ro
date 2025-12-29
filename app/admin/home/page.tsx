"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Save } from "lucide-react"
import type { HomeContent } from "@/lib/data/home"

export default function AdminHome() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [content, setContent] = useState<HomeContent | null>(null)
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

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
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
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Админ - Редактор на началната страница</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/admin/portfolio")}>
              Редактиране на порфолиото
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Преглед на началната страница
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Изход
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Редактиране на съдържанието на началната страница</h2>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Запазване..." : "Запазване на всички промени"}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Раздел "Херо"</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Заглавие</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => updateHero("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Подзаглавие</Label>
                <Input
                  value={content.hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <textarea
                  value={content.hero.description}
                  onChange={(e) => updateHero("description", e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Текст на бутона</Label>
                <Input
                  value={content.hero.buttonText}
                  onChange={(e) => updateHero("buttonText", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Раздел "Услуги"</h3>
            </div>
            <div className="mb-4 space-y-2">
              <Label>Заглавие на раздела</Label>
              <Input
                value={content.services.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    services: { ...content.services, title: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-6">
              {content.services.items.map((service, index) => (
                <div key={service.id} className="rounded-lg border border-border p-4">
                  <h4 className="mb-4 font-medium">Услуга {index + 1}</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Заглавие</Label>
                      <Input
                        value={service.title}
                        onChange={(e) => updateService(index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Описание</Label>
                      <textarea
                        value={service.description}
                        onChange={(e) =>
                          updateService(index, "description", e.target.value)
                        }
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* About Section */}
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 space-y-2">
              <Label>Заглавие на раздела</Label>
              <Input
                value={content.about.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    about: { ...content.about, title: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-4">
              {content.about.paragraphs.map((paragraph, index) => (
                <div key={index} className="space-y-2">
                  <Label>Параграф {index + 1}</Label>
                  <textarea
                    value={paragraph}
                    onChange={(e) => updateAbout(index, e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Раздел "Контакт"</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Заглавие на раздела</Label>
                <Input
                  value={content.contact.title}
                  onChange={(e) => updateContact("title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Адрес</Label>
                <Input
                  value={content.contact.address}
                  onChange={(e) => updateContact("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Телефон</Label>
                <Input
                  value={content.contact.phone}
                  onChange={(e) => updateContact("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Имейл</Label>
                <Input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Раздел "Футър"</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Copyright Text</Label>
                <Input
                  value={content.footer.copyright}
                  onChange={(e) => updateFooter("copyright", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Слоган</Label>
                <Input
                  value={content.footer.tagline}
                  onChange={(e) => updateFooter("tagline", e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

