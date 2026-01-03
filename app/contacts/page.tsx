"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import sendEmail from "@/lib/actions/email"
import type { HomeContent } from "@/lib/data/home"
import { Building2, Mail, Phone, Facebook } from "lucide-react"
import { ContactItem } from "@/components/contact-item"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Contacts() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitStatus(null)

    try {
      const text = `Име: ${formData.name}\nИмейл: ${formData.email}\nТелефон: ${formData.phone}\n\nСъобщение:\n${formData.message}`

      await sendEmail({
        fromName: formData.name,
        fromEmail: formData.email,
        text
      })

      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    } catch (error) {
      console.error("Error sending email:", error)
      setSubmitStatus("error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              Услуги
            </Link>
            <Link href="/contacts" className="text-sm font-medium text-primary">
              Контакти
            </Link>
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
                <h2 className="mb-8 text-3xl font-bold">{content.contact.title}</h2>
                <div className="space-y-6">
                  <ContactItem
                    icon={Building2}
                    title="Адрес"
                    content={content.contact.address}
                  />
                  <ContactItem
                    icon={Phone}
                    title="Телефон"
                    content={content.contact.phone}
                    href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
                  />
                  <ContactItem
                    icon={Mail}
                    title="Имейл"
                    content={content.contact.email}
                    href={`mailto:${content.contact.email}`}
                  />
                  <ContactItem
                    icon={Facebook}
                    title="Facebook"
                    content="Посетете нашата Facebook страница"
                    href={content.contact.facebook || "https://www.facebook.com/profile.php?id=61586010500517&locale=bg_BG"}
                    linkText="Роси Ро ЕООД"
                  />
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-bone-dark p-8 rounded-lg">
                <h2 className="mb-8 text-3xl font-bold">Изпратете запитване</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus === "success" && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
                      Съобщението е изпратено успешно! Ще се свържем с вас скоро.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(100, 24, 42, 0.08)', borderColor: 'rgba(100, 24, 42, 0.25)', color: '#64182a' }}>
                      Възникна грешка при изпращането. Моля, опитайте отново по-късно.
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Име</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Имейл</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Съобщение</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      disabled={submitting}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Изпращане..." : "Изпрати"}
                  </Button>
                </form>
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

