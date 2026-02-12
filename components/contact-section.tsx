import { Github, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react"
import { TikTokIcon } from "@/components/icons/tiktok-icon"

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border/70 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-2 font-mono text-sm text-primary">{"// get in touch"}</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {"Let's Work Together"}
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            {
              "Whether it's a web project, a creative collaboration, or just a conversation -- I'm open to new opportunities. Reach out through any of these channels."
            }
          </p>

          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <a
              href="mailto:codeapostle1@gmail.com"
              className="flex w-full items-center gap-3 rounded-xl border border-border/80 bg-card/60 px-6 py-4 shadow-sm shadow-emerald-950/5 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card sm:w-auto"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">codeapostle1@gmail.com</p>
              </div>
            </a>
            <a
              href="https://wa.me/2348107667935"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-xl border border-border/80 bg-card/60 px-6 py-4 shadow-sm shadow-emerald-950/5 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-card sm:w-auto"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="text-sm font-medium text-foreground">+234 810 766 7935</p>
              </div>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://github.com/codeapostle1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border/80 bg-card/60 p-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/joel-ademola-3a0468371"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border/80 bg-card/60 p-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/codeapostle1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border/80 bg-card/60 p-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label="Twitter / X"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.tiktok.com/@codeapostle1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border/80 bg-card/60 p-3 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
