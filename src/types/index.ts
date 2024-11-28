export interface Employee {
  id: number;
  userId?: string;
  name: string;
  title: string;
  location: string;
  timeZone: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  directReports: number[];
  companyId: number;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: number;
  name: string;
  employees: Employee[];
}

export interface Account {
  id: string;
  name: string;
  ownerId: string;
  members: AccountMember[];
  companies: Company[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountMember {
  userId: string;
  role: "admin" | "member";
  email: string;
  invitedAt: Date;
  joinedAt?: Date;
}
