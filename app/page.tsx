import Image from "next/image"
import Link from "next/link"
import { Building2, FileCheck, ClipboardCheck, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
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
            <Link href="/portfolio" className="text-sm font-medium hover:text-primary transition-colors">
              Портфолио
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-muted to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-5xl font-bold leading-tight text-balance">Роси Ро ЕООД</h1>
            <p className="mb-4 text-2xl text-muted-foreground text-balance">Консултант по строителен надзор</p>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
              Професионални услуги за одит и издаване на разрешителни за строителни обекти. С дългогодишен опит и
              експертност в областта на строителството.
            </p>
            <Link href="/portfolio">
              <Button size="lg" className="text-base">
                Вижте портфолио
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-3xl font-bold text-center">Услуги</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Строителен надзор</h3>
              <p className="text-muted-foreground leading-relaxed">
                Професионален надзор на строителни проекти за осигуряване на качество и спазване на нормативите.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Одити и проверки</h3>
              <p className="text-muted-foreground leading-relaxed">
                Задълбочени одити на строителни обекти и техническа документация.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-8 transition-shadow hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Разрешителни</h3>
              <p className="text-muted-foreground leading-relaxed">
                Съдействие при издаване на строителни разрешителни и необходима документация.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">За нас</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              <p>
                Роси Ро ЕООД е водеща консултантска фирма в областта на строителния надзор с дългогодишен опит в сферата
                на строителството. Специализирани сме в осъществяването на професионален строителен надзор, технически
                одити и съдействие при издаване на строителни разрешителни.
              </p>
              <p>
                Нашият опит включва разнообразни проекти - от жилищни сгради и търговски обекти до индустриални
                съоръжения и инфраструктурни проекти. Гарантираме качество, прецизност и спазване на всички нормативни
                изисквания.
              </p>
              <p className="font-medium">
                Работим с отдаденост за осигуряване на най-високи стандарти в строителната индустрия.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">Контакти</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Адрес</h3>
                  <p className="text-muted-foreground">гр. Хасково, к-кс. XXI век, ет. 2, оф. 6</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Телефон</h3>
                  <a href="tel:+359898262834" className="text-muted-foreground hover:text-primary transition-colors">
                    +359 898 262 834
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Имейл</h3>
                  <a
                    href="mailto:rosenaminkova@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    rosenaminkova@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
