"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Mail, Phone, MoreVertical } from "lucide-react";
import { Employee } from "../types";
import {
  getAvailabilityStatus,
  formatTimeForTimeZone,
  getTimeDifference,
} from "../utils/timeUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { useToast } from "@/components/ui/use-toast";

interface EmployeeCardProps {
  employee: Employee;
  onUpdate: (updatedEmployee: Employee) => void;
  onDelete: (employeeId: number) => void;
}

export function EmployeeCard({
  employee,
  onUpdate,
  onDelete,
}: EmployeeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const availabilityStatus = getAvailabilityStatus(employee.timeZone);
  const currentTime = formatTimeForTimeZone(employee.timeZone);
  const timeDifference = getTimeDifference(employee.timeZone);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete employee");
      }

      onDelete(employee.id);
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete employee",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full h-full transition-all hover:shadow-lg group">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage
              src={employee.avatar}
              alt={employee.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg bg-primary/5">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl font-semibold leading-none">
              {employee.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              {employee.title}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate">{employee.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm">{currentTime}</span>
              <Badge
                variant={
                  availabilityStatus === "Available" ? "default" : "secondary"
                }
                className="ml-auto"
              >
                {availabilityStatus}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              {timeDifference}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate hover:text-primary transition-colors">
                <a href={`mailto:${employee.email}`}>{employee.email}</a>
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="truncate hover:text-primary transition-colors">
                <a href={`tel:${employee.phone}`}>{employee.phone}</a>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditEmployeeDialog
        employee={employee}
        open={isEditing}
        onOpenChange={setIsEditing}
        onUpdate={onUpdate}
      />
    </>
  );
}
