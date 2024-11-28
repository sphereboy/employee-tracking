"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { EmployeeCard } from "./EmployeeCard";
import { CompanySelector } from "./CompanySelector";
import { GroupingControls } from "./GroupingControls";
import { Employee, Company } from "@/types";

const companies: Company[] = [
  {
    id: 1,
    name: "TechCorp",
    employees: [
      {
        id: 1,
        name: "John Doe",
        title: "CEO",
        location: "New York",
        timeZone: "America/New_York",
        department: "Executive",
        email: "john@techcorp.com",
        phone: "+1 (555) 123-4567",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          "John Doe"
        )}&background=random`,
        directReports: [2, 3],
      },
      {
        id: 2,
        name: "Jane Smith",
        title: "CTO",
        location: "San Francisco",
        timeZone: "America/Los_Angeles",
        department: "Technology",
        email: "jane@techcorp.com",
        phone: "+1 (555) 987-6543",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          "Jane Smith"
        )}&background=random`,
        directReports: [4, 5],
      },
    ],
  },
  {
    id: 2,
    name: "FinanceHub",
    employees: [],
  },
];

export function EmployeeTracker() {
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);
  const [grouping, setGrouping] = useState<"department" | "location" | "none">(
    "none"
  );
  const [activeId, setActiveId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const getGroupedEmployees = () => {
    if (grouping === "none") {
      return { "All Employees": selectedCompany.employees };
    }

    return selectedCompany.employees.reduce<Record<string, Employee[]>>(
      (acc, employee) => {
        const key = employee[grouping];
        if (!acc[key]) acc[key] = [];
        acc[key].push(employee);
        return acc;
      },
      {}
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(Number(active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Handle the employee reordering logic here
      console.log(`Moved employee ${active.id} to position ${over.id}`);
    }

    setActiveId(null);
  };

  const groupedEmployees = getGroupedEmployees();
  const activeEmployee = activeId
    ? selectedCompany.employees.find((emp) => emp.id === activeId)
    : null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-start">
        <CompanySelector
          companies={companies}
          selectedCompany={selectedCompany}
          onSelectCompany={setSelectedCompany}
        />
        <GroupingControls grouping={grouping} onGroupingChange={setGrouping} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-8">
          {Object.entries(groupedEmployees).map(([group, employees]) => (
            <div key={group} className="space-y-4">
              <h2 className="text-2xl font-bold">{group}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {employees.map((employee) => (
                  <Draggable key={employee.id} id={employee.id}>
                    <EmployeeCard employee={employee} />
                  </Draggable>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeEmployee ? (
            <div className="opacity-80">
              <EmployeeCard employee={activeEmployee} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// Draggable component
function Draggable({
  children,
  id,
}: {
  children: React.ReactNode;
  id: number;
}) {
  return (
    <div data-id={id} style={{ touchAction: "none" }}>
      {children}
    </div>
  );
}
