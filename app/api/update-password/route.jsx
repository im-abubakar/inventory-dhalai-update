import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/route"; // ✅ Correct import
import bcrypt from "bcryptjs"; // Use bcryptjs to match your NextAuth file
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions); // ✅ Now works

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in DB
    await User.findOneAndUpdate(
      { email: session.user.email },
      { password: hashedPassword }
    );

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
