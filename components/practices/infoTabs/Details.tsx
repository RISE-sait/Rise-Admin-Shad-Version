"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DetailsTab({
  details,
  onDetailsChange
}: {
  details: { name: string; description: string };
  onDetailsChange: (details: { name: string; description: string }) => void;
}) {

  return (
    // <div className="space-y-8">
    //   <div className="space-y-2">

    //     <div className="space-y-6">
    //       <div className="space-y-3">
    //         <label className="text-base font-medium flex items-center gap-2">
    //           <PencilIcon className="h-5 w-5 text-muted-foreground" />
    //           Practice Name
    //         </label>
    //         <Input
    //           value={details.name}
    //           onChange={(e) => onDetailsChange({ ...details, name: e.target.value })}
    //           placeholder="Enter practice name"
    //           className="text-lg h-12 px-4"
    //         />
    //       </div>

    //       <div className="space-y-3">
    //         <label className="text-base font-medium flex items-center gap-2">
    //           <PencilIcon className="h-5 w-5 text-muted-foreground" />
    //           Description
    //         </label>
    //         <Textarea
    //           value={details.description}
    //           onChange={(e) => onDetailsChange({ ...details, description: e.target.value })}
    //           placeholder="Describe the practice content and objectives"
    //           className="min-h-[150px] text-base p-4"
    //         />
    //       </div>

    //       <div className="space-y-2">
    //         <Label htmlFor={`practice-level-${details.name}`} className="text-sm font-medium">
    //           Payment Frequency
    //         </Label>
    //         <Select
    //           value={editedPlan.payment_frequency?.payment_frequency || 'monthly'}
    //           onValueChange={(value) => handleChange('payment_frequency', value)}
    //         >
    //           <SelectTrigger id={`plan-frequency-${plan.id}`}>
    //             <SelectValue placeholder="Select frequency" />
    //           </SelectTrigger>
    //           <SelectContent>
    //             <SelectItem value="daily">Daily</SelectItem>
    //             <SelectItem value="weekly">Weekly</SelectItem>
    //             <SelectItem value="monthly">Monthly</SelectItem>
    //             <SelectItem value="yearly">Yearly</SelectItem>
    //           </SelectContent>
    //         </Select>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>Not implemented yet</div>
  );
}