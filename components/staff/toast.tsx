import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export const toast = (props: ToastProps) => {
  const { title, description, variant } = props
  
  return sonnerToast[variant === "destructive" ? "error" : "info"](title, {
    description,
  })
}