"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { CreditPackageRequest } from "@/types/credit-package";
import { createCreditPackage } from "@/services/creditPackages";
import { revalidateCreditPackages } from "@/actions/serverActions";
import {
  MULTILINE_TEXT_MESSAGE,
  MULTILINE_TEXT_PATTERN,
  NUMBER_PATTERN,
  NUMBER_PATTERN_MESSAGE,
  TEXT_PATTERN,
  TEXT_PATTERN_MESSAGE,
  sanitizeMultilineInput,
  sanitizeSingleLineInput,
} from "@/lib/creditPackageValidation";
import { Coins } from "lucide-react";

interface AddCreditPackageFormProps {
  onSuccess?: () => Promise<void> | void;
}

type AddCreditPackageFormValues = {
  name: string;
  description?: string;
  credit_allocation: number;
  weekly_credit_limit: number;
  unit_amount: string;
  currency: string;
};

export default function AddCreditPackageForm({
  onSuccess,
}: AddCreditPackageFormProps) {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCreditPackageFormValues>({
    defaultValues: {
      name: "",
      description: "",
      credit_allocation: 0,
      weekly_credit_limit: 0,
      unit_amount: "",
      currency: "cad",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!user?.Jwt) {
      toast.error("You must be logged in to create credit packages.");
      return;
    }

    // Convert dollars to cents for the API
    const unitAmountInCents = Math.round(parseFloat(values.unit_amount) * 100);

    const payload: CreditPackageRequest = {
      name: sanitizeSingleLineInput(values.name),
      description: values.description
        ? sanitizeMultilineInput(values.description)
        : undefined,
      credit_allocation: values.credit_allocation,
      weekly_credit_limit: values.weekly_credit_limit,
      unit_amount: unitAmountInCents,
      currency: values.currency,
    };

    try {
      await createCreditPackage(payload, user.Jwt);
      toast.success("Credit package created successfully");
      reset({
        name: "",
        description: "",
        credit_allocation: 0,
        weekly_credit_limit: 0,
        unit_amount: "",
        currency: "cad",
      });
      await revalidateCreditPackages();
      await onSuccess?.();
    } catch (error) {
      console.error("Failed to create credit package", error);
      toast.error("Failed to create credit package. Please try again.");
    }
  });

  return (
    <form className="space-y-6 pt-3" onSubmit={onSubmit}>
      {/* Package Information Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-lg">Package Information</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
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
                className="bg-background"
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
                className="bg-background"
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message as string}
                </p>
              )}
            </div>
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
              <div className="space-y-2">
                <label className="text-sm font-medium">
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
                  className="bg-background"
                />
                {errors.credit_allocation && (
                  <p className="text-xs text-red-500">
                    {errors.credit_allocation.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
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
                  className="bg-background"
                />
                {errors.weekly_credit_limit && (
                  <p className="text-xs text-red-500">
                    {errors.weekly_credit_limit.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("unit_amount", {
                    required: "Price is required.",
                    validate: (value) => {
                      const num = parseFloat(value);
                      if (isNaN(num) || num <= 0) {
                        return "Price must be greater than 0.";
                      }
                      return true;
                    },
                  })}
                  placeholder="50.00"
                  className="bg-background"
                />
                {errors.unit_amount && (
                  <p className="text-xs text-red-500">
                    {errors.unit_amount.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("currency", {
                    required: "Currency is required.",
                  })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="cad">CAD</option>
                  <option value="usd">USD</option>
                </select>
                {errors.currency && (
                  <p className="text-xs text-red-500">
                    {errors.currency.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-14 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Coins className="h-5 w-5 mr-2" />
          {isSubmitting ? "Creating..." : "Create Credit Package"}
        </Button>
      </div>
    </form>
  );
}
