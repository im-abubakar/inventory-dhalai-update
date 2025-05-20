import { NextResponse } from "next/server";
import Product from "@/models/Product"; // your product mongoose model
import { writeFile } from "fs/promises";
import path from "path";
import connectDB from "@/lib/mongodb";



// Enable dynamic route (optional but good)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find(); // Fetching all categories
    return NextResponse.json(products); // Sending products as JSON response
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}


export async function POST(req) {
  await connectDB();

  const formData = await req.formData();
  const category = formData.get("category");
  const productName = formData.get("productName");
  const stockUnit = formData.get("stockUnit");
  let availableStock = Number(formData.get("availableStock")); // convert to number
  const image = formData.get("image"); // image file

  // ✅ Apply custom logic: Backlight + dozen => multiply stock by 12
  if (category === "Backlight" && stockUnit === "dozen") {
    availableStock = availableStock * 12;
  }

  // ✅ Check if product already exists (case-insensitive)
  const existingProduct = await Product.findOne({
    category,
    productName: { $regex: new RegExp("^" + productName + "$", "i") },
  });

  if (existingProduct) {
    return NextResponse.json(
      { error: "Product already exists" },
      { status: 400 }
    );
  }

  // ✅ Save image if present
  let imageUrl = null;
  if (image) {
    imageUrl = image; // directly assign the URL
  }

  // ✅ Create and save new product
  const newProduct = new Product({
    category,
    productName,
    stockUnit,
    availableStock,
    image: imageUrl,
  });

  await newProduct.save();

  return NextResponse.json({ message: "Product added" }, { status: 201 });
}
