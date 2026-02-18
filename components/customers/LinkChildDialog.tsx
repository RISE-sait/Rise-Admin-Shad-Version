"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Link2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/types/customer";
import { getCustomers, linkChildToParent } from "@/services/customer";

interface LinkChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string;
  jwt: string;
  existingChildIds: string[];
  onChildLinked: () => void;
}

export default function LinkChildDialog({
  open,
  onOpenChange,
  parentId,
  jwt,
  existingChildIds,
  onChildLinked,
}: LinkChildDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
      setIsLinking(null);
    }
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await getCustomers(searchQuery, 1, 20, jwt);
        // Exclude the parent itself and already-linked children
        const filtered = result.customers.filter(
          (c) => c.id !== parentId && !existingChildIds.includes(c.id)
        );
        setSearchResults(filtered);
      } catch {
        toast({
          status: "error",
          description: "Failed to search customers",
          variant: "destructive",
        });
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, jwt, parentId, existingChildIds, toast]);

  const handleLink = async (child: Customer) => {
    setIsLinking(child.id);
    try {
      const error = await linkChildToParent(child.id, parentId, jwt);
      if (error) {
        toast({
          status: "error",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          status: "success",
          description: `${child.first_name} ${child.last_name} linked as child`,
        });
        onChildLinked();
        onOpenChange(false);
      }
    } catch {
      toast({
        status: "error",
        description: "Failed to link customer",
        variant: "destructive",
      });
    } finally {
      setIsLinking(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Link Existing Customer as Child</DialogTitle>
          <DialogDescription>
            Search for a customer to link as a child account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {isSearching && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                No customers found
              </p>
            )}

            {!isSearching &&
              searchResults.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {customer.first_name} {customer.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLink(customer)}
                    disabled={isLinking !== null}
                  >
                    {isLinking === customer.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Link2 className="h-3 w-3 mr-1" />
                        Link
                      </>
                    )}
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
