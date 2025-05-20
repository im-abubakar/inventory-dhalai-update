import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { name, email, password , role} = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields (name, email, password) are required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user" // Default role
    });

    return NextResponse.json({ message: "User created successfully", user: newUser });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error while creating user" }, { status: 500 });
  }
}
