"use client"

import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/UserContext"
import { LogOut } from "lucide-react"
import { auth } from "@/configs/firebase"
import { signOut } from "firebase/auth"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { forwardRef } from "react"

// Add forwardRef to properly handle focus management
export const LogoutButton = forwardRef<
  HTMLButtonElement, 
  { variant?: "default" | "ghost" | "outline" }
>(({ variant = "default" }, ref) => {
  const { logout } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      // Sign out from Firebase
      await signOut(auth)
      
      // Call our context logout function to clear local state
      logout()
      
      toast.success("Successfully logged out")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      onClick={handleLogout} 
      disabled={isLoading}
      className="w-full justify-start"
      ref={ref}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      Logout
    </Button>
  )
})

LogoutButton.displayName = "LogoutButton"