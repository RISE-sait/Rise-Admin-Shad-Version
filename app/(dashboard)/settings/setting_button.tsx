"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { forwardRef } from "react"

// Add forwardRef to properly handle focus management
export const SettingsButton = forwardRef<
  HTMLButtonElement,
  { variant?: "default" | "ghost" | "outline" }
>(({ variant = "default" }, ref) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleNavigateToSettings = () => {
    setIsLoading(true)
    try {
      router.push('/settings')
    } catch (error) {
      console.error("Navigation failed:", error)
    } finally {
      setTimeout(() => setIsLoading(false), 300)
    }
  }

  return (
    <Button 
      variant={variant} 
      onClick={handleNavigateToSettings} 
      disabled={isLoading}
      className="w-full justify-start"
      ref={ref}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Settings className="mr-2 h-4 w-4" />
      )}
      Settings
    </Button>
  )
})

SettingsButton.displayName = "SettingsButton"