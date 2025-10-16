import { Program } from "@/types/program";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const getProgramTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case "course":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "tournament":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "tryouts":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
    case "event":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  }
};

const columns: ColumnDef<Program>[] = [
  {
    id: "photo_url",
    accessorKey: "photo_url",
    header: () => <span className="sr-only">Photo</span>,
    cell: ({ row }) => {
      const program = row.original;
      const photoUrl = row.getValue("photo_url") as string | undefined;
      const initials = program.name
        ?.split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div className="flex justify-center">
          <Avatar className="h-10 w-10">
            {photoUrl ? (
              <AvatarImage src={photoUrl} alt={`${program.name} thumbnail`} />
            ) : (
              <AvatarFallback>{initials || "P"}</AvatarFallback>
            )}
          </Avatar>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    minSize: 70,
    size: 70,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    minSize: 180,
    size: 250,
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = (row.getValue("type") as string) || "other";
      return (
        <Badge variant="outline" className={`${getProgramTypeColor(type)}`}>
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
        </Badge>
      );
    },
    minSize: 100,
    size: 120,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const desc = row.getValue("description") as string;
      return desc?.length > 60 ? desc.slice(0, 60) + "..." : desc || "";
    },
    minSize: 250,
    size: 400,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const program = row.original;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border bg-popover text-popover-foreground"
            >
              <DropdownMenuLabel className="px-3 py-2">
                Program Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const onSelect = (table.options.meta as any)
                    ?.onPracticeSelect;
                  onSelect?.(program);
                }}
              >
                <span>Edit</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    minSize: 80,
    size: 120,
  },
];

export default columns;
