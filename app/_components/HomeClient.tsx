"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { HomeContent } from "@/lib/data/home"
import type { PortfolioProject } from "@/lib/data/portfolio"
import type { PortfolioCategory } from "@/lib/data/portfolio-categories"
import { Building2, Mail, Phone, Facebook, ChevronRight } from "lucide-react"
import { ContactItem } from "@/components/contact-item"
import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"

const PORTFOLIO_CATEGORIES = [
  "Промишлено-технологични и стопански обекти и складове",
  "Жилищни сгради и комплекси",
  "Обекти за обществено обслужване и търговия",
  "Електроенергийни обекти",
] as const

interface HomeClientProps {
  content: HomeContent
  projects: PortfolioProject[]
  categories: PortfolioCategory[]
}

export default function HomeClient({ content, projects, categories }: HomeClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categoryImages = useMemo(
    () =>
      categories.reduce<Record<string, string | null>>((acc, c) => {
        acc[c.name] = c.image
        return acc
      }, {}),
    [categories]
  )

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
                  <div className={`p-8 flex-1 flex flex-col ${categoryImage ? "" : "justify-center"}`}>
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
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
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
                        </Link>
                      ))}
                    </div>
                  )
                })()}
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
