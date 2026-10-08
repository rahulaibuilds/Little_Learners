"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Mock login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication check
    if (email === "parent@example.com" && password === "parent123") {
      setIsLoading(false)
      router.push("/parent/dashboard")
    } else {
      setError("Invalid email or password. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="w-full max-w-md mx-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="parent@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-lg"
            />
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-lg"
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              Don't have an account? <a href="/parent/signup" className="underline text-primary hover:text-primary/90">Create account</a>
            </p>
          </form>
        </div>
      </Card>
    </div>
  )
}