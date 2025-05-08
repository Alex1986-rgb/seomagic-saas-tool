
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/90 group-[.toaster]:backdrop-blur-sm group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: 
            "group-[.toaster]:border-[#22c55e]/30 group-[.toaster]:bg-[#22c55e]/10 group-[.toaster]:text-[#22c55e]",
          info: 
            "group-[.toaster]:border-[#0ea5e9]/30 group-[.toaster]:bg-[#0ea5e9]/10 group-[.toaster]:text-[#0ea5e9]",
          warning: 
            "group-[.toaster]:border-[#f59e0b]/30 group-[.toaster]:bg-[#f59e0b]/10 group-[.toaster]:text-[#f59e0b]",
          error: 
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
