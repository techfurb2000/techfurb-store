import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent)] text-[#0B0F14] hover:bg-[var(--accent)]/80",
        secondary:
          "border-transparent bg-[var(--bg-surface-alt)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-alt)]/80",
        destructive:
          "border-transparent bg-[var(--danger)] text-white hover:bg-[var(--danger)]/80",
        outline: "text-[var(--text-primary)] border-[var(--border)]",
        gradeA: "border-transparent bg-[var(--grade-a)] text-[#0B0F14]",
        gradeB: "border-transparent bg-[var(--grade-b)] text-[#0B0F14]",
        gradeC: "border-transparent bg-[var(--grade-c)] text-[#0B0F14]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
