"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const AddProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [stockUnit, setStockUnit] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Static categories
  const categories = [
    "Plastic",
    "Plastic Molding",
    "Backlight Storage Box",
    "Backlight",
    "Brass",
    "Pital",
  ];

  // Dynamic stock unit options based on category
  const getStockUnitOptions = () => {
    switch (selectedCategory) {
      case "Plastic":
        return ["bags"];
      case "Pital":
        return ["kg"];
      case "Brass":
        return ["gurace"];
      case "Backlight Storage Box":
      case "Plastic Molding":
        return ["dozen"];
      case "Backlight":
        return ["dozen", "quantity"];
      default:
        return [];
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);

    // Automatically set stock unit for "Brass"
    if (value === "Brass") {
      setStockUnit("gurace");
    } else {
      setStockUnit(""); // Reset stock unit for other categories
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!selectedCategory || !stockUnit || !availableStock) {
    toast.error("Please fill all required fields");
    return;
  }

  setIsSubmitting(true);

  let imageUrl = "";

  try {
    // ✅ 1. Upload image to Cloudinary (if image selected)
    if (image) {
      const cloudinaryData = new FormData();
      cloudinaryData.append("file", image);
      cloudinaryData.append("upload_preset", "dhalaibrass"); // replace with actual preset
      cloudinaryData.append("cloud_name", "dl5elwksn"); // optional if using endpoint

      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dl5elwksn/image/upload", {
        method: "POST",
        body: cloudinaryData,
      });

      const cloudinaryJson = await cloudinaryRes.json();
      imageUrl = cloudinaryJson.secure_url; // ✅ Cloudinary-hosted image URL
    }

    // ✅ 2. Prepare form data to send to your own API
    const formData = new FormData();
    formData.append("category", selectedCategory);
    formData.append("productName", productName);
    formData.append("stockUnit", stockUnit);
    formData.append("availableStock", availableStock);
    if (imageUrl) {
      // If image was uploaded to Cloudinary, attach the URL
      formData.append("image", imageUrl);
    }

    // ✅ 3. Send form data to your Next.js API route
    const res = await fetch("/api/products", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error === "Product already exists") {
        toast.error("Product already exists");
      } else {
        toast.error("Failed to add product");
      }
      return;
    }

    toast.success("Product added successfully");

    // ✅ Reset form
    setSelectedCategory("");
    setProductName("");
    setStockUnit("");
    setAvailableStock("");
    setImage(null);
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setIsSubmitting(false);
  }
};



  return (
    <div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Item Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* Stock Unit Select */}
            <div className="space-y-2">
              <Label htmlFor="stockUnit">Stock Unit</Label>
              <Select
                value={stockUnit}
                onValueChange={setStockUnit}
              // Disable dropdown for "Brass"
              >
                <SelectTrigger id="stockUnit">
                  <SelectValue placeholder="Select stock unit" />
                </SelectTrigger>
                <SelectContent>
                  {getStockUnitOptions().map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Available Stock */}
            <div className="space-y-2">
              <Label htmlFor="availableStock">Available Stock</Label>
              <Input
                id="availableStock"
                type="number"
                placeholder="Enter available stock"
                value={availableStock}
                onChange={(e) => setAvailableStock(e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image (optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;