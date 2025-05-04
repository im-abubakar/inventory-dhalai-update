import { NextResponse } from "next/server";
import Product from "@/models/product"; // Your Mongoose Product model
import connectDB from "@/lib/mongodb";

export async function PUT(req) {
  await connectDB();

  const items = await req.json(); // Expecting array of items: [{ id, qty }, ...]

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  try {
    for (const item of items) {
      const { id, qty } = item;

      if (!id || qty <= 0) continue;

      const product = await Product.findById(id);

      if (!product) continue;

      if (product.availableStock < qty) {
        return NextResponse.json({ error: `Not enough stock for ${product.productName}` }, { status: 400 });
      }

      product.availableStock -= qty;
      await product.save();
    }

    return NextResponse.json({ message: "Stock updated for all items" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
