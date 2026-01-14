"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllMembershipPlans,
  MembershipPlanWithMembershipName,
} from "@/services/membershipPlan";
import { CustomerFiltersParams } from "@/services/customer";

interface CustomerFiltersProps {
  filters: CustomerFiltersParams;
  onFiltersChange: (filters: Partial<CustomerFiltersParams>) => void;
  onClearFilters: () => void;
}

export default function CustomerFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: CustomerFiltersProps) {
  const [membershipPlans, setMembershipPlans] = useState<
    MembershipPlanWithMembershipName[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load membership plans on mount
  useEffect(() => {
    const loadPlans = async () => {
      setIsLoading(true);
      try {
        const plans = await getAllMembershipPlans();
        // Filter to only show visible plans
        setMembershipPlans(plans.filter((p) => p.visibility !== false));
      } catch (error) {
        console.error("Failed to load membership plans:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlans();
  }, []);

  // Count active filters for badge display
  const activeFilterCount = [
    filters.membership_plan_id,
    filters.has_membership,
    filters.has_credits,
    filters.min_credits,
    filters.max_credits,
  ].filter(Boolean).length;

  // Get the plan name for display in badge
  const getSelectedPlanName = () => {
    if (!filters.membership_plan_id) return null;
    const plan = membershipPlans.find((p) => p.id === filters.membership_plan_id);
    if (plan) {
      return `${plan.membershipName} - ${plan.name}`;
    }
    return filters.membership_plan_id;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Customers</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onClearFilters();
                  }}
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Membership Plan Filter */}
            <div className="space-y-2">
              <Label>Membership Plan</Label>
              <Select
                value={filters.membership_plan_id || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    membership_plan_id: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    membershipPlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.membershipName} - {plan.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Has Membership Toggle */}
            <div className="space-y-2">
              <Label>Membership Status</Label>
              <Select
                value={filters.has_membership || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    has_membership: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="true">Has Membership</SelectItem>
                  <SelectItem value="false">No Membership</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Has Credits Toggle */}
            <div className="space-y-2">
              <Label>Credits Status</Label>
              <Select
                value={filters.has_credits || "all"}
                onValueChange={(value) =>
                  onFiltersChange({
                    has_credits: value === "all" ? "" : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="true">Has Credits</SelectItem>
                  <SelectItem value="false">No Credits</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Credit Range */}
            <div className="space-y-2">
              <Label>Credit Range</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.min_credits || ""}
                  onChange={(e) =>
                    onFiltersChange({ min_credits: e.target.value })
                  }
                  className="w-24"
                  min={0}
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.max_credits || ""}
                  onChange={(e) =>
                    onFiltersChange({ max_credits: e.target.value })
                  }
                  className="w-24"
                  min={0}
                />
              </div>
            </div>

            <Button className="w-full" onClick={() => setIsOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <>
          {filters.membership_plan_id && (
            <FilterBadge
              label={`Plan: ${getSelectedPlanName()}`}
              onRemove={() => onFiltersChange({ membership_plan_id: "" })}
            />
          )}
          {filters.has_membership === "true" && (
            <FilterBadge
              label="Has Membership"
              onRemove={() => onFiltersChange({ has_membership: "" })}
            />
          )}
          {filters.has_membership === "false" && (
            <FilterBadge
              label="No Membership"
              onRemove={() => onFiltersChange({ has_membership: "" })}
            />
          )}
          {filters.has_credits === "true" && (
            <FilterBadge
              label="Has Credits"
              onRemove={() => onFiltersChange({ has_credits: "" })}
            />
          )}
          {filters.has_credits === "false" && (
            <FilterBadge
              label="No Credits"
              onRemove={() => onFiltersChange({ has_credits: "" })}
            />
          )}
          {(filters.min_credits || filters.max_credits) && (
            <FilterBadge
              label={`Credits: ${filters.min_credits || "0"} - ${filters.max_credits || "∞"}`}
              onRemove={() =>
                onFiltersChange({ min_credits: "", max_credits: "" })
              }
            />
          )}
        </>
      )}
    </div>
  );
}

function FilterBadge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      <span className="max-w-[150px] truncate">{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 rounded-full hover:bg-muted p-0.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}
