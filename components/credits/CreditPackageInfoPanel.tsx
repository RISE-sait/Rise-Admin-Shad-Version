"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreditPackage, CreditPackageRequest } from "@/types/credit-package";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
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
import { SaveIcon, TrashIcon } from "lucide-react";

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
    } catch (error) {
      console.error("Failed to update credit package", error);
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
    } catch (error) {
      console.error("Failed to delete credit package", error);
      toast.error("Failed to delete credit package. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
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
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
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
          />
          {errors.description && (
            <p className="text-xs text-red-500">
              {errors.description.message as string}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Credit Allocation</label>
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
            />
            {errors.credit_allocation && (
              <p className="text-xs text-red-500">
                {errors.credit_allocation.message as string}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weekly Credit Limit</label>
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
            />
            {errors.weekly_credit_limit && (
              <p className="text-xs text-red-500">
                {errors.weekly_credit_limit.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stripe Price ID</label>
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
          />
          {errors.stripe_price_id && (
            <p className="text-xs text-red-500">
              {errors.stripe_price_id.message as string}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={isSubmitting || !isDirty}
          >
            Reset
          </Button>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
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
                  <AlertDialogTitle>Delete credit package</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this credit package? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Confirm delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </form>

      <div className="text-xs text-muted-foreground">
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
