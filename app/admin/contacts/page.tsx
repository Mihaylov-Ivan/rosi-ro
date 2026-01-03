"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, Mail, Phone, Facebook, Save, LogOut } from "lucide-react"
import { ContactItemEditable } from "@/components/contact-item-editable"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { HomeContent } from "@/lib/data/home"

export default function AdminContacts() {
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

      alert("Contact information saved successfully!")
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

  const updateContact = (field: string, value: string) => {
    if (!content) return
    setContent({
      ...content,
      contact: { ...content.contact, [field]: value },
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
          onClick={() => router.push("/admin/services")}
          size="sm"
          className="shadow-lg"
        >
          Услуги
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
              Услуги
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

      {/* Contact Section */}
      <section className="bg-bone-light py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info */}
              <div className="bg-bone-dark p-8 rounded-lg">
                <Input
                  value={content.contact.title}
                  onChange={(e) => updateContact("title", e.target.value)}
                  className="mb-8 text-3xl font-bold border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
                />
                <div className="space-y-6">
                  <ContactItemEditable
                    icon={Building2}
                    title="Адрес"
                    value={content.contact.address}
                    onChange={(value) => updateContact("address", value)}
                    type="textarea"
                    rows={2}
                  />
                  <ContactItemEditable
                    icon={Phone}
                    title="Телефон"
                    value={content.contact.phone}
                    onChange={(value) => updateContact("phone", value)}
                    type="tel"
                  />
                  <ContactItemEditable
                    icon={Mail}
                    title="Имейл"
                    value={content.contact.email}
                    onChange={(value) => updateContact("email", value)}
                    type="email"
                  />
                  <ContactItemEditable
                    icon={Facebook}
                    title="Facebook"
                    value={content.contact.facebook || "https://www.facebook.com/profile.php?id=61586010500517&locale=bg_BG"}
                    onChange={(value) => updateContact("facebook", value)}
                    type="url"
                  />
                </div>
              </div>

              {/* Contact Form Section - Read Only Preview */}
              <div className="bg-bone-dark p-8 rounded-lg">
                <h2 className="mb-8 text-3xl font-bold">Изпратете запитване</h2>
                <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Име</label>
                    <div className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground">
                      [Потребителско поле]
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Имейл</label>
                    <div className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground">
                      [Потребителско поле]
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Телефон</label>
                    <div className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-muted-foreground">
                      [Потребителско поле]
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Съобщение</label>
                    <div className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
                      [Потребителско поле]
                    </div>
                  </div>
                  <Button size="lg" className="w-full" disabled>
                    Изпрати
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Формата се попълва от посетителите на сайта
                  </p>
                </div>
              </div>
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

