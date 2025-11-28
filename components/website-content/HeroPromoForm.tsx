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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@/contexts/UserContext";
import { CreateHeroPromoRequest, HeroPromo } from "@/types/website-promo";
import { createHeroPromo, updateHeroPromo, uploadPromoImage, uploadPromoVideo } from "@/services/website-promo";
import { Image, Upload, Loader2, Video, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

interface HeroPromoFormProps {
  heroPromo?: HeroPromo;
  onSuccess?: () => Promise<void> | void;
}

type HeroPromoFormValues = {
  title: string;
  subtitle?: string;
  description?: string;
  media_url: string;
  media_type: "image" | "video";
  thumbnail_url?: string;
  button_text?: string;
  button_link?: string;
  display_order: number;
  duration_seconds: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
};

export default function HeroPromoForm({ heroPromo, onSuccess }: HeroPromoFormProps) {
  const { user } = useUser();
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>(heroPromo?.media_url || "");
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>(heroPromo?.thumbnail_url || "");

  const isEditing = !!heroPromo;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<HeroPromoFormValues>({
    defaultValues: {
      title: heroPromo?.title || "",
      subtitle: heroPromo?.subtitle || "",
      description: heroPromo?.description || "",
      media_url: heroPromo?.media_url || "",
      media_type: heroPromo?.media_type || "image",
      thumbnail_url: heroPromo?.thumbnail_url || "",
      button_text: heroPromo?.button_text || "",
      button_link: heroPromo?.button_link || "",
      display_order: heroPromo?.display_order || 1,
      duration_seconds: heroPromo?.duration_seconds || 5,
      is_active: heroPromo?.is_active ?? true,
      start_date: heroPromo?.start_date?.split("T")[0] || "",
      end_date: heroPromo?.end_date?.split("T")[0] || "",
    },
  });

  const isActive = watch("is_active");
  const mediaType = watch("media_type");

  const handleMediaFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.Jwt) return;

    if (mediaType === "image") {
      // Validate image type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size exceeds 20MB limit.");
        return;
      }

      setIsUploadingMedia(true);
      try {
        const url = await uploadPromoImage(file, "hero", user.Jwt);
        setValue("media_url", url);
        setMediaPreviewUrl(url);
        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploadingMedia(false);
      }
    } else {
      // Validate video type
      const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload an MP4, WebM, or MOV video.");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size exceeds 100MB limit.");
        return;
      }

      setIsUploadingMedia(true);
      try {
        const url = await uploadPromoVideo(file, "hero", user.Jwt);
        setValue("media_url", url);
        setMediaPreviewUrl(url);
        toast.success("Video uploaded successfully");
      } catch (error) {
        console.error("Failed to upload video:", error);
        toast.error("Failed to upload video. Please try again.");
      } finally {
        setIsUploadingMedia(false);
      }
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
      const url = await uploadPromoImage(file, "hero", user.Jwt);
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

  const handleMediaTypeChange = (value: "image" | "video") => {
    setValue("media_type", value);
    // Clear media when switching types
    setValue("media_url", "");
    setMediaPreviewUrl("");
    if (value === "image") {
      setValue("thumbnail_url", "");
      setThumbnailPreviewUrl("");
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!user?.Jwt) {
      toast.error("You must be logged in.");
      return;
    }

    if (!values.media_url) {
      toast.error(`Please upload ${values.media_type === "video" ? "a video" : "an image"}.`);
      return;
    }

    // Thumbnail is optional for hero videos

    // Convert date strings to ISO format or undefined
    const startDate = values.start_date ? new Date(values.start_date).toISOString() : undefined;
    const endDate = values.end_date ? new Date(values.end_date).toISOString() : undefined;

    const payload: CreateHeroPromoRequest = {
      title: values.title,
      subtitle: values.subtitle || undefined,
      description: values.description || undefined,
      media_url: values.media_url,
      media_type: values.media_type,
      thumbnail_url: values.media_type === "video" ? values.thumbnail_url : undefined,
      button_text: values.button_text || undefined,
      button_link: values.button_link || undefined,
      display_order: values.display_order,
      duration_seconds: values.duration_seconds,
      is_active: values.is_active,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      if (isEditing && heroPromo) {
        await updateHeroPromo(heroPromo.id, payload, user.Jwt);
        toast.success("Hero promo updated successfully");
      } else {
        await createHeroPromo(payload, user.Jwt);
        toast.success("Hero promo created successfully");
      }
      await onSuccess?.();
    } catch (error) {
      console.error("Failed to save hero promo:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} hero promo. Please try again.`);
    }
  });

  return (
    <form className="space-y-6 pt-3" onSubmit={onSubmit}>
      {/* Basic Information */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-yellow-500" />
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
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                {...register("subtitle")}
                placeholder="Enter subtitle (optional)"
                className="bg-background"
              />
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
          </div>
        </CardContent>
      </Card>

      {/* Media Type Selection */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Media</h3>
          </div>
          <div className="space-y-4">
            {/* Media Type Radio */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Media Type</label>
              <RadioGroup
                value={mediaType}
                onValueChange={(v) => handleMediaTypeChange(v as "image" | "video")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="media-image" />
                  <Label htmlFor="media-image" className="flex items-center gap-1 cursor-pointer">
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="media-video" />
                  <Label htmlFor="media-video" className="flex items-center gap-1 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Video
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <input
              type="hidden"
              {...register("media_url", { required: `${mediaType === "video" ? "Video" : "Image"} is required.` })}
            />

            {/* Media Preview */}
            {mediaPreviewUrl && (
              <div className="relative">
                {mediaType === "video" ? (
                  <video
                    src={mediaPreviewUrl}
                    className="w-full h-48 object-cover rounded-lg border"
                    controls
                  />
                ) : (
                  <img
                    src={mediaPreviewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                )}
              </div>
            )}

            {/* Media Upload Button */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => mediaInputRef.current?.click()}
                disabled={isUploadingMedia}
              >
                {isUploadingMedia ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {mediaPreviewUrl ? `Change ${mediaType === "video" ? "Video" : "Image"}` : `Upload ${mediaType === "video" ? "Video" : "Image"}`}
                  </>
                )}
              </Button>
              <input
                ref={mediaInputRef}
                type="file"
                accept={mediaType === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/jpg,image/png,image/gif,image/webp"}
                onChange={handleMediaFileSelect}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                {mediaType === "video" ? "MP4, WebM, MOV (max 100MB)" : "JPG, PNG, GIF, WebP (max 20MB)"}
              </span>
            </div>
            {errors.media_url && (
              <p className="text-xs text-red-500">{errors.media_url.message}</p>
            )}

            {/* Thumbnail field - hidden, not needed for hero videos */}
            <input
              type="hidden"
              {...register("thumbnail_url")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Button Configuration */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Button (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Text</label>
              <Input
                {...register("button_text")}
                placeholder="e.g., Learn More"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Link</label>
              <Input
                {...register("button_link")}
                placeholder="e.g., /programs"
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Display Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Duration (seconds) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  {...register("duration_seconds", {
                    required: "Duration is required.",
                    valueAsNumber: true,
                    min: { value: 1, message: "Must be at least 1 second" },
                    max: { value: 60, message: "Maximum 60 seconds" },
                  })}
                  className="bg-background"
                />
                {errors.duration_seconds && (
                  <p className="text-xs text-red-500">{errors.duration_seconds.message}</p>
                )}
              </div>
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
          disabled={isSubmitting || isUploadingMedia || isUploadingThumbnail}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Image className="h-5 w-5 mr-2" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Hero Promo" : "Create Hero Promo"}
        </Button>
      </div>
    </form>
  );
}
