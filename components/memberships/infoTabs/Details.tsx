import getValue from "@/components/Singleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormData } from "@/hooks/form-data";
import { useToast } from "@/hooks/use-toast";
import { Membership } from "@/types/membership";

export default function DetailsTab({ membership }: { membership: Membership }) {
  const { toast } = useToast();
  const { data, updateField } = useFormData({
    name: membership.name,
    description: membership.description,
  });

  const updatemembership = async () => {
    // Ensure the name is not empty
    if (!data.name.trim()) {
      toast({
        status: "error",
        description: "membership name cannot be empty.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${getValue("API")}/memberships/${membership.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update membership");
      }

      toast({
        status: "success",
        description: "Successfully saved.",
      });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        description: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4 pt-3">

      <div className="pb-4">
        <p className="pb-2">ID</p>
        <Input
          disabled
          value={membership.id}
        />
      </div>

      <div className="pb-4">
        <p className="pb-2">Name</p>
        <Input
          onChange={(e) => updateField("name", e.target.value)}
          type="text"
          value={data.name}
        />
      </div>

      <div className="pb-4">
        <p className="pb-2">Description</p>
        <Textarea
          rows={Math.max(4, (data.description ?? "").split("\n").length)}
          onChange={(e) => updateField("description", e.target.value)}
          value={data.description}
        />
      </div>

      <section className="flex justify-between">
        <Button onClick={updatemembership}>Save membership</Button>
      </section>
    </div>
  );
}
