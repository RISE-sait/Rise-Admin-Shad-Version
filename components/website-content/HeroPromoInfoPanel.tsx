"use client";

import { useState } from "react";
import { HeroPromo } from "@/types/website-promo";
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
import { deleteHeroPromo } from "@/services/website-promo";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, Info, Calendar, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import HeroPromoForm from "./HeroPromoForm";

interface HeroPromoInfoPanelProps {
  heroPromo: HeroPromo;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function HeroPromoInfoPanel({
  heroPromo,
  onClose,
  onSuccess,
}: HeroPromoInfoPanelProps) {
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
    if (!heroPromo.is_active) return false;
    const now = new Date();
    if (heroPromo.start_date && new Date(heroPromo.start_date) > now) return false;
    if (heroPromo.end_date && new Date(heroPromo.end_date) < now) return false;
    return true;
  };

  const handleDelete = async () => {
    if (!user?.Jwt) return;
    setIsDeleting(true);
    try {
      await deleteHeroPromo(heroPromo.id, user.Jwt);
      toast.success("Hero promo deleted successfully");
      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete hero promo:", error);
      toast.error("Failed to delete hero promo");
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
            ) : heroPromo.is_active ? (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Scheduled
              </Badge>
            ) : (
              <Badge variant="secondary">Inactive</Badge>
            )}
          </div>

          {/* Image Preview */}
          <Card>
            <CardContent className="p-4">
              <img
                src={heroPromo.image_url}
                alt={heroPromo.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">{heroPromo.title}</h3>
              {heroPromo.subtitle && (
                <p className="text-muted-foreground">{heroPromo.subtitle}</p>
              )}
              {heroPromo.description && (
                <p className="text-sm">{heroPromo.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Button Info */}
          {(heroPromo.button_text || heroPromo.button_link) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Button</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Text:</span>{" "}
                    {heroPromo.button_text || "-"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Link:</span>{" "}
                    {heroPromo.button_link || "-"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  {heroPromo.display_order}
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>{" "}
                  {heroPromo.duration_seconds} seconds
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>{" "}
                  {formatDate(heroPromo.start_date)}
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>{" "}
                  {formatDate(heroPromo.end_date)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              <div>Created: {formatDate(heroPromo.created_at)}</div>
              <div>Updated: {formatDate(heroPromo.updated_at)}</div>
            </CardContent>
          </Card>

          <Separator />

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Hero Promo
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the hero promo &quot;{heroPromo.title}&quot;.
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
          {/* Hero Banner Preview */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full aspect-[16/6] bg-black">
                <img
                  src={heroPromo.image_url}
                  alt={heroPromo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">{heroPromo.title}</h1>
                  {heroPromo.subtitle && (
                    <p className="text-xl mb-2">{heroPromo.subtitle}</p>
                  )}
                  {heroPromo.description && (
                    <p className="text-sm opacity-90 max-w-md mb-4">
                      {heroPromo.description}
                    </p>
                  )}
                  {heroPromo.button_text && (
                    <Button className="w-fit">
                      {heroPromo.button_text}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            This is a preview of how the hero banner will appear on the website.
          </p>
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          <HeroPromoForm
            heroPromo={heroPromo}
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
