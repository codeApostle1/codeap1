import { Code2, Palette, Zap } from "lucide-react"

const highlights = [
  {
    icon: Code2,
    title: "Frontend-First",
    description:
      "I specialize in building clean, responsive interfaces with React and Next.js -- pixel-perfect UIs that feel alive.",
  },
  {
    icon: Palette,
    title: "Creative Mind",
    description:
      "Beyond code, I bring digital art, graphic novel design, and visual storytelling into everything I create.",
  },
  {
    icon: Zap,
    title: "Problem Solver",
    description:
      "From scalable CRUD systems to practical tools, I build solutions that solve real-world problems with clean architecture.",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="px-6 py-24 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-sm text-primary">{"// about me"}</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Code Meets Creativity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {"I'm Ademola Joel, aka CodeApostle1 -- a frontend-focused full-stack developer who builds modern, responsive web applications using Next.js and React. I enjoy creating clean user interfaces, scalable CRUD systems, and practical solutions that solve real problems. When I'm not writing code, I'm crafting digital art, designing graphic novels, and weaving stories."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
