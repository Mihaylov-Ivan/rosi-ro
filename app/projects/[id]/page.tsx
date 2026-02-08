import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getPortfolioProject } from "@/lib/data/portfolio"
import { getHomeContent } from "@/lib/data/home"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const projectId = parseInt(id, 10)
  if (isNaN(projectId)) return {}

  const project = await getPortfolioProject(projectId)
  if (!project) return {}

  return {
    title: project.title,
    description: project.description.slice(0, 160),
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params
  const projectId = parseInt(id, 10)
  if (isNaN(projectId)) notFound()

  const [project, content] = await Promise.all([
    getPortfolioProject(projectId),
    getHomeContent(),
  ])

  if (!project) notFound()

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

      {/* Project Content */}
      <main className="bg-bone-base py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            ← Назад към портфолио
          </Link>

          <article>
            <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {project.category}
            </div>
            <h1 className="text-4xl font-bold mb-6">{project.title}</h1>

            {project.image && (
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-8">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            )}

            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">
              {project.description}
            </p>

            {(project.details.location?.trim() ||
              project.details.year?.trim() ||
              project.details.scope?.trim()) && (
              <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-3">
                {project.details.location?.trim() && (
                  <div>
                    <h2 className="mb-1 font-semibold">Локация</h2>
                    <p className="text-muted-foreground">{project.details.location}</p>
                  </div>
                )}
                {project.details.year?.trim() && (
                  <div>
                    <h2 className="mb-1 font-semibold">Година</h2>
                    <p className="text-muted-foreground">{project.details.year}</p>
                  </div>
                )}
                {project.details.scope?.trim() && (
                  <div>
                    <h2 className="mb-1 font-semibold">Обхват</h2>
                    <p className="text-muted-foreground">{project.details.scope}</p>
                  </div>
                )}
              </div>
            )}
          </article>
        </div>
      </main>

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
