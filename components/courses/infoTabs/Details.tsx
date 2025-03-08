import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormData } from "@/hooks/form-data";
import { useToast } from "@/hooks/use-toast";
import { Course } from "@/types/course";

export default function DetailsTab({ course }: { course: Course }) {
  const { toast } = useToast();
  const { data, updateField } = useFormData({
    name: course.name,
    description: course.description,
  });

  const updateCourse = async () => {
    // Ensure the name is not empty
    if (!data.name.trim()) {
      toast({
        status: "error",
        description: "Course name cannot be empty.",
      });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/courses/${course.id}`,
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
        throw new Error("Failed to update course");
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
        <p className="pb-2">Course Name</p>
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
        <Button onClick={updateCourse}>Save Course</Button>
      </section>
    </div>
  );
}
