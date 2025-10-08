import { CreditPackage } from "@/types/credit-package";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DESCRIPTION_PREVIEW_LIMIT = 80;

export const columns: ColumnDef<CreditPackage>[] = [
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
    size: 240,
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = (row.getValue("description") as string) ?? "";
      if (!description) {
        return "";
      }
      return description.length > DESCRIPTION_PREVIEW_LIMIT
        ? `${description.slice(0, DESCRIPTION_PREVIEW_LIMIT)}...`
        : description;
    },
    minSize: 220,
    size: 360,
  },
  {
    id: "credit_allocation",
    accessorKey: "credit_allocation",
    header: "Credit Allocation",
    cell: ({ row }) => {
      const value = row.getValue("credit_allocation") as number;
      return value ?? "-";
    },
    minSize: 140,
    size: 180,
  },
  {
    id: "weekly_credit_limit",
    accessorKey: "weekly_credit_limit",
    header: "Weekly Limit",

    cell: ({ row }) => {
      const value = row.getValue("weekly_credit_limit") as number;
      return value ?? "-";
    },
    minSize: 140,
    size: 180,
  },
  {
    id: "stripe_price_id",
    accessorKey: "stripe_price_id",
    header: "Stripe Price ID",
    minSize: 200,
    size: 260,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row, table }) => {
      const creditPackage = row.original;
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
                Credit Package Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="px-3 py-2 hover:bg-accent cursor-pointer"
                onClick={() => {
                  const meta = table.options.meta as
                    | {
                        onCreditPackageSelect?: (
                          creditPackage: CreditPackage
                        ) => void;
                      }
                    | undefined;
                  meta?.onCreditPackageSelect?.(creditPackage);
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
