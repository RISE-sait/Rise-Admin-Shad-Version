"use client";

import * as React from "react";
import { PromoVideo } from "@/types/website-promo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FolderSearch, Video, Play } from "lucide-react";
import { format } from "date-fns";

interface PromoVideoTableProps {
  promoVideos: PromoVideo[];
  onSelect: (video: PromoVideo) => void;
  isLoading: boolean;
}

export default function PromoVideoTable({
  promoVideos,
  onSelect,
  isLoading,
}: PromoVideoTableProps) {
  // Sort by display_order
  const sortedVideos = [...promoVideos].sort((a, b) => a.display_order - b.display_order);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return "-";
    }
  };

  const isCurrentlyActive = (video: PromoVideo) => {
    if (!video.is_active) return false;
    const now = new Date();
    if (video.start_date && new Date(video.start_date) > now) return false;
    if (video.end_date && new Date(video.end_date) < now) return false;
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
              Thumbnail
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Title
            </TableHead>
            <TableHead className="px-6 py-4 text-sm font-semibold uppercase tracking-wider">
              Category
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
                  <span>Loading promo videos...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : sortedVideos.length > 0 ? (
            sortedVideos.map((video) => (
              <TableRow
                key={video.id}
                onClick={() => onSelect(video)}
                className="border-b hover:bg-muted/100 transition-colors duration-150 ease-in-out even:bg-muted/50 cursor-pointer"
              >
                <TableCell className="px-6 py-4 text-sm font-medium">
                  {video.display_order}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="relative h-12 w-20 rounded overflow-hidden bg-muted">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="h-4 w-4 text-white" fill="white" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm font-medium">
                  <div>
                    <div className="font-semibold">{video.title}</div>
                    {video.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {video.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge variant="outline" className="capitalize">
                    {video.category || "highlight"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  {formatDate(video.start_date)}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm">
                  {formatDate(video.end_date)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {isCurrentlyActive(video) ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  ) : video.is_active ? (
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
                  <span>No promo videos found</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
