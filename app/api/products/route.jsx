import { NextResponse } from "next/server";
import Product from "@/models/Product"; // your mongoose model
import connectDB from "@/lib/mongodb"; // adjust path

import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";


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
  try {
    await connectDB();

    // Parse form data (multipart/form-data)
    const formData = await req.formData();

    const category = formData.get("category");
    const productName = formData.get("productName");
    const stockUnit = formData.get("stockUnit");
    const availableStock = formData.get("availableStock");
    const imageFile = formData.get("image"); // image file (optional)

    // Validate required fields
    if (!category || !productName || !stockUnit || !availableStock) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = null;

    // If image uploaded
    if (imageFile && typeof imageFile.name === "string") {
      const ext = path.extname(imageFile.name);
      const filename = uuidv4() + ext;
      const filePath = path.join(process.cwd(), "public", "uploads", filename);

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      imageUrl = `/uploads/${filename}`;
    }

    // Save to DB
    const newProduct = new Product({
      category,
      productName,
      stockUnit,
      availableStock,
      image: imageUrl,
    });

    await newProduct.save();

    return NextResponse.json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
