import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Mail, Phone } from "lucide-react";
import { Employee } from "../types";
import {
  getAvailabilityStatus,
  formatTimeForTimeZone,
  getTimeDifference,
} from "../utils/timeUtils";

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const availabilityStatus = getAvailabilityStatus(employee.timeZone);
  const currentTime = formatTimeForTimeZone(employee.timeZone);
  const timeDifference = getTimeDifference(employee.timeZone);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback className="text-lg">
            {employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl">{employee.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{employee.title}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{currentTime}</span>
            <Badge
              variant={
                availabilityStatus === "Available" ? "default" : "secondary"
              }
            >
              {availabilityStatus}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{timeDifference}</div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
