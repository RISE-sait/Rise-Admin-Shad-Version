"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { CreatePromoVideoRequest, PromoVideo } from "@/types/website-promo";
import { createPromoVideo, updatePromoVideo, uploadPromoImage, uploadPromoVideo } from "@/services/website-promo";
import { Video, Upload, Loader2, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

interface PromoVideoFormProps {
  promoVideo?: PromoVideo;
  onSuccess?: () => Promise<void> | void;
}

type PromoVideoFormValues = {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url: string;
  category?: string;
  display_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
};

export default function PromoVideoForm({ promoVideo, onSuccess }: PromoVideoFormProps) {
  const { user } = useUser();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>(promoVideo?.video_url || "");
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>(promoVideo?.thumbnail_url || "");

  const isEditing = !!promoVideo;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PromoVideoFormValues>({
    defaultValues: {
      title: promoVideo?.title || "",
      description: promoVideo?.description || "",
      video_url: promoVideo?.video_url || "",
      thumbnail_url: promoVideo?.thumbnail_url || "",
      category: promoVideo?.category || "highlight",
      display_order: promoVideo?.display_order || 1,
      is_active: promoVideo?.is_active ?? true,
      start_date: promoVideo?.start_date?.split("T")[0] || "",
      end_date: promoVideo?.end_date?.split("T")[0] || "",
    },
  });

  const isActive = watch("is_active");

  const handleVideoFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.Jwt) return;

    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an MP4, WebM, or MOV video.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size exceeds 100MB limit.");
      return;
    }

    setIsUploadingVideo(true);
    try {
      const url = await uploadPromoVideo(file, "video", user.Jwt);
      setValue("video_url", url);
      setVideoPreviewUrl(url);
      toast.success("Video uploaded successfully");
    } catch (error) {
      console.error("Failed to upload video:", error);
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleThumbnailFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.Jwt) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size exceeds 20MB limit.");
      return;
    }

    setIsUploadingThumbnail(true);
    try {
      const url = await uploadPromoImage(file, "video", user.Jwt);
      setValue("thumbnail_url", url);
      setThumbnailPreviewUrl(url);
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      console.error("Failed to upload thumbnail:", error);
      toast.error("Failed to upload thumbnail. Please try again.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!user?.Jwt) {
      toast.error("You must be logged in.");
      return;
    }

    if (!values.video_url) {
      toast.error("Please upload a video.");
      return;
    }

    if (!values.thumbnail_url) {
      toast.error("Please upload a thumbnail image.");
      return;
    }

    // Convert date strings to ISO format or undefined
    const startDate = values.start_date ? new Date(values.start_date).toISOString() : undefined;
    const endDate = values.end_date ? new Date(values.end_date).toISOString() : undefined;

    const payload: CreatePromoVideoRequest = {
      title: values.title,
      description: values.description || undefined,
      video_url: values.video_url,
      thumbnail_url: values.thumbnail_url,
      category: values.category || "highlight",
      display_order: values.display_order,
      is_active: values.is_active,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      if (isEditing && promoVideo) {
        await updatePromoVideo(promoVideo.id, payload, user.Jwt);
        toast.success("Promo video updated successfully");
      } else {
        await createPromoVideo(payload, user.Jwt);
        toast.success("Promo video created successfully");
      }
      await onSuccess?.();
    } catch (error) {
      console.error("Failed to save promo video:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} promo video. Please try again.`);
    }
  });

  return (
    <form className="space-y-6 pt-3" onSubmit={onSubmit}>
      {/* Basic Information */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Basic Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                {...register("title", { required: "Title is required." })}
                placeholder="Enter title"
                className="bg-background"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={3}
                {...register("description")}
                placeholder="Enter description (optional)"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input
                {...register("category")}
                placeholder="e.g., highlight, event, training"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Used to filter videos on the website. Default: highlight
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Upload */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Video</h3>
          </div>
          <div className="space-y-4">
            <input
              type="hidden"
              {...register("video_url", { required: "Video is required." })}
            />

            {videoPreviewUrl && (
              <div className="relative">
                <video
                  src={videoPreviewUrl}
                  className="w-full h-48 object-cover rounded-lg border"
                  controls
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploadingVideo}
              >
                {isUploadingVideo ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {videoPreviewUrl ? "Change Video" : "Upload Video"}
                  </>
                )}
              </Button>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleVideoFileSelect}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                MP4, WebM, MOV (max 100MB)
              </span>
            </div>
            {errors.video_url && (
              <p className="text-xs text-red-500">{errors.video_url.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Thumbnail Upload */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Thumbnail</h3>
          </div>
          <div className="space-y-4">
            <input
              type="hidden"
              {...register("thumbnail_url", { required: "Thumbnail is required." })}
            />

            {thumbnailPreviewUrl && (
              <div className="relative">
                <img
                  src={thumbnailPreviewUrl}
                  alt="Thumbnail Preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={isUploadingThumbnail}
              >
                {isUploadingThumbnail ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {thumbnailPreviewUrl ? "Change Thumbnail" : "Upload Thumbnail"}
                  </>
                )}
              </Button>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleThumbnailFileSelect}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                JPG, PNG, GIF, WebP (max 20MB)
              </span>
            </div>
            {errors.thumbnail_url && (
              <p className="text-xs text-red-500">{errors.thumbnail_url.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Display Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Display Order <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={1}
                {...register("display_order", {
                  required: "Display order is required.",
                  valueAsNumber: true,
                  min: { value: 1, message: "Must be at least 1" },
                })}
                className="bg-background"
              />
              {errors.display_order && (
                <p className="text-xs text-red-500">{errors.display_order.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  {...register("start_date")}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Leave empty to show immediately</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  {...register("end_date")}
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Leave empty to show indefinitely</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || isUploadingVideo || isUploadingThumbnail}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Video className="h-5 w-5 mr-2" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Promo Video" : "Create Promo Video"}
        </Button>
      </div>
    </form>
  );
}
