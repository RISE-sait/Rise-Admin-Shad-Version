"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SaveIcon, TrashIcon, Gamepad2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  updatePlaygroundSystem,
  deletePlaygroundSystem,
} from "@/services/playground";
import { revalidatePlayground } from "@/actions/serverActions";
import { PlaygroundSystem } from "@/types/playground";
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

export default function SystemInfoPanel({
  system,
  onClose,
  onChange,
}: {
  system: PlaygroundSystem;
  onClose?: () => void;
  onChange?: () => void;
}) {
  const [name, setName] = useState(system.name);
  const { user } = useUser();
  const { toast } = useToast();

  const handleSave = async () => {
    const error = await updatePlaygroundSystem(system.id, { name }, user?.Jwt!);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        status: "error",
      });
      return;
    }
    toast({
      title: "Success",
      description: "System updated",
      status: "success",
    });
    await revalidatePlayground();
    if (onChange) onChange();
  };

  const handleDelete = async () => {
    const error = await deletePlaygroundSystem(system.id, user?.Jwt!);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
        status: "error",
      });
      return;
    }
    toast({
      title: "Success",
      description: "System deleted",
      status: "success",
    });
    await revalidatePlayground();
    if (onChange) onChange();
    if (onClose) onClose();
  };

  return (
    <div className="space-y-6 pt-3">
      {/* System Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Gamepad2 className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">System Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                System Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex items-center justify-end gap-3 pt-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete System
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this system? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={handleSave}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
        >
          <SaveIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
