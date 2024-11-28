import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const updates = await request.json();
    console.log("Received updates:", updates);

    const client = await clientPromise;
    const db = client.db("employee-tracking-2");

    // Find the employee first to verify it exists and belongs to the user's account
    const existingEmployee = await db.collection("employees").findOne({
      id,
      accountId: session.user.accountId,
    });

    console.log("Existing employee:", existingEmployee);

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Remove _id from updates if it exists
    const { _id, ...updateData } = updates;

    // Prepare update data
    const finalUpdateData = {
      ...updateData,
      updatedAt: new Date(),
      accountId: session.user.accountId, // Ensure accountId is preserved
      id, // Ensure id is preserved
    };

    console.log("Update data:", finalUpdateData);

    // Update the employee
    const result = await db.collection("employees").updateOne(
      {
        id,
        accountId: session.user.accountId,
      },
      {
        $set: finalUpdateData,
      }
    );

    console.log("Update result:", result);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update employee" },
        { status: 400 }
      );
    }

    // Get the updated employee
    const updatedEmployee = await db.collection("employees").findOne({
      id,
      accountId: session.user.accountId,
    });

    if (!updatedEmployee) {
      throw new Error("Failed to fetch updated employee");
    }

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error("Update employee error:", error);
    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Failed to update employee",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid employee ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("employee-tracking-2");

    // Find the employee first to verify it exists and belongs to the user's account
    const existingEmployee = await db.collection("employees").findOne({
      id,
      accountId: session.user.accountId,
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Delete the employee
    const result = await db.collection("employees").deleteOne({
      id,
      accountId: session.user.accountId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete employee" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete employee error:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
