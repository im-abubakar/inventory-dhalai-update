import { NextResponse } from "next/server";
import Product from "@/models/product"; // Your Mongoose Product model
import connectDB from "@/lib/mongodb";

export async function PUT(req) {
  await connectDB();

  const items = await req.json(); // Expecting array of items: [{ id, qty }, ...]
  console.log("Items to deduct:", items);
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  try {
    for (const item of items) {
      const { id, qty, stockUnit, category } = item;

      if (!id || qty <= 0) continue;

      const product = await Product.findById(id);

      if (!product) continue;

      // Calculate quantity to deduct
      let deductQty = qty;

      if (category === "Backlight" && stockUnit === "dozen") {
        deductQty = qty * 12; // Convert dozen to pieces
      }

      if (product.availableStock < deductQty) {
        return NextResponse.json({ error: `Not enough stock for ${product.productName}` }, { status: 400 });
      }

      // Deduct stock
      product.availableStock -= deductQty;
      await product.save();
    }

    return NextResponse.json({ message: "Stock updated for all items" });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
