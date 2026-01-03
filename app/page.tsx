"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { HomeContent } from "@/lib/data/home"
import type { PortfolioProject } from "@/lib/data/portfolio"
import { Building2, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

// Define the 4 portfolio categories
const PORTFOLIO_CATEGORIES = [
  "Жилищно строителство",
  "Търговско строителство",
  "Индустриално строителство",
  "Реновации",
] as const

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

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
            <div className="space-y-12">
              {PORTFOLIO_CATEGORIES.map((category) => {
                const categoryProjects = projects.filter((p) => p.category === category)
                if (categoryProjects.length === 0) return null

                const scrollLeft = () => {
                  const container = scrollRefs.current[category]
                  if (container) {
                    container.scrollBy({ left: -400, behavior: "smooth" })
                  }
                }

                const scrollRight = () => {
                  const container = scrollRefs.current[category]
                  if (container) {
                    container.scrollBy({ left: 400, behavior: "smooth" })
                  }
                }

                return (
                  <div key={category} className="space-y-4">
                    <h2 className="text-2xl font-bold">{category}</h2>
                    <div className="relative group">
                      {/* Left Arrow */}
                      <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {/* Scrollable Container */}
                      <div
                        ref={(el) => {
                          scrollRefs.current[category] = el
                        }}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {categoryProjects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className="group flex-shrink-0 w-80 overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl hover:scale-[1.02] text-left"
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

                      {/* Right Arrow */}
                      <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:bg-accent transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
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

                {(selectedProject.details.location?.trim() || selectedProject.details.year?.trim() || selectedProject.details.scope?.trim()) && (
                  <div className="grid gap-4 border-t border-border pt-6 md:grid-cols-3">
                    {selectedProject.details.location?.trim() && (
                      <div>
                        <h4 className="mb-1 font-semibold">Локация</h4>
                        <p className="text-muted-foreground">{selectedProject.details.location}</p>
                      </div>
                    )}
                    {selectedProject.details.year?.trim() && (
                      <div>
                        <h4 className="mb-1 font-semibold">Година</h4>
                        <p className="text-muted-foreground">{selectedProject.details.year}</p>
                      </div>
                    )}
                    {selectedProject.details.scope?.trim() && (
                      <div>
                        <h4 className="mb-1 font-semibold">Обхват</h4>
                        <p className="text-muted-foreground">{selectedProject.details.scope}</p>
                      </div>
                    )}
                  </div>
                )}
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
