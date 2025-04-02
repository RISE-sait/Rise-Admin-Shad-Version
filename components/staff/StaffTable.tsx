"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash, UserX, ArrowUpDown } from "lucide-react"
import { StaffResponseDto } from "@/app/api/Api"
import { Badge } from "@/components/ui/badge"
import { ApiService } from "@/app/api/ApiService"
import { toast } from "./toast"
import { AlertModal } from "../ui/AlertModal"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StaffTableProps {
  data: StaffResponseDto[]
  loading: boolean
  onStaffSelect: (staff: StaffResponseDto) => void
  onDelete?: () => void
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
}

export default function StaffTable({ data, loading, onStaffSelect, onDelete, selectedIds, onSelectionChange }: StaffTableProps) {
  const [open, setOpen] = useState(false)
  const [loading_, setLoading] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(0)
  const [sortField, setSortField] = useState<keyof StaffResponseDto>('first_name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleDelete = async () => {
    if (!staffToDelete) return
    try {
      setLoading(true)
      await ApiService.staffs.staffsDelete(staffToDelete)
      toast({ title: "Success", description: "Staff member deleted successfully." })
      if (onDelete) onDelete()
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast({ variant: "destructive", title: "Error", description: "Failed to delete staff member." })
    } finally {
      setOpen(false)
      setLoading(false)
      setStaffToDelete(null)
    }
  }

  const confirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setStaffToDelete(id)
    setOpen(true)
  }

  const handleCheckboxChange = (id: string) => (checked: boolean) => {
    const newSelectedIds = checked ? [...selectedIds, id] : selectedIds.filter(selectedId => selectedId !== id)
    onSelectionChange(newSelectedIds)
  }

  const toggleSelectAll = (checked: boolean) => {
    const currentPageIds = paginatedData.map(staff => staff.id!)
    let newSelectedIds: string[]
    if (checked) newSelectedIds = [...new Set([...selectedIds, ...currentPageIds])]
    else newSelectedIds = selectedIds.filter(id => !currentPageIds.includes(id))
    onSelectionChange(newSelectedIds)
  }

  const handleSort = (field: keyof StaffResponseDto) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDirection('asc') }
  }

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
  
    // Case 1: Both values are undefined, treat them as equal
    if (aValue === undefined && bValue === undefined) return 0
  
    // Case 2: aValue is undefined, treat it as greater than bValue
    if (aValue === undefined) return sortDirection === 'asc' ? 1 : -1
  
    // Case 3: bValue is undefined, treat it as greater than aValue
    if (bValue === undefined) return sortDirection === 'asc' ? -1 : 1
  
    // Case 4: Both values are defined, perform the comparison
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const paginatedData = sortedData.slice(page * pageSize, (page + 1) * pageSize)
  const totalPages = Math.ceil(sortedData.length / pageSize)

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={handleDelete} loading={loading_} />
      <div className="flex flex-col gap-4">
        <div className="rounded-xl overflow-hidden border">
          <Table className="border-collapse">
            <TableHeader className="bg-muted/100 sticky top-0 z-10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[50px] px-6 py-4">
                  <Checkbox checked={paginatedData.length > 0 && paginatedData.every(staff => selectedIds.includes(staff.id!))} onCheckedChange={toggleSelectAll} onClick={e => e.stopPropagation()} />
                </TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[220px]">
                  <Button variant="ghost" onClick={() => handleSort('first_name')}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[150px]">
                  <Button variant="ghost" onClick={() => handleSort('role_name')}>
                    Role <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[220px]">
                  <Button variant="ghost" onClick={() => handleSort('email')}>
                    Email <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[150px]">
                  <Button variant="ghost" onClick={() => handleSort('phone')}>
                    Phone <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b w-[120px]">
                  <Button variant="ghost" onClick={() => handleSort('is_active')}>
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b">
                    <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-[180px]" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-[130px]" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-[180px]" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-[130px]" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-[80px]" /></TableCell>
                    <TableCell className="px-6 py-4"><Skeleton className="h-6 w-[60px] ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center py-10 text-muted-foreground">
                    <div className="flex flex-col items-center space-y-2">
                      <UserX className="h-8 w-8 text-muted-foreground/70" />
                      <span>No staff members found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((staff) => (
                  <TableRow key={staff.id} className={`border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer ${selectedIds.includes(staff.id!) ? 'bg-muted' : ''}`} onClick={() => onStaffSelect(staff)}>
                    <TableCell className="px-6 py-4">
                      <Checkbox checked={selectedIds.includes(staff.id!)} onCheckedChange={handleCheckboxChange(staff.id!)} onClick={e => e.stopPropagation()} />
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium">{staff.first_name} {staff.last_name}</TableCell>
                    <TableCell className="px-6 py-4 text-sm">{staff.role_name}</TableCell>
                    <TableCell className="px-6 py-4 text-sm">{staff.email || "—"}</TableCell>
                    <TableCell className="px-6 py-4 text-sm">{staff.phone || "—"}</TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      <Badge variant={staff.is_active ? "default" : "destructive"} className="font-normal">
                        {staff.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border bg-popover text-popover-foreground">
                          <DropdownMenuLabel className="px-3 py-2">Staff Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="px-3 py-2 hover:bg-accent cursor-pointer" onClick={e => { e.stopPropagation(); onStaffSelect(staff) }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={e => confirmDelete(staff.id!, e)} className="px-3 py-2 hover:bg-destructive/10 cursor-pointer text-destructive">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-muted/30 px-6 py-4 border-t rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{Math.min(paginatedData.length, pageSize)}</span> of <span className="font-semibold">{sortedData.length}</span> staff members
              {selectedIds.length > 0 && <span> ({selectedIds.length} selected)</span>}
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <Select value={String(pageSize)} onValueChange={value => { setPageSize(Number(value)); setPage(0) }}>
                  <SelectTrigger className="h-8 w-[70px]"><SelectValue /></SelectTrigger>
                  <SelectContent className="border">{[5, 10, 20, 50, 100].map(size => <SelectItem key={size} value={String(size)} className="text-sm">{size}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="border hover:bg-accent hover:text-accent-foreground" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Previous</Button>
                <Button variant="outline" size="sm" className="border hover:bg-accent hover:text-accent-foreground" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}