"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { requestFamilyLink } from "@/services/customer";

interface LinkChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jwt: string;
  onLinkRequested: () => void;
}

export default function LinkChildDialog({
  open,
  onOpenChange,
  jwt,
  onLinkRequested,
}: LinkChildDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const resetForm = () => {
    setEmail("");
    setSent(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      const result = await requestFamilyLink(email.trim(), jwt);
      if (result.error) {
        toast({
          status: "error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setSent(true);
        onLinkRequested();
      }
    } catch {
      toast({
        status: "error",
        description: "Failed to send link request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Link Child Account</DialogTitle>
          <DialogDescription>
            Send a link request to a customer&apos;s email. They will receive a
            verification code to confirm the parent-child association.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500" />
            <div>
              <p className="font-medium">Link request sent</p>
              <p className="text-sm text-muted-foreground mt-1">
                A verification email has been sent to{" "}
                <strong>{email}</strong>. The link will be established once
                they confirm with their verification code.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-email">Customer Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="link-email"
                  type="email"
                  placeholder="child@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email.trim()) handleSubmit();
                  }}
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={!email.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Link Request"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
