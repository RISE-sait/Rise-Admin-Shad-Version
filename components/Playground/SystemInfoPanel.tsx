"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SaveIcon, TrashIcon } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">System Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700"
        >
          <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" /> Delete
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
              <AlertDialogAction onClick={handleDelete}>
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
