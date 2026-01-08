"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAllDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "@/services/discount";
import {
  Discount,
  CreateDiscountRequest,
  DiscountType,
  DurationType,
  AppliesTo,
} from "@/types/discount";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Percent,
  DollarSign,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 10;

export default function DiscountManagement() {
  const { user } = useUser();
  const { toast } = useToast();

  // Discounts list state
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDiscount, setDeletingDiscount] = useState<Discount | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    discount_type: DiscountType;
    discount_percent: number;
    discount_amount: number;
    is_use_unlimited: boolean;
    use_per_client: number;
    is_active: boolean;
    valid_from: string;
    valid_to: string;
    duration_type: DurationType;
    duration_months: number;
    applies_to: AppliesTo;
    max_redemptions: number;
  }>({
    name: "",
    description: "",
    discount_type: "percentage",
    discount_percent: 10,
    discount_amount: 0,
    is_use_unlimited: false,
    use_per_client: 1,
    is_active: true,
    valid_from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    valid_to: "",
    duration_type: "once",
    duration_months: 1,
    applies_to: "both",
    max_redemptions: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      discount_type: "percentage",
      discount_percent: 10,
      discount_amount: 0,
      is_use_unlimited: false,
      use_per_client: 1,
      is_active: true,
      valid_from: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      valid_to: "",
      duration_type: "once",
      duration_months: 1,
      applies_to: "both",
      max_redemptions: 0,
    });
    setEditingDiscount(null);
  };

  const loadDiscounts = useCallback(async () => {
    if (!user?.Jwt) return;
    setLoading(true);
    try {
      const data = await getAllDiscounts(user.Jwt);
      setDiscounts(data);
    } catch (error) {
      console.error("Error loading discounts:", error);
      toast({
        title: "Error",
        description: "Failed to load discounts",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.Jwt, toast]);

  useEffect(() => {
    loadDiscounts();
  }, [loadDiscounts]);

  const handleOpenCreate = () => {
    resetForm();
    setSheetOpen(true);
  };

  const handleOpenEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      description: discount.description || "",
      discount_type: discount.discount_type,
      discount_percent: discount.discount_percent || 0,
      discount_amount: discount.discount_amount || 0,
      is_use_unlimited: discount.is_use_unlimited,
      use_per_client: discount.use_per_client || 1,
      is_active: discount.is_active,
      valid_from: discount.valid_from
        ? format(new Date(discount.valid_from), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      valid_to: discount.valid_to
        ? format(new Date(discount.valid_to), "yyyy-MM-dd'T'HH:mm")
        : "",
      duration_type: discount.duration_type,
      duration_months: discount.duration_months || 1,
      applies_to: discount.applies_to,
      max_redemptions: discount.max_redemptions || 0,
    });
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!user?.Jwt) return;

    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Name is required", status: "error" });
      return;
    }

    setSaving(true);

    const requestData: CreateDiscountRequest = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      discount_type: formData.discount_type,
      discount_percent:
        formData.discount_type === "percentage" ? formData.discount_percent : undefined,
      discount_amount:
        formData.discount_type === "fixed_amount" ? formData.discount_amount : undefined,
      is_use_unlimited: formData.is_use_unlimited,
      use_per_client: formData.is_use_unlimited ? undefined : formData.use_per_client,
      is_active: formData.is_active,
      valid_from: new Date(formData.valid_from).toISOString(),
      valid_to: formData.valid_to
        ? new Date(formData.valid_to).toISOString()
        : undefined,
      duration_type: formData.duration_type,
      duration_months:
        formData.duration_type === "repeating" ? formData.duration_months : undefined,
      applies_to: formData.applies_to,
      max_redemptions: formData.max_redemptions > 0 ? formData.max_redemptions : undefined,
    };

    try {
      if (editingDiscount) {
        const { error } = await updateDiscount(editingDiscount.id, requestData, user.Jwt);
        if (error) {
          toast({ title: "Error", description: error, status: "error" });
        } else {
          toast({ title: "Success", description: "Discount updated", status: "success" });
          setSheetOpen(false);
          resetForm();
          loadDiscounts();
        }
      } else {
        const { error } = await createDiscount(requestData, user.Jwt);
        if (error) {
          toast({ title: "Error", description: error, status: "error" });
        } else {
          toast({ title: "Success", description: "Discount created", status: "success" });
          setSheetOpen(false);
          resetForm();
          loadDiscounts();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.Jwt || !deletingDiscount) return;

    setDeleting(true);
    try {
      const { success, error } = await deleteDiscount(deletingDiscount.id, user.Jwt);
      if (success) {
        toast({ title: "Success", description: "Discount deleted", status: "success" });
        setDeleteDialogOpen(false);
        setDeletingDiscount(null);
        loadDiscounts();
      } else {
        toast({ title: "Error", description: error || "Failed to delete", status: "error" });
      }
    } finally {
      setDeleting(false);
    }
  };

  const formatDiscountValue = (discount: Discount) => {
    if (discount.discount_type === "percentage") {
      return `${discount.discount_percent}%`;
    }
    return `$${(discount.discount_amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Pagination
  const totalPages = Math.ceil(discounts.length / ITEMS_PER_PAGE);
  const paginatedDiscounts = discounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Discount Codes
            </CardTitle>
            <CardDescription>
              Create promo codes that customers can use at checkout to get discounts on memberships and purchases.
            </CardDescription>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Discount
          </Button>
        </CardHeader>

        {/* Quick Help */}
        <div className="px-6 pb-4">
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="font-medium mb-2">Quick Guide:</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li><strong>Code</strong> - The text customers type at checkout (e.g., SUMMER20)</li>
              <li><strong>Type</strong> - Percentage (%) takes a portion off, Fixed ($) takes a set amount off</li>
              <li><strong>Duration</strong> - How long the discount applies for recurring memberships</li>
              <li><strong>Used</strong> - How many times this code has been redeemed</li>
              <li><strong>Status</strong> - Green = customers can use it, Gray = temporarily disabled</li>
            </ul>
          </div>
        </div>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : discounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No discount codes yet. Create your first one!
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Applies To</TableHead>
                    <TableHead>Valid From</TableHead>
                    <TableHead>Valid To</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDiscounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-mono font-medium">
                        {discount.name}
                      </TableCell>
                      <TableCell>
                        {discount.discount_type === "percentage" ? (
                          <Badge variant="outline" className="gap-1">
                            <Percent className="h-3 w-3" />
                            Percent
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            Fixed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatDiscountValue(discount)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {discount.duration_type}
                        {discount.duration_type === "repeating" &&
                          discount.duration_months &&
                          ` (${discount.duration_months}mo)`}
                      </TableCell>
                      <TableCell className="capitalize">
                        {discount.applies_to.replace("_", " ")}
                      </TableCell>
                      <TableCell>{formatDate(discount.valid_from)}</TableCell>
                      <TableCell>{formatDate(discount.valid_to)}</TableCell>
                      <TableCell>
                        {discount.times_redeemed}
                        {discount.max_redemptions && `/${discount.max_redemptions}`}
                      </TableCell>
                      <TableCell>
                        {discount.is_active ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(discount)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingDiscount(discount);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, discounts.length)} of{" "}
                    {discounts.length} discounts
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => { if (!open) resetForm(); setSheetOpen(open); }}>
        <SheetContent className="sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingDiscount ? "Edit Discount" : "Create Discount"}
            </SheetTitle>
            <SheetDescription>
              {editingDiscount
                ? "Update the discount code details."
                : "Create a new discount code for your customers."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>What is a discount code?</strong> A discount code is a special word or phrase that customers can enter during checkout to get money off their purchase.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Code Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. SUMMER20"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value.toUpperCase() }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This is the exact code customers will type at checkout. Keep it simple and memorable! Examples: WELCOME10, SUMMER2024, VIP50
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g. Summer promotion for new members"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Internal note for your team. Customers won't see this - it's just to help you remember what this discount is for.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Turn this OFF to temporarily disable the code without deleting it. Customers won't be able to use it until you turn it back ON.
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((f) => ({ ...f, is_active: checked }))
                  }
                />
              </div>
            </div>

            {/* Discount Value */}
            <div className="space-y-4">
              <div>
                <Label>Discount Type *</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  Choose how the discount is calculated - either a percentage off or a fixed dollar amount.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.discount_type === "percentage" ? "default" : "outline"}
                  className="justify-start h-auto py-3 flex-col items-start"
                  onClick={() => setFormData((f) => ({ ...f, discount_type: "percentage" }))}
                >
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 mr-2" />
                    Percentage
                  </div>
                  <span className="text-xs font-normal opacity-70 mt-1">e.g. 20% off</span>
                </Button>
                <Button
                  type="button"
                  variant={formData.discount_type === "fixed_amount" ? "default" : "outline"}
                  className="justify-start h-auto py-3 flex-col items-start"
                  onClick={() => setFormData((f) => ({ ...f, discount_type: "fixed_amount" }))}
                >
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Fixed Amount
                  </div>
                  <span className="text-xs font-normal opacity-70 mt-1">e.g. $10 off</span>
                </Button>
              </div>

              {formData.discount_type === "percentage" ? (
                <div className="space-y-2">
                  <Label htmlFor="discount_percent">Discount Percentage *</Label>
                  <div className="relative">
                    <Input
                      id="discount_percent"
                      type="number"
                      min={1}
                      max={100}
                      value={formData.discount_percent}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          discount_percent: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: Enter 20 for 20% off. A $100 purchase becomes $80.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="discount_amount">Discount Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="discount_amount"
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={formData.discount_amount}
                      onChange={(e) =>
                        setFormData((f) => ({
                          ...f,
                          discount_amount: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: Enter 10 for $10 off. A $100 purchase becomes $90.
                  </p>
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-4">
              <div>
                <Label>Duration Type *</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  For memberships with monthly payments, how long should the discount apply?
                </p>
              </div>
              <Select
                value={formData.duration_type}
                onValueChange={(v) =>
                  setFormData((f) => ({ ...f, duration_type: v as DurationType }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once - First payment only</SelectItem>
                  <SelectItem value="repeating">Repeating - For a set number of months</SelectItem>
                  <SelectItem value="forever">Forever - Every payment gets the discount</SelectItem>
                </SelectContent>
              </Select>

              <div className="rounded-lg border bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
                {formData.duration_type === "once" && (
                  <p><strong>Once:</strong> The customer only gets the discount on their first payment. After that, they pay full price. Great for attracting new customers!</p>
                )}
                {formData.duration_type === "repeating" && (
                  <p><strong>Repeating:</strong> The discount applies for a specific number of months. For example, "3 months of 20% off" then full price after.</p>
                )}
                {formData.duration_type === "forever" && (
                  <p><strong>Forever:</strong> The customer gets the discount on EVERY payment for as long as they stay subscribed. Use carefully!</p>
                )}
              </div>

              {formData.duration_type === "repeating" && (
                <div className="space-y-2">
                  <Label htmlFor="duration_months">How many months? *</Label>
                  <Input
                    id="duration_months"
                    type="number"
                    min={1}
                    value={formData.duration_months}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        duration_months: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    The discount will apply for this many monthly payments, then stop.
                  </p>
                </div>
              )}
            </div>

            {/* Applies To */}
            <div className="space-y-4">
              <div>
                <Label>Applies To *</Label>
                <p className="text-xs text-muted-foreground mt-1 mb-2">
                  What type of purchases can this discount be used for?
                </p>
              </div>
              <Select
                value={formData.applies_to}
                onValueChange={(v) =>
                  setFormData((f) => ({ ...f, applies_to: v as AppliesTo }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both - All purchases</SelectItem>
                  <SelectItem value="subscription">Subscriptions only</SelectItem>
                  <SelectItem value="one_time">One-time payments only</SelectItem>
                </SelectContent>
              </Select>

              <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-3 text-xs space-y-2">
                <p className="font-medium text-amber-800 dark:text-amber-300">What's the difference?</p>
                <ul className="text-amber-700 dark:text-amber-400 space-y-1 ml-3 list-disc">
                  <li><strong>Subscriptions</strong> = Recurring memberships (monthly/yearly plans that auto-renew)</li>
                  <li><strong>One-time payments</strong> = Single purchases like event tickets, drop-in sessions, or one-off products</li>
                  <li><strong>Both</strong> = The discount works on everything</li>
                </ul>
              </div>
            </div>

            {/* Validity Period */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-green-50 dark:bg-green-950/30 p-3 text-xs">
                <p className="font-medium text-green-800 dark:text-green-300 mb-1">When can this code be used?</p>
                <p className="text-green-700 dark:text-green-400">
                  Set the time window when this discount code is active. Outside these dates, customers won't be able to use it.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valid_from">Start Date & Time *</Label>
                <Input
                  id="valid_from"
                  type="datetime-local"
                  value={formData.valid_from}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, valid_from: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  The code starts working from this date and time.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valid_to">End Date & Time (optional)</Label>
                <Input
                  id="valid_to"
                  type="datetime-local"
                  value={formData.valid_to}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, valid_to: e.target.value }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  The code stops working after this date. Leave empty if you want the code to never expire (you can always turn it off manually).
                </p>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="space-y-4">
              <div className="rounded-lg border bg-purple-50 dark:bg-purple-950/30 p-3 text-xs">
                <p className="font-medium text-purple-800 dark:text-purple-300 mb-1">Usage Limits</p>
                <p className="text-purple-700 dark:text-purple-400">
                  Control how many times this code can be used to prevent overuse.
                </p>
              </div>

              <div className="flex items-start space-x-2 p-3 rounded-lg border">
                <Checkbox
                  id="unlimited"
                  checked={formData.is_use_unlimited}
                  onCheckedChange={(checked) =>
                    setFormData((f) => ({ ...f, is_use_unlimited: checked === true }))
                  }
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="unlimited" className="font-normal">
                    Unlimited uses per customer
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    If checked, the same customer can use this code as many times as they want.
                  </p>
                </div>
              </div>

              {!formData.is_use_unlimited && (
                <div className="space-y-2">
                  <Label htmlFor="use_per_client">Uses per customer</Label>
                  <Input
                    id="use_per_client"
                    type="number"
                    min={1}
                    value={formData.use_per_client}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        use_per_client: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    How many times can each individual customer use this code? Usually set to 1 to prevent abuse.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="max_redemptions">Total usage limit (optional)</Label>
                <Input
                  id="max_redemptions"
                  type="number"
                  min={0}
                  placeholder="Leave empty for unlimited"
                  value={formData.max_redemptions || ""}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      max_redemptions: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of times this code can be used by ALL customers combined. For example, enter 100 to make it a "first 100 customers" deal. Leave empty or 0 for unlimited.
                </p>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingDiscount ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discount Code</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the discount code{" "}
              <strong>{deletingDiscount?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
