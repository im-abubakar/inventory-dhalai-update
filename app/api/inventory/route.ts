import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";

export async function GET() {
  try {
    await connectDB();
    const items = await Item.find({});
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, category, quantity, measurementType } = body;

    await connectDB();
    const item = await Item.create({
      type,
      category,
      quantity,
      measurementType
    });
    
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add item" },
      { status: 500 }
    );
  }
}