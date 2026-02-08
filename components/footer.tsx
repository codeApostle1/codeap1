import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/"
          className="font-mono text-sm font-bold text-muted-foreground"
        >
          {"<"}
          <span className="text-primary">CodeApostle1</span>
          {"/>"}
        </Link>
        <p className="text-sm text-muted-foreground">
          {new Date().getFullYear()} Ademola Joel. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
