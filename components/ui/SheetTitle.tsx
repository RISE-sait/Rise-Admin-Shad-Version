import React from "react"

const SheetTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-semibold" id="sheet-title">
    {children}
  </h2>
)

export default SheetTitle