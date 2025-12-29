"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit, LogOut, Save } from "lucide-react"
import type { PortfolioProject } from "@/lib/data/portfolio"
import type { PortfolioHeader } from "@/lib/data/portfolio-header"

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [header, setHeader] = useState<PortfolioHeader | null>(null)
  const [loading, setLoading] = useState(true)
  const [savingHeader, setSavingHeader] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    location: "",
    year: "",
    scope: "",
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
      loadHeader()
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

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/portfolio")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadHeader = async () => {
    try {
      const response = await fetch("/api/portfolio-header")
      const data = await response.json()
      setHeader(data)
    } catch (error) {
      console.error("Error loading header:", error)
    }
  }

  const handleSaveHeader = async () => {
    if (!header) return

    setSavingHeader(true)
    try {
      const response = await fetch("/api/portfolio-header", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(header),
      })

      if (!response.ok) {
        throw new Error("Failed to save")
      }

      alert("Portfolio header saved successfully!")
    } catch (error) {
      console.error("Error saving header:", error)
      alert("Failed to save header")
    } finally {
      setSavingHeader(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const openAddDialog = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      category: "",
      image: "",
      description: "",
      location: "",
      year: "",
      scope: "",
    })
    setIsDialogOpen(true)
  }

  const openEditDialog = (project: PortfolioProject) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      category: project.category,
      image: project.image,
      description: project.description,
      location: project.details.location,
      year: project.details.year,
      scope: project.details.scope,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image) {
      alert("Please upload an image")
      return
    }

    const projectData = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      description: formData.description,
      details: {
        location: formData.location,
        year: formData.year,
        scope: formData.scope,
      },
    }

    try {
      if (editingProject) {
        await fetch("/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProject.id, ...projectData }),
        })
      } else {
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        })
      }

      setIsDialogOpen(false)
      loadProjects()
    } catch (error) {
      console.error("Error saving project:", error)
      alert("Failed to save project")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" })
      loadProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Failed to delete project")
    }
  }

  if (loading || !isAuthenticated) {
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
        {header && (
          <Button
            onClick={handleSaveHeader}
            disabled={savingHeader}
            size="lg"
            className="shadow-lg"
          >
            <Save className="mr-2 h-4 w-4" />
            {savingHeader ? "Запазване..." : "Запазване на заглавието"}
          </Button>
        )}
        <Button onClick={openAddDialog} size="lg" className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Добавяне на проект
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
              src="/images/logo.jpg"
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
              Портфолио
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

      {/* Portfolio Header */}
      {header && (
        <section className="bg-gradient-to-br from-muted to-background py-16">
          <div className="container mx-auto px-4">
            <Input
              value={header.title}
              onChange={(e) => setHeader({ ...header, title: e.target.value })}
              className="mb-4 text-4xl font-bold text-balance border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
            />
            <textarea
              value={header.description}
              onChange={(e) => setHeader({ ...header, description: e.target.value })}
              className="text-lg text-muted-foreground max-w-2xl border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full resize-none"
              rows={3}
            />
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
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl hover:scale-[1.02] relative"
                >
                  {/* Edit/Delete buttons overlay */}
                  <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => openEditDialog(project)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full text-left"
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
                </div>
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Редактиране на проект" : "Добавяне на нов проект"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Заглавие *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Изображение *</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="location">Локация *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Година *</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Обхват *</Label>
                <Input
                  id="scope"
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отказ
              </Button>
              <Button type="submit">{editingProject ? "Обновяване" : "Създаване"}</Button>
            </div>
          </form>
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
