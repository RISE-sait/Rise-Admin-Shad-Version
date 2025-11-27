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
import { CreateHeroPromoRequest, HeroPromo } from "@/types/website-promo";
import { createHeroPromo, updateHeroPromo, uploadPromoImage } from "@/services/website-promo";
import { Image, Upload, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface HeroPromoFormProps {
  heroPromo?: HeroPromo;
  onSuccess?: () => Promise<void> | void;
}

type HeroPromoFormValues = {
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(heroPromo?.image_url || "");

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
      image_url: heroPromo?.image_url || "",
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.Jwt) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.");
      return;
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size exceeds 20MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadPromoImage(file, "hero", user.Jwt);
      setValue("image_url", url);
      setPreviewUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!user?.Jwt) {
      toast.error("You must be logged in.");
      return;
    }

    if (!values.image_url) {
      toast.error("Please upload an image.");
      return;
    }

    // Convert date strings to ISO format or undefined
    const startDate = values.start_date ? new Date(values.start_date).toISOString() : undefined;
    const endDate = values.end_date ? new Date(values.end_date).toISOString() : undefined;

    const payload: CreateHeroPromoRequest = {
      title: values.title,
      subtitle: values.subtitle || undefined,
      description: values.description || undefined,
      image_url: values.image_url,
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
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-blue-500" />
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

      {/* Image Upload */}
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Image</h3>
          </div>
          <div className="space-y-4">
            <input
              type="hidden"
              {...register("image_url", { required: "Image is required." })}
            />

            {previewUrl && (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}

            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {previewUrl ? "Change Image" : "Upload Image"}
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                JPG, PNG, GIF, WebP (max 20MB)
              </span>
            </div>
            {errors.image_url && (
              <p className="text-xs text-red-500">{errors.image_url.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Button Configuration */}
      <Card className="border-l-4 border-l-blue-500">
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
      <Card className="border-l-4 border-l-blue-500">
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
          disabled={isSubmitting || isUploading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Image className="h-5 w-5 mr-2" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Hero Promo" : "Create Hero Promo"}
        </Button>
      </div>
    </form>
  );
}
