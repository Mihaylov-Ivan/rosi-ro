"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { PortfolioProject } from "@/lib/data/portfolio"

export default function Portfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [header, setHeader] = useState<{ title: string; description: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsResponse, headerResponse] = await Promise.all([
          fetch("/api/portfolio"),
          fetch("/api/portfolio-header"),
        ])
        const projectsData = await projectsResponse.json()
        const headerData = await headerResponse.json()
        setProjects(projectsData)
        setHeader(headerData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

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
            <Link href="/portfolio" className="text-sm font-medium text-primary">
              Портфолио
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
              Контакти
            </Link>
          </nav>
        </div>
      </header>

      {/* Portfolio Header */}
      {header && (
        <section className="bg-gradient-to-br from-muted to-background py-16">
          <div className="container mx-auto px-4">
            <h1 className="mb-4 text-4xl font-bold text-balance">{header.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{header.description}</p>
          </div>
        </section>
      )}

      {/* Portfolio Grid */}
      <section className="py-16">
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
            <p className="text-sm text-muted-foreground">© 2025 Роси Ро ЕООД. Всички права запазени.</p>
            <p className="text-sm text-muted-foreground">Консултант строителен надзор</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
