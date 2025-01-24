"use client"
// ...existing code...
// Removed MUI (TextField, InputAdornment, etc.)
import { useRouterQuery } from "../../hooks/router-query"
import { useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("name") || "")
  const rq = useRouterQuery({ name: "" })

  const debouncedSearch = useCallback((value: string) => {
    const handler = setTimeout(() => rq.replace({ name: value }), 300)
    return () => clearTimeout(handler)
  }, [rq])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  return (
    <div className="relative w-64">
      <svg
        className="absolute left-2 top-2 h-5 w-5 text-gray-400 pointer-events-none"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M12.9 14.32l4.38 4.38-1.42 1.42-4.38-4.38a7 7 0 111.42-1.42zM8 14A6 6 0 108 2a6 6 0 000 12z" />
      </svg>
      <Input
        className="pl-8 pr-2"
        placeholder="Search clients"
        value={searchTerm}
        onChange={onChange}
      />
    </div>
  )
}