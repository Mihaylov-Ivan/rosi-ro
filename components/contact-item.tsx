import { LucideIcon } from "lucide-react"
import Link from "next/link"

interface ContactItemProps {
  icon: LucideIcon
  title: string
  content: string
  href?: string
  linkText?: string
}

export function ContactItem({ icon: Icon, title, content, href, linkText }: ContactItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="mb-1 font-semibold">{title}</h3>
        {href ? (
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {linkText || content}
          </a>
        ) : (
          <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  )
}

