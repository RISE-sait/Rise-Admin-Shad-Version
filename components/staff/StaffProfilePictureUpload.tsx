"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadProfileImage, validateImageFile } from "@/services/upload";
import { updateStaffProfile } from "@/services/staff";
import { useUser } from "@/contexts/UserContext";
import { User, StaffRoleEnum } from "@/types/user";

interface StaffProfilePictureUploadProps {
  staffData: User;
  currentPhotoUrl?: string;
  isOwnProfile: boolean;
  isAdmin: boolean;
  onPhotoUpdate?: (photoUrl: string) => void;
}

export default function StaffProfilePictureUpload({
  staffData,
  currentPhotoUrl,
  isOwnProfile,
  isAdmin,
  onPhotoUpdate,
}: StaffProfilePictureUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(currentPhotoUrl || "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Prioritize local state over prop changes to prevent reverting after upload
  useEffect(() => {
    if (currentPhotoUrl) {
      if (currentPhotoUrl !== profilePicture) {
        setProfilePicture(currentPhotoUrl);
      }
    } else if (profilePicture) {
      setProfilePicture("");
    }
  }, [currentPhotoUrl, profilePicture]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useUser();
  const { toast } = useToast();

  // More robust permission checking
  const userRole = user?.StaffInfo?.Role || user?.Role;
  const isAdminRole =
    userRole === StaffRoleEnum.ADMIN || userRole === StaffRoleEnum.SUPERADMIN;
  const isOwner = user?.ID === staffData.ID;
  const canUpdate = isAdminRole || isOwner || isAdmin || isOwnProfile;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        status: "success",
        description:
          "File selected successfully. Click 'Update Profile Picture' to save.",
      });
    } catch (error) {
      toast({
        status: "error",
        description:
          error instanceof Error ? error.message : "Invalid file selected",
        variant: "destructive",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !canUpdate || !user?.Jwt) {
      return;
    }

    try {
      setUploading(true);

      toast({
        status: "info",
        description: "Uploading image...",
      });

      const cloudUrl = await uploadProfileImage(
        selectedFile,
        user.Jwt,
        staffData.ID
      );

      toast({
        status: "info",
        description: "Updating profile...",
      });

      await updateStaffProfile(staffData.ID, cloudUrl, user.Jwt);

      setProfilePicture(cloudUrl);
      setPreviewUrl(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onPhotoUpdate?.(cloudUrl);

      toast({
        status: "success",
        description: "Profile picture updated successfully!",
      });
    } catch (error) {
      toast({
        status: "error",
        description:
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarClick = () => {
    if (canUpdate && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = previewUrl || profilePicture;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <Avatar
            className={`h-24 w-24 ${canUpdate ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
            onClick={handleAvatarClick}
          >
            <AvatarImage src={displayImage} alt={staffData.Name} />
            <AvatarFallback className="text-lg">
              {getInitials(staffData.Name)}
            </AvatarFallback>
          </Avatar>

          {canUpdate && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleAvatarClick}
            >
              <Camera className="h-6 w-6 text-white" />
            </div>
          )}
        </div>

        <div className="text-center">
          <h3 className="font-medium">{staffData.Name}</h3>
          <p className="text-sm text-muted-foreground">
            {staffData.StaffInfo?.Role}
          </p>
        </div>
      </div>

      {canUpdate && (
        <div className="space-y-3">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {selectedFile ? "Change Photo" : "Select Photo"}
            </Button>

            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Update Profile Picture
                  </>
                )}
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Supported formats: JPG, PNG, GIF, WebP (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}
