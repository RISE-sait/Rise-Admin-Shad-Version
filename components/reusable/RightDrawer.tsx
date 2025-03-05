import React from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface RightDrawerProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  children: React.ReactNode
  drawerWidth?: string | number // Accepts both Tailwind classes and explicit numbers
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  drawerOpen,
  handleDrawerClose,
  children,
  drawerWidth,
}) => {
  // Handle both Tailwind classes and explicit pixel values
  const getWidthStyles = () => {
    if (typeof drawerWidth === "number") {
      return {
        style: { 
          width: `${drawerWidth}px`,
          minWidth: `${drawerWidth}px`,
          maxWidth: `${drawerWidth}px`
        }
      }
    }
    
    if (typeof drawerWidth === "string") {
      return {
        className: `${drawerWidth} min-w-[unset] max-w-[unset]`
      }
    }

    // Default responsive width
    return {
      className: "w-full sm:w-3/4 lg:w-1/2 xl:w-1/3"
    }
  }

  const { className, style } = getWidthStyles()

  return (
    <Sheet open={drawerOpen} onOpenChange={handleDrawerClose}>
      <SheetContent
        side="right"
        className={`${className} !max-w-[100vw] overflow-y-auto`}
        style={style}
        aria-labelledby="sheet-title"
      >
        <div className="min-w-[300px]">{children}</div>
      </SheetContent>
    </Sheet>
  )
}

export default RightDrawer