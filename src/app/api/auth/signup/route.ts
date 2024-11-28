import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { email, name, companyName } = await request.json();

    if (!email || !name || !companyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("employee-tracking-2");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create account first
    const account = await db.collection("accounts").insertOne({
      name: companyName,
      members: [
        {
          email,
          role: "admin",
          invitedAt: new Date(),
          joinedAt: new Date(),
        },
      ],
      companies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!account.insertedId) {
      throw new Error("Failed to create account");
    }

    // Create user
    const userDoc = {
      email,
      name,
      role: "admin" as const,
      accountId: account.insertedId.toString(),
      createdAt: new Date(),
    };

    const user = await db.collection("users").insertOne(userDoc);

    if (!user.insertedId) {
      // Rollback account creation if user creation fails
      await db.collection("accounts").deleteOne({ _id: account.insertedId });
      throw new Error("Failed to create user");
    }

    return NextResponse.json({
      success: true,
      userId: user.insertedId.toString(),
      accountId: account.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        error: "Failed to create account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
