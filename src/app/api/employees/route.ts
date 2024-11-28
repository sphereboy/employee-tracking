import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("employee-tracking-2");

    const employees = await db
      .collection("employees")
      .find({ accountId: session.user.accountId })
      .toArray();

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("employee-tracking-2");

    // Get the last employee ID
    const lastEmployee = await db
      .collection("employees")
      .findOne({}, { sort: { id: -1 } });

    const newId = (lastEmployee?.id || 0) + 1;

    const newEmployee = {
      ...body,
      id: newId,
      accountId: session.user.accountId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("employees").insertOne(newEmployee);

    if (!result.insertedId) {
      throw new Error("Failed to create employee");
    }

    return NextResponse.json(newEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
