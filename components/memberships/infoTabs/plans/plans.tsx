"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MembershipPlan } from '@/types/membership';
import { PlusCircle, CreditCard, AlertCircle } from 'lucide-react';
import PlanListItem from './plan-list-item';
import { useToast } from '@/hooks/use-toast';
import getValue from '@/configs/constants';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from "framer-motion";

type PlansTabProps = {
  membershipId: string;
  plans: MembershipPlan[];
  onPlansChange: (plans: MembershipPlan[]) => void;
};

export default function PlansTab({ membershipId, plans, onPlansChange }: PlansTabProps) {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newPlan, setNewPlan] = useState<Partial<MembershipPlan>>({
    name: '',
    stripe_price_id: '',
    stripe_joining_fees_id: '',
    amt_periods: 0
  });

  const { toast } = useToast();
  const apiUrl = getValue("API");

  const handleAddPlan = async () => {
    setIsAddingPlan(true);
  };

  const handleSaveNewPlan = async () => {
    setIsLoading(true);
    try {
      const planToAdd: MembershipPlan = {
        id: uuidv4(), 
        membership_id: membershipId,
        name: newPlan.name || '',
        stripe_price_id: newPlan.stripe_price_id || '',
        stripe_joining_fees_id: newPlan.stripe_joining_fees_id || '',
        amt_periods: newPlan.amt_periods || 0
      };

      const response = await fetch(`${apiUrl}/memberships/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membership_id: membershipId,
          name: planToAdd.name,
          stripe_price_id: planToAdd.stripe_price_id,
          stripe_joining_fees_id: planToAdd.stripe_joining_fees_id,
          amt_periods: planToAdd.amt_periods
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }

      // Add the new plan to the list
      onPlansChange([...plans, planToAdd]);
      
      // Reset form
      setNewPlan({
        name: '',
        stripe_price_id: '',
        stripe_joining_fees_id: '',
        amt_periods: 0
      });
      setIsAddingPlan(false);
      
      toast({
        status: "success",
        description: "Plan created successfully",
      });
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        status: "error",
        description: "Failed to create plan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = async (updatedPlan: MembershipPlan) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/memberships/plans/${updatedPlan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updatedPlan.name,
          stripe_price_id: updatedPlan.stripe_price_id,
          stripe_joining_fees_id: updatedPlan.stripe_joining_fees_id,
          amt_periods: updatedPlan.amt_periods
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      // Update the plan in the list
      const updatedPlans = plans.map(plan => 
        plan.id === updatedPlan.id ? updatedPlan : plan
      );
      
      onPlansChange(updatedPlans);
      
      toast({
        status: "success",
        description: "Plan updated successfully",
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        status: "error",
        description: "Failed to update plan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/memberships/plans/${planId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      // Remove the plan from the list
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      onPlansChange(updatedPlans);
      
      toast({
        status: "success",
        description: "Plan deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        status: "error",
        description: "Failed to delete plan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="space-y-4">
        <AnimatePresence>
          {plans.length > 0 ? (
            <div className="space-y-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={isLoading ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeInOut"
                  }}
                >
                  <PlanListItem
                    plan={plan}
                    onChange={handleUpdatePlan}
                    onDelete={() => handleDeletePlan(plan.id)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-muted/50 rounded-lg p-8 text-center"
            >
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/70 mb-3" />
              <p className="text-muted-foreground font-medium">
                No plans added yet. Create a new plan to get started.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {isAddingPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <PlanListItem
              plan={{
                id: 'new',
                membership_id: membershipId,
                name: newPlan.name || '',
                stripe_price_id: newPlan.stripe_price_id || '',
                stripe_joining_fees_id: newPlan.stripe_joining_fees_id || '',
                amt_periods: newPlan.amt_periods || 0
              }}
              onChange={(plan) => setNewPlan(plan)}
              onSave={handleSaveNewPlan}
              onCancel={() => setIsAddingPlan(false)}
              isNew
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              className="w-full border-dashed mt-4 transition-colors hover:border-primary/50 hover:text-primary"
              onClick={handleAddPlan}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Plan
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}