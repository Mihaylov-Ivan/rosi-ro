import { LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactItemEditableProps {
  icon: LucideIcon
  title: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "email" | "tel" | "url" | "textarea"
  rows?: number
}

export function ContactItemEditable({
  icon: Icon,
  title,
  value,
  onChange,
  type = "text",
  rows = 2,
}: ContactItemEditableProps) {
  const InputComponent = type === "textarea" ? Textarea : Input

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bone-dark">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="mb-1 font-semibold">{title}</h3>
        <InputComponent
          type={type === "textarea" ? undefined : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-muted-foreground border-none bg-transparent p-0 focus-visible:ring-2 focus-visible:ring-ring rounded w-full resize-none whitespace-pre-wrap"
          rows={type === "textarea" ? rows : undefined}
        />
      </div>
    </div>
  )
}

