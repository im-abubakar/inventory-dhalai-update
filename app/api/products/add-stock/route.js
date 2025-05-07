import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req) {
  await dbConnect();

  try {
    const formData = await req.formData();

    const category = formData.get("category");
    const productName = formData.get("productName");
    const stockUnit = formData.get("stockUnit");
    let availableStock = Number(formData.get("availableStock"));

    if (!category || !productName || !stockUnit || !availableStock) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Special rule: multiply by 12 if category is Backlight and stockUnit is dozen
    if (category === "Backlight" && stockUnit === "dozen") {
      availableStock = availableStock * 12;
    }

    // Find the existing product
    const existingProduct = await Product.findOne({
      category,
      productName,
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Add up the stock
    existingProduct.availableStock += availableStock;

    await existingProduct.save();

    return NextResponse.json({ message: "Stock updated successfully", product: existingProduct }, { status: 200 });

  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
