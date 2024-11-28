export interface Employee {
  id: number;
  name: string;
  title: string;
  location: string;
  timeZone: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  directReports: number[];
}

export interface Company {
  id: number;
  name: string;
  employees: Employee[];
}
