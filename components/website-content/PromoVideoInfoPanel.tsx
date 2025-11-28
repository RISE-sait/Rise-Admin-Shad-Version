"use client";

import { useState } from "react";
import { PromoVideo } from "@/types/website-promo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@/contexts/UserContext";
import { deletePromoVideo } from "@/services/website-promo";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, Info, Calendar, Video, Play } from "lucide-react";
import { format } from "date-fns";
import PromoVideoForm from "./PromoVideoForm";

interface PromoVideoInfoPanelProps {
  promoVideo: PromoVideo;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function PromoVideoInfoPanel({
  promoVideo,
  onClose,
  onSuccess,
}: PromoVideoInfoPanelProps) {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Not set";
    try {
      return format(new Date(dateStr), "MMMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const isCurrentlyActive = () => {
    if (!promoVideo.is_active) return false;
    const now = new Date();
    if (promoVideo.start_date && new Date(promoVideo.start_date) > now) return false;
    if (promoVideo.end_date && new Date(promoVideo.end_date) < now) return false;
    return true;
  };

  const handleDelete = async () => {
    if (!user?.Jwt) return;
    setIsDeleting(true);
    try {
      await deletePromoVideo(promoVideo.id, user.Jwt);
      toast.success("Promo video deleted successfully");
      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete promo video:", error);
      toast.error("Failed to delete promo video");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isCurrentlyActive() ? (
              <Badge className="bg-green-500">Currently Active</Badge>
            ) : promoVideo.is_active ? (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Scheduled
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
            {promoVideo.category && (
              <Badge variant="outline" className="capitalize">
                {promoVideo.category}
              </Badge>
            )}
          </div>

          {/* Video Preview */}
          <Card>
            <CardContent className="p-4">
              <video
                src={promoVideo.video_url}
                poster={promoVideo.thumbnail_url}
                className="w-full h-48 object-cover rounded-lg"
                controls
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">{promoVideo.title}</h3>
              {promoVideo.description && (
                <p className="text-sm text-muted-foreground">{promoVideo.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Display Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Display Order:</span>{" "}
                  {promoVideo.display_order}
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  {promoVideo.category || "highlight"}
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>{" "}
                  {formatDate(promoVideo.start_date)}
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>{" "}
                  {formatDate(promoVideo.end_date)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              <div>Created: {formatDate(promoVideo.created_at)}</div>
              <div>Updated: {formatDate(promoVideo.updated_at)}</div>
            </CardContent>
          </Card>

          <Separator />

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Promo Video
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the promo video &quot;{promoVideo.title}&quot;.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          {/* Video Card Preview */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-black">
                <video
                  src={promoVideo.video_url}
                  poster={promoVideo.thumbnail_url}
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{promoVideo.title}</h3>
                {promoVideo.description && (
                  <p className="text-sm text-muted-foreground mt-1">{promoVideo.description}</p>
                )}
                {promoVideo.category && (
                  <Badge variant="outline" className="mt-2 capitalize">
                    {promoVideo.category}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            This is a preview of how the video card will appear on the website.
          </p>
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          <PromoVideoForm
            promoVideo={promoVideo}
            onSuccess={async () => {
              await onSuccess();
              setActiveTab("details");
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
