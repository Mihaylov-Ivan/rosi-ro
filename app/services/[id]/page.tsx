import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getService, getHomeContent } from "@/lib/data/home"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const service = await getService(id)
  if (!service) return {}

  return {
    title: service.title,
    description: service.description.slice(0, 160),
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { id } = await params
  const [service, content] = await Promise.all([
    getService(id),
    getHomeContent(),
  ])

  if (!service) notFound()

  const otherServices = content.services.items.filter((s) => s.id !== id)

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
            <Link href="/services" className="text-sm font-medium text-primary">
              Услуги
            </Link>
            <Link href="/contacts" className="text-sm font-medium hover:text-primary transition-colors">
              Контакти
            </Link>
          </nav>
        </div>
      </header>

      {/* Service Content */}
      <main className="bg-bone-base py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/services"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            ← Всички услуги
          </Link>

          <article>
            <h1 className="text-4xl font-bold mb-6">{service.title}</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {service.description}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-4">Свържете се с нас</h2>
              <p className="text-muted-foreground mb-6">
                Искате да получите оферта или имате въпроси относно нашите услуги?{" "}
                <Link href="/contacts" className="text-primary font-medium hover:underline">
                  Свържете се с екипа ни в Хасково
                </Link>
                .
              </p>
            </div>

            {otherServices.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold mb-6">Други услуги</h2>
                <ul className="space-y-4">
                  {otherServices.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/services/${s.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
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
