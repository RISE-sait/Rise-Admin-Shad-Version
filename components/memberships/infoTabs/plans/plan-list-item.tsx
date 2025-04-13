"use client";
import React, { useState } from 'react';
import { MembershipPlan } from '@/types/membership';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { EditIcon, TrashIcon, CreditCardIcon, SaveIcon, XIcon, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from '@/components/ui/label';

type PlanListItemProps = {
  plan: MembershipPlan;
  onChange: (plan: MembershipPlan) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  isNew?: boolean;
};

export default function PlanListItem({ 
  plan, 
  onChange, 
  onSave, 
  onCancel, 
  onDelete,
  isNew = false
}: PlanListItemProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [editedPlan, setEditedPlan] = useState<MembershipPlan>(plan);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: any) => {
    if (field === 'amt_periods') {
      setEditedPlan({
        ...editedPlan,
        amt_periods: value
      });
    } else {
      setEditedPlan({ ...editedPlan, [field]: value });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onChange(editedPlan);
      if (!isNew) setIsEditing(false);
      if (onSave) await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedPlan(plan); // Reset to original
    if (!isNew) setIsEditing(false);
    if (onCancel) onCancel();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getPeriodLabel = (periods?: number) => {
    if (!periods || periods <= 0) return 'One-time payment';
    if (periods === 1) return 'Monthly';
    return `Every ${periods} months`;
  };

  // Validation
  const isValid = editedPlan.name.trim() !== '' && 
                 editedPlan.stripe_price_id?.trim() !== '';

  return (
    <Card 
      className={`border transition-all duration-200 ${
        isEditing 
          ? 'border-primary/50 shadow-md ring-1 ring-primary/20' 
          : 'hover:border-muted-foreground/30 hover:shadow-sm'
      }`}
    >
      <CardContent className={`p-4 ${isEditing ? 'pb-5' : 'py-3'}`}>
        {isEditing ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor={`plan-name-${plan.id}`} className="text-sm font-medium flex items-center gap-1">
                  Plan Name
                  {editedPlan.name.trim() === '' && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Input 
                  id={`plan-name-${plan.id}`}
                  value={editedPlan.name} 
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Basic, Premium, etc."
                  className={`transition-colors ${
                    editedPlan.name.trim() === '' ? 'border-destructive' : ''
                  }`}
                />
                {editedPlan.name.trim() === '' && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Plan name is required
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`plan-stripe-price-${plan.id}`} className="text-sm font-medium flex items-center gap-1">
                  Stripe Price ID
                  {!editedPlan.stripe_price_id && (
                    <span className="text-destructive">*</span>
                  )}
                </Label>
                <Input 
                  id={`plan-stripe-price-${plan.id}`}
                  value={editedPlan.stripe_price_id || ''}
                  onChange={(e) => handleChange('stripe_price_id', e.target.value)}
                  placeholder="price_1234567890"
                  className={`transition-colors ${
                    !editedPlan.stripe_price_id ? 'border-destructive' : ''
                  }`}
                />
                {!editedPlan.stripe_price_id && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Stripe Price ID is required
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor={`plan-joining-fee-${plan.id}`} className="text-sm font-medium">
                  Stripe Joining Fee ID
                </Label>
                <Input 
                  id={`plan-joining-fee-${plan.id}`}
                  value={editedPlan.stripe_joining_fees_id || ''}
                  onChange={(e) => handleChange('stripe_joining_fees_id', e.target.value)}
                  placeholder="price_joining_fee_123"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional joining fee for this plan
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`plan-periods-${plan.id}`} className="text-sm font-medium">
                  Billing Period
                </Label>
                <Input 
                  id={`plan-periods-${plan.id}`}
                  type="number"
                  value={editedPlan.amt_periods || 0}
                  onChange={(e) => handleChange('amt_periods', parseInt(e.target.value))}
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {getPeriodLabel(editedPlan.amt_periods)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
                type="button"
                className="transition-colors"
              >
                <XIcon className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleSave}
                disabled={!isValid || isSaving}
                className="bg-green-600 hover:bg-green-700 transition-colors relative"
              >
                <SaveIcon className={`${isSaving ? 'opacity-0' : 'opacity-100'} mr-2 h-4 w-4 transition-opacity`} />
                {isSaving ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                  </span>
                ) : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="text-base font-medium">{plan.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{plan.stripe_price_id}</span> 
                  {plan.amt_periods > 0 && ` • ${getPeriodLabel(plan.amt_periods)}`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 hover:bg-secondary"
              >
                <EditIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={onDelete}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete this plan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}