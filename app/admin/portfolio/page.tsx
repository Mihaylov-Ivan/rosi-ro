"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus, Trash2, Edit, LogOut } from "lucide-react"
import type { PortfolioProject } from "@/lib/data/portfolio"

export default function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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

  // Check authentication
  useEffect(() => {
    checkAuth()
  }, [])

  // Load projects
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
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

    // Validate that image is provided
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
        // Update
        await fetch("/api/portfolio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProject.id, ...projectData }),
        })
      } else {
        // Create
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
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Admin - Portfolio Management</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/portfolio")}>
              View Portfolio
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Portfolio Projects</h2>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>

        {/* Projects List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mb-2 text-sm font-medium text-primary">{project.category}</div>
              <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(project)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No projects yet. Click "Add Project" to get started.
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
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
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Scope *</Label>
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
                Cancel
              </Button>
              <Button type="submit">{editingProject ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

