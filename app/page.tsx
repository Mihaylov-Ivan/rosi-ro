"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { HomeContent } from "@/lib/data/home"
import type { PortfolioProject } from "@/lib/data/portfolio"
import { Building2, Mail, Phone, Facebook, ChevronRight } from "lucide-react"
import { ContactItem } from "@/components/contact-item"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

// Define the 5 portfolio categories
const PORTFOLIO_CATEGORIES = [
  "Промишлено-технологични и стопански обекти и складове",
  "Жилищни сгради и комплекси",
  "Обекти за обществено обслужване и търговия",
  "Електроенергийни обекти",
  // "Селско-стопански обекти",
] as const

export default function Home() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [categoryImages, setCategoryImages] = useState<Record<string, string | null>>({})
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function loadContent() {
      try {
        const [homeResponse, portfolioResponse, categoriesResponse] = await Promise.all([
          fetch("/api/home"),
          fetch("/api/portfolio"),
          fetch("/api/portfolio-categories"),
        ])
        const homeData = await homeResponse.json()
        const portfolioData = await portfolioResponse.json()
        const categoriesData = await categoriesResponse.json()

        setContent(homeData)
        setProjects(portfolioData)

        // Create a map of category name to image
        const imagesMap: Record<string, string | null> = {}
        categoriesData.forEach((cat: { name: string; image: string | null }) => {
          imagesMap[cat.name] = cat.image
        })
        setCategoryImages(imagesMap)
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
              alt="Роси Ро ЕООД Лого (Rosy Ro Ltd. Logo)"
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

      {/* SEO: keywords for findability (screen-reader only) */}
      <div className="sr-only" aria-hidden="true">
        Строителен надзор Хасково. Проектиране, промяна на предназначението, консултации по строителство в Хасково. Консултации строителен надзор и проектиране. Промяна на предназначението Хасково. Роси Ро ЕООД — консултант строителен надзор, одити и консултации.
      </div>

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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PORTFOLIO_CATEGORIES.map((category) => {
                const categoryProjects = projects.filter((p) => p.category === category)
                const projectCount = categoryProjects.length
                const categoryImage = categoryImages[category]

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl hover:scale-[1.02] text-left h-full flex flex-col"
                  >
                    {categoryImage && (
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={categoryImage}
                          alt={category}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className={`p-8 flex-1 flex flex-col ${categoryImage ? '' : 'justify-center'}`}>
                      <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {category}
                      </h2>
                      <p className="text-muted-foreground mt-2">
                        {projectCount === 0
                          ? "Няма проекти"
                          : projectCount === 1
                            ? "1 проект"
                            : `${projectCount} проекта`}
                      </p>
                      {projectCount > 0 && (
                        <div className="flex items-center text-primary font-medium mt-4">
                          Вижте проектите
                          <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      )}
                    </div>
                  </button>
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
        </div>
      </section>

      {/* Category Modal - Shows all projects in selected category */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="!max-w-[98vw] !max-h-[98vh] !w-[98vw] !h-[98vh] overflow-hidden flex flex-col p-0 gap-0 !translate-x-[-50%] !translate-y-[-50%] !top-[50%] !left-[50%]">
          {selectedCategory && (
            <>
              <DialogHeader className="px-8 pt-8 pb-6 border-b border-border flex-shrink-0">
                <DialogTitle className="text-3xl font-bold">{selectedCategory}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-8 py-8">
                {(() => {
                  const categoryProjects = projects.filter((p) => p.category === selectedCategory)
                  if (categoryProjects.length === 0) {
                    return (
                      <div className="py-12 text-center text-muted-foreground">
                        Няма проекти в тази категория
                      </div>
                    )
                  }
                  return (
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {categoryProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project)
                          }}
                          className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl hover:scale-[1.02] text-left flex flex-col h-full"
                        >
                          <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center min-h-[280px]">
                            {project.image ? (
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-contain transition-transform group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-base text-muted-foreground line-clamp-3 flex-1 leading-relaxed">{project.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto !z-[60]">
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
