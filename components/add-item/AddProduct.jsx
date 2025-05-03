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

  // Static categories
  const categories = [
    "Plastic",
    "Plastic Molding",
    "Backlight Storage Box",
    "Backlight",
    "Brass",
    "Pital",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedCategory || !stockUnit || !availableStock) {
      toast.error("Please fill all required fields");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("category", selectedCategory);
      formData.append("productName", productName);
      formData.append("stockUnit", stockUnit);
      formData.append("availableStock", availableStock);
      if (image) {
        formData.append("image", image);
      }
  
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // ✅ Show specific toast if duplicate
        if (data.error === "Product already exists") {
          toast.error("Product already exists");
        } else {
          toast.error("Failed to add product");
        }
        return;
      }
  
      toast.success("Product added successfully");
  
      // Reset form
      setSelectedCategory("");
      setProductName("");
      setStockUnit("");
      setAvailableStock("");
      setImage(null);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <Select value={stockUnit} onValueChange={setStockUnit}>
                <SelectTrigger id="stockUnit">
                  <SelectValue placeholder="Select stock unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="dozen">dozen</SelectItem>
                  <SelectItem value="gurace">gurace</SelectItem>
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

            <Button type="submit" className="w-full">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
