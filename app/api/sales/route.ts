import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Item from "@/models/Item";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, itemType, category, quantity, measurementType, price } = body;

    await connectDB();

    // Create sale record
    const sale = await Sale.create({
      customerName,
      itemType,
      category,
      quantity,
      measurementType,
      price,
      date: new Date()
    });

    // Update inventory
    const query = category 
      ? { type: itemType, category }
      : { type: itemType };
    
    await Item.updateOne(
      query,
      { $inc: { quantity: -quantity } }
    );

    return NextResponse.json(sale);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process sale" },
      { status: 500 }
    );
  }
}