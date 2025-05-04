import { NextResponse } from "next/server";
import Sale from "@/models/Sale";
import connectDB from "@/lib/mongodb";


export async function POST(req) {
  await connectDB();

  const body = await req.json();

  try {
    const sale = new Sale(body);
    await sale.save();

    return NextResponse.json({ message: "Sale recorded successfully!" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to record sale" }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB();
    const sales = await Sale.find(); 
    return NextResponse.json(sales); 
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}
