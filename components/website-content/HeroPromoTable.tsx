"use client";

import * as React from "react";
import { HeroPromo } from "@/types/website-promo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FolderSearch } from "lucide-react";
import { format } from "date-fns";

interface HeroPromoTableProps {
  heroPromos: HeroPromo[];
  onSelect: (promo: HeroPromo) => void;
  isLoading: boolean;
}

export default function HeroPromoTable({
  heroPromos,
  onSelect,
  isLoading,
}: HeroPromoTableProps) {
  // Sort by display_order
  const sortedPromos = [...heroPromos].sort((a, b) => a.display_order - b.display_order);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return "-";
    }
  };

  const isCurrentlyActive = (promo: HeroPromo) => {
    if (!promo.is_active) return false;
    const now = new Date();
    if (promo.start_date && new Date(promo.start_date) > now) return false;
    if (promo.end_date && new Date(promo.end_date) < now) return false;
    return true;
  };

  return (
    <div className="rounded-xl overflow-hidden border">
      <Table className="border-collapse">
        <TableHeader className="bg-muted/100 sticky top-0 z-10">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Order
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Image
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Title
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Duration
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Start Date
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              End Date
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/70" />
                  <span>Loading hero promos...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : sortedPromos.length > 0 ? (
            sortedPromos.map((promo) => (
              <TableRow
                key={promo.id}
                onClick={() => onSelect(promo)}
                className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
              >
                <TableCell className="px-6 py-4 text-sm font-medium">
                  {promo.display_order}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <img
                    src={promo.image_url}
                    alt={promo.title}
                    className="h-12 w-20 object-cover rounded"
                  />
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium">
                  <div>
                    <div className="font-semibold">{promo.title}</div>
                    {promo.subtitle && (
                      <div className="text-xs text-muted-foreground">{promo.subtitle}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  {promo.duration_seconds}s
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  {formatDate(promo.start_date)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  {formatDate(promo.end_date)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {isCurrentlyActive(promo) ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  ) : promo.is_active ? (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Scheduled
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center space-y-2">
                  <FolderSearch className="h-8 w-8 text-muted-foreground/70" />
                  <span>No hero promos found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
