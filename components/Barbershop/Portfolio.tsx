"use client"

import { useState, useEffect, useRef } from "react";
import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { PlusIcon, X } from "lucide-react";
import { getHaircuts, uploadHaircut } from "@/services/haircuts";
import Link from "next/link";
import { StaffRoleEnum } from "@/types/user";

export default function PortfolioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { toast } = useToast();
  const { user } = useUser();

  const isBarber = user?.Role === StaffRoleEnum.BARBER
  const isSuperAdmin = user?.Role === StaffRoleEnum.SUPERADMIN

  // Use ref to prevent multiple fetches
  const fetchCompleted = useRef(false);

  // Fetch haircut images
  useEffect(() => {
    // Only fetch once
    if (fetchCompleted.current) return;

    const fetchHaircuts = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        // If user is a barber and not admin/superadmin, only fetch their images
        const barberId = selectedBarber ||
          (isBarber && !isSuperAdmin ? user?.ID : undefined);

        console.log("Fetching haircuts with barberId:", barberId);

        const fetchedImages = await getHaircuts(barberId);
        console.log("Fetched images:", fetchedImages);
        setImages(fetchedImages || []);
        fetchCompleted.current = true;
      } catch (error) {
        console.error("Error fetching haircut images:", error);
        setFetchError("Failed to load haircut images. Please try again later.");
        toast({ status: "error", description: "Failed to load haircut images" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHaircuts();
  }, [selectedBarber, user?.ID, toast]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!uploadFile || !user?.Jwt) {
      toast({ status: "error", description: "No file selected or not logged in" });
      return;
    }

    try {
      setUploading(true);
      await uploadHaircut(uploadFile, user.Jwt);
      toast({ status: "success", description: "Image uploaded successfully" });

      // Refresh images
      const barberId = selectedBarber ||
        (isBarber && !isSuperAdmin ? user?.ID : undefined);
      const fetchedImages = await getHaircuts(barberId);
      setImages(fetchedImages || []);

      // Close modal and reset
      setUploadModalOpen(false);
      setUploadFile(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ status: "error", description: "Failed to upload image" });
    } finally {
      setUploading(false);
    }
  };

  // Add retry button for error state
  const handleRetry = () => {
    fetchCompleted.current = false;
    const fetchHaircuts = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const barberId = selectedBarber ||
          (isBarber && !isSuperAdmin ? user?.ID : undefined);

        const fetchedImages = await getHaircuts(barberId);
        setImages(fetchedImages || []);
        fetchCompleted.current = true;
      } catch (error) {
        console.error("Error retrying haircut images fetch:", error);
        setFetchError("Failed to load haircut images. Please try again later.");
        toast({ status: "error", description: "Failed to load haircut images" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHaircuts();
  };

  return (
    <div className="flex-1 space-y-4 p-6 pt-6">
      <div className="flex items-center justify-between">
        <Heading title="Haircut Portfolio" description="Showcase your best haircuts" />
        <Button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Image
        </Button>
      </div>
      <Separator />

      <Link href="/manage/barbershop">
        <Button variant="outline" className="mb-4">← Back to Barbershop</Button>
      </Link>

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading portfolio images...</p>
          </div>
        ) : fetchError ? (
          <div className="col-span-3 text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-destructive">{fetchError}</p>
            <Button
              variant="outline"
              onClick={handleRetry}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : images && images.length > 0 ? (
          images.map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden shadow-md aspect-square">
              <img
                src={image}
                alt={`Haircut ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No images in portfolio yet</p>
            <Button
              variant="outline"
              onClick={() => setUploadModalOpen(true)}
              className="mt-4"
            >
              Upload your first image
            </Button>
          </div>
        )}
      </div>

      {/* Upload Modal - Only render when open */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Haircut Image</h2>
              <Button variant="ghost" size="icon" onClick={() => setUploadModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="block cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                >
                  {uploadFile ? (
                    <div className="space-y-2">
                      <p className="text-foreground font-medium">{uploadFile.name}</p>
                      <p className="text-sm">Click to change file</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p>Click to select an image</p>
                      <p className="text-sm">(JPG, PNG, WebP formats accepted)</p>
                    </div>
                  )}
                </label>
              </div>

              {uploadFile && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(uploadFile)}
                    alt="Preview"
                    className="max-h-40 rounded"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setUploadModalOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}