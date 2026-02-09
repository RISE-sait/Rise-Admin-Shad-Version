"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Loader2,
  Mail,
  Phone,
  FileText,
  Linkedin,
  Globe,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { RatingStars } from "./RatingStars";
import { ApplicationStatusBadge } from "./StatusBadge";
import type { Application, ApplicationStatus } from "@/types/careers";

interface ApplicationDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
  onStatusChange: (id: string, status: ApplicationStatus) => Promise<void>;
  onNotesChange: (id: string, notes: string) => Promise<void>;
  onRatingChange: (id: string, rating: number) => Promise<void>;
}

export function ApplicationDetailPanel({
  open,
  onOpenChange,
  application,
  onStatusChange,
  onNotesChange,
  onRatingChange,
}: ApplicationDetailPanelProps) {
  const [status, setStatus] = useState<ApplicationStatus>("received");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingRating, setSavingRating] = useState(false);

  // Sync state when application changes
  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setRating(application.rating || 0);
      setNotes(application.internal_notes || "");
    }
  }, [application]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;
    setStatus(newStatus);
    setSavingStatus(true);
    try {
      await onStatusChange(application.id, newStatus);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleRatingChange = async (newRating: number) => {
    if (!application) return;
    setRating(newRating);
    setSavingRating(true);
    try {
      await onRatingChange(application.id, newRating);
    } finally {
      setSavingRating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!application) return;
    setSavingNotes(true);
    try {
      await onNotesChange(application.id, notes);
    } finally {
      setSavingNotes(false);
    }
  };

  if (!application) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {application.first_name} {application.last_name}
          </SheetTitle>
          <SheetDescription>
            Applied on{" "}
            {application.created_at
              ? format(new Date(application.created_at), "MMM d, yyyy")
              : "N/A"}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6 pt-4">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Contact Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${application.email}`}
                    className="text-primary hover:underline"
                  >
                    {application.email}
                  </a>
                </div>

                {application.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${application.phone}`}
                      className="text-primary hover:underline"
                    >
                      {application.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Links & Documents
              </h3>

              <div className="space-y-3">
                {application.resume_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={application.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      View Resume
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {application.linkedin_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <Linkedin className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={application.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      LinkedIn Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {application.portfolio_url && (
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={application.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Portfolio
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {!application.resume_url &&
                  !application.linkedin_url &&
                  !application.portfolio_url && (
                    <p className="text-sm text-muted-foreground">
                      No links or documents provided
                    </p>
                  )}
              </div>
            </div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Cover Letter
                </h3>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-sm whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6 pt-4">
            {/* Current Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <Label className="text-sm text-muted-foreground">
                  Current Status
                </Label>
                <div className="mt-1">
                  <ApplicationStatusBadge status={status} />
                </div>
              </div>
              {savingStatus && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Status Change */}
            <div className="space-y-2">
              <Label>Update Status</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  handleStatusChange(v as ApplicationStatus)
                }
                disabled={savingStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rating</Label>
                {savingRating && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <RatingStars
                  rating={rating}
                  size="lg"
                  editable
                  onChange={handleRatingChange}
                />
                <span className="text-sm text-muted-foreground">
                  {rating > 0 ? `${rating}/5` : "Not rated"}
                </span>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add notes about this applicant..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
              />
              <Button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                size="sm"
              >
                {savingNotes && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Save Notes
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
