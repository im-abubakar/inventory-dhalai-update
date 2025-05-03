import { NextResponse } from "next/server";
import Category from "@/models/Category"; // your mongoose model
import connectDB from "../../../lib/mongodb"; // adjust path according to your file structure

// This ensures the route will be dynamic
export const dynamic = "force-dynamic";

// GET: fetch all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find(); // Fetching all categories
    return NextResponse.json(categories); // Sending categories as JSON response
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST: add new category (single field)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    console.log(body); // log incoming data

    const { category } = body;

    if (!category || category.trim() === "") {
      throw new Error("Category is required");
    }

    const newCategory = new Category({ category });
    await newCategory.save();

    return NextResponse.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add category" },
      { status: 500 }
    );
  }
}
