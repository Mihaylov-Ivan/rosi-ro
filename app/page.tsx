"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { HomeContent } from "@/lib/data/home"
import type { PortfolioProject } from "@/lib/data/portfolio"
import { Building2, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        const [homeResponse, portfolioResponse] = await Promise.all([
          fetch("/api/home"),
          fetch("/api/portfolio"),
        ])
        const homeData = await homeResponse.json()
        const portfolioData = await portfolioResponse.json()
        setContent(homeData)
        setProjects(portfolioData)
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
            <Link href="/services" className="text-sm font-medium hover:text-primary transition-colors">
              Услуги
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
              Контакти
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-bone-light py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-balance">{content.hero.title}</h1>
          <p className="mb-4 text-2xl text-muted-foreground text-balance">{content.hero.subtitle}</p>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {content.hero.description}
          </p>
          <Link href="/services">
            <Button size="lg" className="text-base">
              Услуги
            </Button>
          </Link>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="bg-bone-base py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Зареждане...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl hover:scale-[1.02] text-left"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-2 text-sm font-medium text-primary">{project.category}</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-bone-light py-12">
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

      {/* Contacts Section */}
      <section className="bg-bone-base py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">{content.contact.title}</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Адрес</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{content.contact.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Телефон</h3>
                  <a
                    href={`tel:${content.contact.phone.replace(/\s/g, "")}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {content.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Имейл</h3>
                  <a
                    href={`mailto:${content.contact.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {content.contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {selectedProject.image && (
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div>
                  <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {selectedProject.category}
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{selectedProject.description}</p>
                </div>

                <div className="grid gap-4 border-t border-border pt-6 md:grid-cols-3">
                  <div>
                    <h4 className="mb-1 font-semibold">Локация</h4>
                    <p className="text-muted-foreground">{selectedProject.details.location}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Година</h4>
                    <p className="text-muted-foreground">{selectedProject.details.year}</p>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Обхват</h4>
                    <p className="text-muted-foreground">{selectedProject.details.scope}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
