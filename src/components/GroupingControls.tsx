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
    <div className="space-y-4">
      <RadioGroup
        value={grouping}
        onValueChange={onGroupingChange as (value: string) => void}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="none" id="none" />
          <Label htmlFor="none">No Grouping</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="department" id="department" />
          <Label htmlFor="department">Group by Department</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="location" id="location" />
          <Label htmlFor="location">Group by Location</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
