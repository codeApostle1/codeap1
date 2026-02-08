const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    title: "Backend & Tools",
    skills: ["Node.js", "Supabase", "REST APIs", "Git", "Vercel", "PostgreSQL"],
  },
  {
    title: "Creative",
    skills: ["Digital Art", "Graphic Novels", "Story Writing", "UI Design", "Visual Design"],
  },
]

export function SkillsSection() {
  return (
    <section id="skills" className="px-6 py-24 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-sm text-primary">
            {"// skills & craft"}
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What I Work With
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-4 font-mono text-sm font-semibold text-primary">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-border/60 bg-secondary/50 px-3 py-1.5 text-sm text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
