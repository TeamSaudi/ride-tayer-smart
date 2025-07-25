import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
        destructive: "bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 hover:shadow-xl",
        outline: "border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/40 hover:shadow-md",
        secondary: "bg-gradient-secondary text-white shadow-secondary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        ghost: "text-primary hover:bg-primary/10 hover:text-primary-light",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-light",
        hero: "bg-gradient-hero text-white shadow-glow hover:shadow-elegant hover:scale-105 active:scale-95 font-bold tracking-wide",
        success: "bg-success text-success-foreground shadow-lg hover:bg-success/90 hover:shadow-xl",
        warning: "bg-warning text-warning-foreground shadow-lg hover:bg-warning/90 hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
