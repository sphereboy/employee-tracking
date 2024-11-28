import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { Employee } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body); // Debug log

    const client = await clientPromise;
    const db = client.db("employee-tracking");

    // Validate required fields
    const requiredFields = [
      "name",
      "title",
      "location",
      "timeZone",
      "department",
      "email",
      "phone",
      "companyId",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate a new ID
    const lastEmployee = await db
      .collection("employees")
      .findOne({}, { sort: { id: -1 } });

    const newId = (lastEmployee?.id || 0) + 1;

    const newEmployee: Employee = {
      id: newId,
      name: body.name,
      title: body.title,
      location: body.location,
      timeZone: body.timeZone,
      department: body.department,
      email: body.email,
      phone: body.phone,
      avatar: body.avatar,
      directReports: [],
      companyId: body.companyId,
    };

    console.log("Attempting to insert employee:", newEmployee); // Debug log

    const result = await db.collection("employees").insertOne(newEmployee);
    console.log("Insert result:", result); // Debug log

    if (!result.acknowledged) {
      throw new Error("Failed to insert employee into database");
    }

    return NextResponse.json(newEmployee);
  } catch (error) {
    console.error("Error in POST /api/employees:", error);

    // Return a more detailed error response
    return NextResponse.json(
      {
        error: "Failed to create employee",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("employee-tracking");

    const employees = await db.collection("employees").find({}).toArray();
    console.log("Retrieved employees:", employees); // Debug log

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error in GET /api/employees:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch employees",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
