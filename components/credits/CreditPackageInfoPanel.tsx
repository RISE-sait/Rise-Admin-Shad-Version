"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreditPackage, CreditPackageRequest } from "@/types/credit-package";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { StaffRoleEnum } from "@/types/user";
import {
  STRIPE_PRICE_MESSAGE,
  STRIPE_PRICE_PATTERN,
  TEXT_PATTERN,
  TEXT_PATTERN_MESSAGE,
  MULTILINE_TEXT_PATTERN,
  MULTILINE_TEXT_MESSAGE,
  NUMBER_PATTERN,
  NUMBER_PATTERN_MESSAGE,
  sanitizeMultilineInput,
  sanitizeSingleLineInput,
  sanitizeStripePriceId,
} from "@/lib/creditPackageValidation";
import {
  deleteCreditPackage,
  updateCreditPackage,
} from "@/services/creditPackages";
import { revalidateCreditPackages } from "@/actions/serverActions";
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
import { SaveIcon, TrashIcon, Coins } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreditPackageInfoPanelProps {
  creditPackage: CreditPackage;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
}

type CreditPackageFormValues = {
  name: string;
  description?: string;
  credit_allocation: number;
  weekly_credit_limit: number;
  stripe_price_id: string;
};

export default function CreditPackageInfoPanel({
  creditPackage,
  onClose,
  onSuccess,
}: CreditPackageInfoPanelProps) {
  const { user } = useUser();
  const isReceptionist = user?.Role === StaffRoleEnum.RECEPTIONIST;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CreditPackageFormValues>({
    defaultValues: {
      name: creditPackage.name,
      description: creditPackage.description ?? "",
      credit_allocation: creditPackage.credit_allocation,
      weekly_credit_limit: creditPackage.weekly_credit_limit,
      stripe_price_id: creditPackage.stripe_price_id,
    },
  });

  useEffect(() => {
    reset({
      name: creditPackage.name,
      description: creditPackage.description ?? "",
      credit_allocation: creditPackage.credit_allocation,
      weekly_credit_limit: creditPackage.weekly_credit_limit,
      stripe_price_id: creditPackage.stripe_price_id,
    });
  }, [creditPackage, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!user?.Jwt) {
      toast.error("You must be logged in to update credit packages.");
      return;
    }

    const payload: CreditPackageRequest = {
      name: sanitizeSingleLineInput(values.name),
      description: values.description
        ? sanitizeMultilineInput(values.description)
        : undefined,
      credit_allocation: values.credit_allocation,
      weekly_credit_limit: values.weekly_credit_limit,
      stripe_price_id: sanitizeStripePriceId(values.stripe_price_id),
    };

    try {
      await updateCreditPackage(creditPackage.id, payload, user.Jwt);
      reset({
        name: payload.name,
        description: payload.description ?? "",
        credit_allocation: payload.credit_allocation,
        weekly_credit_limit: payload.weekly_credit_limit,
        stripe_price_id: payload.stripe_price_id,
      });
      toast.success("Credit package updated successfully");
      await revalidateCreditPackages();
      await onSuccess();
    } catch {
      toast.error("Failed to update credit package. Please try again.");
    }
  });

  const handleDelete = async () => {
    if (!user?.Jwt) {
      toast.error("You must be logged in to delete credit packages.");
      return;
    }

    try {
      await deleteCreditPackage(creditPackage.id, user.Jwt);
      toast.success("Credit package deleted");
      await revalidateCreditPackages();
      await onSuccess();
      onClose();
    } catch {
      toast.error("Failed to delete credit package. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Package Information Section */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Package Information</h3>
            </div>
            <div className="space-y-4">
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("name", {
                          required: "Name is required.",
                          pattern: {
                            value: TEXT_PATTERN,
                            message: TEXT_PATTERN_MESSAGE,
                          },
                          setValueAs: sanitizeSingleLineInput,
                        })}
                        placeholder="Package name"
                        className="bg-background text-muted-foreground cursor-not-allowed"
                        disabled
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500">{errors.name.message}</p>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background border text-foreground">
                    <p>Changes must be made on dashboard.stripe.com</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <Textarea
                        rows={4}
                        {...register("description", {
                          pattern: {
                            value: MULTILINE_TEXT_PATTERN,
                            message: MULTILINE_TEXT_MESSAGE,
                          },
                          setValueAs: (value: string) =>
                            value ? sanitizeMultilineInput(value) : value,
                        })}
                        placeholder="Describe this credit package"
                        className="bg-background text-muted-foreground cursor-not-allowed"
                        disabled
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500">
                          {errors.description.message as string}
                        </p>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background border text-foreground">
                    <p>Changes must be made on dashboard.stripe.com</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        {/* Credit Configuration Section */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-lg">Credit Configuration</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Credit Allocation <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          {...register("credit_allocation", {
                            required: "Credit allocation is required.",
                            valueAsNumber: true,
                            validate: (value) =>
                              NUMBER_PATTERN.test(String(value)) || NUMBER_PATTERN_MESSAGE,
                          })}
                          placeholder="0"
                          className="bg-background text-muted-foreground cursor-not-allowed"
                          disabled
                        />
                        {errors.credit_allocation && (
                          <p className="text-xs text-red-500">
                            {errors.credit_allocation.message as string}
                          </p>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background border text-foreground">
                      <p>Changes must be made on dashboard.stripe.com</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Weekly Credit Limit <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          {...register("weekly_credit_limit", {
                            required: "Weekly credit limit is required.",
                            valueAsNumber: true,
                            validate: (value) =>
                              NUMBER_PATTERN.test(String(value)) || NUMBER_PATTERN_MESSAGE,
                          })}
                          placeholder="0"
                          className="bg-background text-muted-foreground cursor-not-allowed"
                          disabled
                        />
                        {errors.weekly_credit_limit && (
                          <p className="text-xs text-red-500">
                            {errors.weekly_credit_limit.message as string}
                          </p>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background border text-foreground">
                      <p>Changes must be made on dashboard.stripe.com</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Price
                        </label>
                        <Input
                          type="text"
                          value={
                            creditPackage.price != null
                              ? creditPackage.price
                              : "N/A"
                          }
                          className="bg-background text-muted-foreground cursor-not-allowed"
                          disabled
                          readOnly
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background border text-foreground">
                      <p>Changes must be made on dashboard.stripe.com</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Currency
                        </label>
                        <Input
                          type="text"
                          value={creditPackage.currency?.toUpperCase() || "N/A"}
                          className="bg-background text-muted-foreground cursor-not-allowed"
                          disabled
                          readOnly
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background border text-foreground">
                      <p>Changes must be made on dashboard.stripe.com</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Stripe Price ID <span className="text-red-500">*</span>
                      </label>
                      <Input
                        {...register("stripe_price_id", {
                          required: "Stripe price ID is required.",
                          pattern: {
                            value: STRIPE_PRICE_PATTERN,
                            message: STRIPE_PRICE_MESSAGE,
                          },
                          setValueAs: sanitizeStripePriceId,
                        })}
                        placeholder="price_123ABC"
                        className="bg-background text-muted-foreground cursor-not-allowed"
                        disabled
                      />
                      {errors.stripe_price_id && (
                        <p className="text-xs text-red-500">
                          {errors.stripe_price_id.message as string}
                        </p>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background border text-foreground">
                    <p>Changes must be made on dashboard.stripe.com</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {!isReceptionist && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete Package
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete credit package</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this credit package? This
                    action cannot be undone.
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
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-11 px-6"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>

      <div className="text-xs text-muted-foreground pt-4">
        {(() => {
          const createdAt = new Date(creditPackage.created_at);
          const updatedAt = new Date(creditPackage.updated_at);

          return (
            <>
              <p>
                Created at:{" "}
                {isNaN(createdAt.getTime())
                  ? "Unknown"
                  : createdAt.toLocaleString()}
              </p>
              <p>
                Updated at:{" "}
                {isNaN(updatedAt.getTime())
                  ? "Unknown"
                  : updatedAt.toLocaleString()}
              </p>
            </>
          );
        })()}
      </div>
    </div>
  );
}
