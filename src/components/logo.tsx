import * as React from "react"
import { cn } from "cn"
import { APP_NAME } from "@/lib/constant"

export function Logo({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className="flex size-8 items-center justify-center bg-primary text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M7 5v8a5 5 0 0 0 10 0V5" />
          <path d="M12 3v1" />
        </svg>
      </div>
      <span className="text-sm font-medium">{APP_NAME}</span>
    </div>
  )
}
