import "next-auth";
import { ObjectId } from "mongodb";

declare module "next-auth" {
  interface User {
    _id?: ObjectId;
    id: string;
    email: string;
    name: string;
    role: "admin" | "member" | "employee";
    accountId: string;
    image?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "member" | "employee";
    accountId?: string;
  }
}
