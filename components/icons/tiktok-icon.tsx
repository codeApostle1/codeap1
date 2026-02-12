import { cn } from "@/lib/utils"

type TikTokIconProps = {
  className?: string
}

export function TikTokIcon({ className }: TikTokIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.26V2h-3.12v12.39a2.67 2.67 0 1 1-2.67-2.67c.3 0 .59.05.86.14V8.7a5.8 5.8 0 0 0-.86-.06A5.79 5.79 0 1 0 15.82 14V8.73a7.9 7.9 0 0 0 4.62 1.48V7.12c-.3 0-.58-.15-.85-.43Z" />
    </svg>
  )
}
