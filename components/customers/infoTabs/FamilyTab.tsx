"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  Link2,
  Unlink,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/customer";
import {
  getChildrenByParentId,
  getCustomerById,
  adminUnlinkChild,
} from "@/services/customer";
import { useUser } from "@/contexts/UserContext";
import LinkChildDialog from "../LinkChildDialog";

interface FamilyTabProps {
  customer: Customer;
  onCustomerUpdated?: (updated: Partial<Customer>) => void;
}

export default function FamilyTab({
  customer,
  onCustomerUpdated,
}: FamilyTabProps) {
  const { toast } = useToast();
  const { user } = useUser();

  const [children, setChildren] = useState<Customer[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  const [parentCustomer, setParentCustomer] = useState<Customer | null>(null);
  const [isLoadingParent, setIsLoadingParent] = useState(false);

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [childToUnlink, setChildToUnlink] = useState<Customer | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [unlinkFromParentDialogOpen, setUnlinkFromParentDialogOpen] =
    useState(false);
  const [isUnlinkingFromParent, setIsUnlinkingFromParent] = useState(false);

  const isChild = !!customer.parent_id;

  const fetchChildren = useCallback(async () => {
    if (!user?.Jwt || !customer.id) return;
    setIsLoadingChildren(true);
    try {
      const result = await getChildrenByParentId(customer.id, user.Jwt);
      setChildren(result);
    } catch {
      toast({
        status: "error",
        description: "Failed to load children",
        variant: "destructive",
      });
    } finally {
      setIsLoadingChildren(false);
    }
  }, [customer.id, user?.Jwt, toast]);

  const fetchParent = useCallback(async () => {
    if (!user?.Jwt || !customer.parent_id) return;
    setIsLoadingParent(true);
    try {
      const result = await getCustomerById(customer.parent_id, user.Jwt);
      setParentCustomer(result);
    } catch {
      toast({
        status: "error",
        description: "Failed to load parent information",
        variant: "destructive",
      });
    } finally {
      setIsLoadingParent(false);
    }
  }, [customer.parent_id, user?.Jwt, toast]);

  useEffect(() => {
    if (isChild) {
      fetchParent();
    }
    fetchChildren();
  }, [isChild, fetchParent, fetchChildren]);

  const handleUnlinkChild = async () => {
    if (!childToUnlink || !user?.Jwt) return;
    setIsUnlinking(true);
    try {
      const error = await adminUnlinkChild(childToUnlink.id, user.Jwt);
      if (error) {
        toast({
          status: "error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: `${childToUnlink.first_name} ${childToUnlink.last_name} has been unlinked`,
        });
        fetchChildren();
      }
    } catch {
      toast({
        status: "error",
        description: "Failed to unlink child",
        variant: "destructive",
      });
    } finally {
      setIsUnlinking(false);
      setUnlinkDialogOpen(false);
      setChildToUnlink(null);
    }
  };

  const handleUnlinkFromParent = async () => {
    if (!user?.Jwt || !customer.id) return;
    setIsUnlinkingFromParent(true);
    try {
      const error = await adminUnlinkChild(customer.id, user.Jwt);
      if (error) {
        toast({
          status: "error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: "Unlinked from parent account",
        });
        setParentCustomer(null);
        onCustomerUpdated?.({ parent_id: null });
      }
    } catch {
      toast({
        status: "error",
        description: "Failed to unlink from parent",
        variant: "destructive",
      });
    } finally {
      setIsUnlinkingFromParent(false);
      setUnlinkFromParentDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Parent Info Section */}
      {isChild && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg">Parent Account</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setUnlinkFromParentDialogOpen(true)}
              >
                <Unlink className="h-3 w-3 mr-1" />
                Unlink
              </Button>
            </div>

            {isLoadingParent ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : parentCustomer ? (
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">
                    {parentCustomer.first_name} {parentCustomer.last_name}
                  </p>
                  {parentCustomer.email && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {parentCustomer.email}
                    </div>
                  )}
                  {parentCustomer.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {parentCustomer.phone}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Parent information unavailable
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Children Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">
                Children
                {children.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {children.length}
                  </Badge>
                )}
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLinkDialogOpen(true)}
            >
              <Link2 className="h-3 w-3 mr-1" />
              Link Child
            </Button>
          </div>

          {isLoadingChildren ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No children linked to this account
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the button above to initiate a link request
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {child.first_name} {child.last_name}
                      </p>
                      {child.email && (
                        <p className="text-xs text-muted-foreground">
                          {child.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setChildToUnlink(child);
                      setUnlinkDialogOpen(true);
                    }}
                  >
                    <Unlink className="h-3 w-3 mr-1" />
                    Unlink
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Link Child Dialog */}
      {user?.Jwt && (
        <LinkChildDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          jwt={user.Jwt}
          onLinkRequested={fetchChildren}
        />
      )}

      {/* Unlink Child Confirmation */}
      <AlertDialog open={unlinkDialogOpen} onOpenChange={setUnlinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Child Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink{" "}
              <strong>
                {childToUnlink?.first_name} {childToUnlink?.last_name}
              </strong>{" "}
              from this parent account? The child&apos;s account will not be
              deleted, only the parent-child association will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnlinking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkChild}
              disabled={isUnlinking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUnlinking ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unlink from Parent Confirmation */}
      <AlertDialog
        open={unlinkFromParentDialogOpen}
        onOpenChange={setUnlinkFromParentDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink from Parent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the parent association for{" "}
              <strong>
                {customer.first_name} {customer.last_name}
              </strong>
              ? This will make the account independent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnlinkingFromParent}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkFromParent}
              disabled={isUnlinkingFromParent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUnlinkingFromParent ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
