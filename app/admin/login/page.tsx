"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Невалидна парола")
        setLoading(false)
        return
      }

      // Redirect to admin dashboard
      router.push("/admin/portfolio")
    } catch (err) {
      setError("Възникна грешка. Моля, опитайте отново.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Админ - Вход</h1>
          <p className="text-muted-foreground mt-2">Въведете парола за достъп до админ панела</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Парола</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Въведете паролата за админ панела"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Влизане..." : "Вход"}
          </Button>
        </form>
      </div>
    </div>
  )
}

