"use client"

import Link from "next/link"
import { ArrowRight, Github, Linkedin, Twitter, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const roles = ["Web Developer", "Frontend Specialist", "Digital Creative", "Visual Storyteller"]

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const currentRole = roles[roleIndex]

    if (typing) {
      if (displayed.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayed(currentRole.slice(0, displayed.length + 1))
        }, 60)
        return () => clearTimeout(timeout)
      }
      const pause = setTimeout(() => setTyping(false), 1800)
      return () => clearTimeout(pause)
    }

    if (displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1))
      }, 30)
      return () => clearTimeout(timeout)
    }

    setRoleIndex((prev) => (prev + 1) % roles.length)
    setTyping(true)
  }, [displayed, typing, roleIndex])

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 pt-24 md:pt-0">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow effect */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Available for work
        </div>

        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          {"Hi, I'm "}
          <span className="text-primary">Ademola Joel</span>
        </h1>

        <div className="mt-4 h-8 font-mono text-lg text-muted-foreground sm:text-xl">
          <span>{displayed}</span>
          <span className="animate-pulse text-primary">|</span>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {"I'm a frontend-focused web developer who builds modern, responsive applications with Next.js and React. I blend clean code with digital artistry to create experiences that are both functional and beautiful."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/projects">
              View My Work
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#contact">Contact Me</Link>
          </Button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="https://github.com/codeapostle1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/joel-ademola-3a0468371"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/codeapostle1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Twitter / X"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://www.tiktok.com/@codeapostle1"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="TikTok"
          >
            <Video className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
