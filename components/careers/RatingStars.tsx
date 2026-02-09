"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  editable = false,
  onChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (index: number) => {
    if (editable && onChange) {
      // If clicking the same star, toggle it off (set to 0)
      // Otherwise set to the clicked star index
      const newRating = index + 1 === rating ? 0 : index + 1;
      onChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < rating;
        return (
          <button
            key={index}
            type="button"
            disabled={!editable}
            onClick={() => handleClick(index)}
            className={cn(
              "transition-colors",
              editable && "cursor-pointer hover:scale-110",
              !editable && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-gray-300 dark:text-gray-600",
                editable && "hover:text-yellow-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
