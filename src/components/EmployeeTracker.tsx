"use client";

import { useState, useEffect } from "react";
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
import { AddEmployeeDialog } from "./AddEmployeeDialog";
import { Employee, Company } from "@/types";

const initialCompanies: Company[] = [
  {
    id: 1,
    name: "TechCorp",
    employees: [],
  },
  {
    id: 2,
    name: "FinanceHub",
    employees: [],
  },
];

export function EmployeeTracker() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);
  const [grouping, setGrouping] = useState<"department" | "location" | "none">(
    "none"
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Fetch employees when component mounts and when selected company changes
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const employees = await response.json();

        // Group employees by company
        const updatedCompanies = companies.map((company) => ({
          ...company,
          employees: employees.filter(
            (emp: Employee) => emp.companyId === company.id
          ),
        }));

        setCompanies(updatedCompanies);
        // Update selected company with fetched employees
        setSelectedCompany((prevSelected) => ({
          ...prevSelected,
          employees: employees.filter(
            (emp: Employee) => emp.companyId === prevSelected.id
          ),
        }));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeAdded = (newEmployee: Employee) => {
    // Update both the companies array and the selected company
    const updatedCompanies = companies.map((company) => {
      if (company.id === newEmployee.companyId) {
        return {
          ...company,
          employees: [...company.employees, newEmployee],
        };
      }
      return company;
    });

    setCompanies(updatedCompanies);

    if (selectedCompany.id === newEmployee.companyId) {
      setSelectedCompany((prev) => ({
        ...prev,
        employees: [...prev.employees, newEmployee],
      }));
    }
  };

  const handleCompanySelect = (company: Company) => {
    // Find the company with its current employees in the companies array
    const selectedCompanyWithEmployees = companies.find(
      (c) => c.id === company.id
    );
    if (selectedCompanyWithEmployees) {
      setSelectedCompany(selectedCompanyWithEmployees);
    }
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <CompanySelector
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={handleCompanySelect}
          />
          <AddEmployeeDialog
            companyId={selectedCompany.id}
            onEmployeeAdded={handleEmployeeAdded}
          />
        </div>
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
            <div key={`group-${group}`} className="space-y-4">
              <h2 className="text-2xl font-bold">{group}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {employees.map((employee) => (
                  <Draggable
                    key={`employee-${employee.id}-${employee.companyId}`}
                    id={employee.id}
                  >
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
