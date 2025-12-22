"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const projects = [
  {
    id: 1,
    title: "Жилищен комплекс",
    category: "Жилищно строителство",
    image: "/modern-apartment-building.png",
    description:
      "Надзор на многофамилна жилищна сграда с 60 апартамента. Проектът включва пълен строителен надзор от започване до завършване, включително координация с всички специалисти и контрол на качеството.",
    details: {
      location: "гр. Хасково",
      year: "2023",
      scope: "Строителен надзор, технически одит",
    },
  },
  {
    id: 2,
    title: "Търговски център",
    category: "Търговско строителство",
    image: "/commercial-building-modern.jpg",
    description:
      "Пълен строителен надзор на търговски обект с площ 3000 кв.м. Включва координация на всички етапи от изкопни работи до финално завършване.",
    details: {
      location: "гр. Пловдив",
      year: "2022",
      scope: "Строителен надзор, управление на проекта",
    },
  },
  {
    id: 3,
    title: "Индустриален обект",
    category: "Индустриално строителство",
    image: "/industrial-building-warehouse.jpg",
    description:
      "Строителен надзор на производствен цех с офис площи. Специализиран надзор за индустриални съоръжения и технологични инсталации.",
    details: {
      location: "гр. Стара Загора",
      year: "2023",
      scope: "Строителен надзор, технически контрол",
    },
  },
  {
    id: 4,
    title: "Соларна инсталация",
    category: "Енергийни проекти",
    image: "/solar-panels-installation.jpg",
    description:
      "Технически надзор на фотоволтаична централа. Контрол на монтажа и съответствието със стандартите за електрически инсталации.",
    details: {
      location: "гр. Димитровград",
      year: "2024",
      scope: "Технически надзор, енергиен одит",
    },
  },
  {
    id: 5,
    title: "Жилищна сграда",
    category: "Жилищно строителство",
    image: "/residential-building-yellow.jpg",
    description:
      "Строителен надзор на жилищна сграда с 32 апартамента. Пълен контрол на изпълнението и качеството на строителните работи.",
    details: {
      location: "гр. Хасково",
      year: "2023",
      scope: "Строителен надзор, качествен контрол",
    },
  },
  {
    id: 6,
    title: "Реконструкция на сграда",
    category: "Реконструкция",
    image: "/building-renovation-construction.jpg",
    description:
      "Надзор при цялостна реконструкция на съществуваща сграда. Включва укрепване на конструкции и модернизация на инсталациите.",
    details: {
      location: "гр. Хасково",
      year: "2022",
      scope: "Строителен надзор, консултации",
    },
  },
]

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-8 px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
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
          </nav>
        </div>
      </header>

      {/* Portfolio Header */}
      <section className="bg-gradient-to-br from-muted to-background py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-balance">Нашето портфолио</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Разгледайте реализираните от нас проекти в различни области на строителството - жилищни, търговски и
            индустриални обекти.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-xl hover:scale-[1.02] text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
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
                <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>

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
            <p className="text-sm text-muted-foreground">Консултант по строителен надзор</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
