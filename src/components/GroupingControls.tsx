"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Users, MapPin, LayoutGrid } from "lucide-react";

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
      <p className="text-sm font-medium mb-3">Group by</p>
      <ToggleGroup
        type="single"
        value={grouping}
        onValueChange={(value) => {
          if (value)
            onGroupingChange(value as "department" | "location" | "none");
        }}
      >
        <ToggleGroupItem value="none" aria-label="No grouping">
          <LayoutGrid className="h-4 w-4" />
          <span className="sr-only">No grouping</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="department" aria-label="Group by department">
          <Users className="h-4 w-4" />
          <span className="sr-only">Group by department</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="location" aria-label="Group by location">
          <MapPin className="h-4 w-4" />
          <span className="sr-only">Group by location</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="mt-2 text-xs text-muted-foreground">
        {grouping === "none" && "All employees"}
        {grouping === "department" && "Grouped by department"}
        {grouping === "location" && "Grouped by location"}
      </div>
    </div>
  );
}
