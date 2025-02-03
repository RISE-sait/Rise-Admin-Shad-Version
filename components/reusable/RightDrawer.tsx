import React from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import SheetTitle from "@/components/ui/SheetTitle"

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
  drawerWidth = "100%",
}) => {
  return (
    <Sheet open={drawerOpen} onOpenChange={handleDrawerClose}>
      <SheetContent
        side="right"
        className={`w-[${drawerWidth}]`}
        aria-labelledby="sheet-title"
      >
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default RightDrawer