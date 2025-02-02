"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import dynamic from "next/dynamic"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default dynamic(() => Promise.resolve(({ children }: { children: React.JSX.Element }) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange >
    {children}
  </ThemeProvider>
)), {
  ssr: false,
}
)
