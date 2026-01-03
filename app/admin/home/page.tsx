"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { HomeContent } from "@/lib/data/home"
import type { PortfolioProject } from "@/lib/data/portfolio"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus, Trash2, Edit, LogOut, Save, Building2, Mail, Phone } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Define the 5 portfolio categories
const PORTFOLIO_CATEGORIES = [
  "Електроенергийни обекти",
  "Промишлено-технологични обекти и складове",
  "Жилищни сгради и комплекси",
  "Обекти за обществено обслужване и търговия",
  "Селско-стопански обекти",
] as const

export default function AdminHome() {
  const [content, setContent] = useState<HomeContent | null>(null)
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null)
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

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/portfolio")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const openAddDialog = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      category: PORTFOLIO_CATEGORIES[0],
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
    const validCategory = PORTFOLIO_CATEGORIES.includes(project.category as any)
      ? project.category
      : PORTFOLIO_CATEGORIES[0]
    setFormData({
      title: project.title,
      category: validCategory,
      image: project.image,
      description: project.description,
      location: project.details.location,
      year: project.details.year,
      scope: project.details.scope,
    })
    setIsDialogOpen(true)
  }

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.image) {
      alert("Моля, качете изображение")
      return
    }

    if (!formData.title || formData.title.trim() === "") {
      alert("Моля, въведете заглавие")
      return
    }

    if (!formData.category || !PORTFOLIO_CATEGORIES.includes(formData.category as any)) {
      alert("Моля, изберете валидна категория")
      return
    }

    if (!formData.description || formData.description.trim() === "") {
      alert("Моля, въведете описание")
      return
    }

    const projectData = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      description: formData.description,
      details: {
        location: formData.location.trim() || "",
        year: formData.year.trim() || "",
        scope: formData.scope.trim() || "",
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
      alert("Неуспешно запазване на проекта")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Сигурни ли сте, че искате да изтриете този проект?")) return

    try {
      await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" })
      loadProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      alert("Неуспешно изтриване на проекта")
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

      alert("Home page content saved successfully!")
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
        <Button onClick={openAddDialog} size="lg" className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Добавяне на проект
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

      {/* Hero Section */}
      <section className="bg-bone-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Input
              value={content.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
              className="mb-6 text-5xl font-bold leading-tight border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded"
            />
            <Input
              value={content.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="mb-4 text-2xl text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded"
            />
            <textarea
              value={content.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              className="mb-8 w-full text-lg text-muted-foreground leading-relaxed border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded resize-none whitespace-pre-wrap"
              rows={3}
            />
            <Button
              size="lg"
              className="text-base relative cursor-text"
              onClick={(e) => e.preventDefault()}
              asChild={false}
            >
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateHero("buttonText", e.currentTarget.textContent || "")}
                className="outline-none focus:ring-2 focus:ring-primary-foreground rounded px-1"
              >
                Услуги
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="bg-bone-base py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Зареждане...</div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Портфолио</h2>
                <div className="text-sm text-muted-foreground">
                  Общо проекти: {projects.length}
                </div>
              </div>
              {projects.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  Няма добавени проекти. Използвайте бутона "Добавяне на проект" за да добавите първия проект.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-bone-light py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Input
              value={content.about.title}
              onChange={(e) =>
                setContent({
                  ...content,
                  about: { ...content.about, title: e.target.value },
                })
              }
              className="mb-8 text-3xl font-bold border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
            />
            <div className="space-y-4 text-lg leading-relaxed">
              {content.about.paragraphs.map((paragraph, index) => (
                <textarea
                  key={index}
                  value={paragraph}
                  onChange={(e) => updateAbout(index, e.target.value)}
                  className={`w-full border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded resize-none whitespace-pre-wrap ${index === content.about.paragraphs.length - 1 ? "font-medium" : ""
                    }`}
                  rows={3}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <section className="bg-bone-base py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Input
              value={content.contact.title}
              onChange={(e) => updateContact("title", e.target.value)}
              className="mb-8 text-3xl font-bold border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
            />
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">Адрес</h3>
                  <Textarea
                    value={content.contact.address}
                    onChange={(e) => updateContact("address", e.target.value)}
                    className="text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full resize-none whitespace-pre-wrap"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">Телефон</h3>
                  <Input
                    value={content.contact.phone}
                    onChange={(e) => updateContact("phone", e.target.value)}
                    className="text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 font-semibold">Имейл</h3>
                  <Input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                    className="text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project View Modal */}
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

      {/* Add/Edit Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Редактиране на проект" : "Добавяне на нов проект"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitProject} className="space-y-4">
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
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Изберете категория</option>
                {PORTFOLIO_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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
                <Label htmlFor="location">Локация</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Година</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Обхват</Label>
                <Input
                  id="scope"
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
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
            <Input
              value={content.footer.copyright}
              onChange={(e) => updateFooter("copyright", e.target.value)}
              className="text-sm text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full md:w-auto"
            />
            <Input
              value={content.footer.tagline}
              onChange={(e) => updateFooter("tagline", e.target.value)}
              className="text-sm text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full md:w-auto"
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
