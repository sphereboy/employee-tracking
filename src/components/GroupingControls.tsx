"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface GroupingControlsProps {
  grouping: "department" | "location" | "none";
  onGroupingChange: (grouping: "department" | "location" | "none") => void;
}

export function GroupingControls({
  grouping,
  onGroupingChange,
}: GroupingControlsProps) {
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <RadioGroup
        value={grouping}
        onValueChange={onGroupingChange as (value: string) => void}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center space-x-2 hover:bg-accent/50 p-2 rounded-md transition-colors">
          <RadioGroupItem value="none" id="none" />
          <Label htmlFor="none" className="cursor-pointer font-medium text-sm">
            No Grouping
          </Label>
        </div>
        <div className="flex items-center space-x-2 hover:bg-accent/50 p-2 rounded-md transition-colors">
          <RadioGroupItem value="department" id="department" />
          <Label
            htmlFor="department"
            className="cursor-pointer font-medium text-sm"
          >
            Group by Department
          </Label>
        </div>
        <div className="flex items-center space-x-2 hover:bg-accent/50 p-2 rounded-md transition-colors">
          <RadioGroupItem value="location" id="location" />
          <Label
            htmlFor="location"
            className="cursor-pointer font-medium text-sm"
          >
            Group by Location
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
