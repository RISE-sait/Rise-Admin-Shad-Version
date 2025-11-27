"use client";

import { useState } from "react";
import { FeatureCard } from "@/types/website-promo";
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
import { deleteFeatureCard } from "@/services/website-promo";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, Info, Calendar, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import FeatureCardForm from "./FeatureCardForm";

interface FeatureCardInfoPanelProps {
  featureCard: FeatureCard;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

export default function FeatureCardInfoPanel({
  featureCard,
  onClose,
  onSuccess,
}: FeatureCardInfoPanelProps) {
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
    if (!featureCard.is_active) return false;
    const now = new Date();
    if (featureCard.start_date && new Date(featureCard.start_date) > now) return false;
    if (featureCard.end_date && new Date(featureCard.end_date) < now) return false;
    return true;
  };

  const handleDelete = async () => {
    if (!user?.Jwt) return;
    setIsDeleting(true);
    try {
      await deleteFeatureCard(featureCard.id, user.Jwt);
      toast.success("Feature card deleted successfully");
      await onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to delete feature card:", error);
      toast.error("Failed to delete feature card");
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
            ) : featureCard.is_active ? (
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
                src={featureCard.image_url}
                alt={featureCard.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">{featureCard.title}</h3>
              {featureCard.description && (
                <p className="text-sm text-muted-foreground">{featureCard.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Button Info */}
          {(featureCard.button_text || featureCard.button_link) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Button</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Text:</span>{" "}
                    {featureCard.button_text || "-"}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Link:</span>{" "}
                    {featureCard.button_link || "-"}
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
                  {featureCard.display_order}
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>{" "}
                  {formatDate(featureCard.start_date)}
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>{" "}
                  {formatDate(featureCard.end_date)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              <div>Created: {formatDate(featureCard.created_at)}</div>
              <div>Updated: {formatDate(featureCard.updated_at)}</div>
            </CardContent>
          </Card>

          <Separator />

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Feature Card
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the feature card &quot;{featureCard.title}&quot;.
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
          {/* Feature Card Preview */}
          <Card className="overflow-hidden max-w-sm mx-auto">
            <CardContent className="p-0">
              <img
                src={featureCard.image_url}
                alt={featureCard.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{featureCard.title}</h3>
                {featureCard.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {featureCard.description}
                  </p>
                )}
                {featureCard.button_text && (
                  <Button variant="outline" size="sm">
                    {featureCard.button_text}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            This is a preview of how the feature card will appear on the website.
          </p>
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          <FeatureCardForm
            featureCard={featureCard}
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
