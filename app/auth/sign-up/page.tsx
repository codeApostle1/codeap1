"use client"

import React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { UserPlus } from "lucide-react"

export default function SignUpPage() {
  const [email, setEmail] = useState("joelmtn7@gmail.com")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/auth/callback?next=/admin`,
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A confirmation link has been sent to{" "}
            <span className="font-medium text-foreground">{email}</span>. Click
            the link to activate your admin account, then go to{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              login
            </Link>
            .
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block text-sm text-primary hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-card">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Admin Account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            One-time setup for your portfolio admin
          </p>
        </div>

        <form
          onSubmit={handleSignUp}
          className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joelmtn7@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Admin Account"}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Already have an account? Login
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
