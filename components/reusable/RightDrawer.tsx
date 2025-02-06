import React from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface RightDrawerProps {
  drawerOpen: boolean
  handleDrawerClose: () => void
  children: React.ReactNode
  drawerWidth?: string
}

const RightDrawer: React.FC<RightDrawerProps> = ({
  drawerOpen,
  handleDrawerClose,
  children,
}) => {
  return (
    <Sheet open={drawerOpen} onOpenChange={handleDrawerClose}>
      <SheetContent
        className="min-w-fit"
        side="right"
        aria-labelledby="sheet-title"
      >
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default RightDrawer