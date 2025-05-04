"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

const AddStock = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [productName, setProductName] = useState("");
    const [stockUnit, setStockUnit] = useState("");
    const [availableStock, setAvailableStock] = useState("");
    const [products, setProducts] = useState([]); // store products from DB

    // Static categories
    const categories = [
        "Plastic",
        "Plastic Molding",
        "Backlight Storage Box",
        "Backlight",
        "Brass",
        "Pital",
    ];

    // Fetch all products from DB
    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter products based on selected category
    const getProductOptions = () => {
        return products.filter((p) => p.category === selectedCategory);
    };

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
        setProductName(""); // Reset product on category change

        // Automatically set stock unit for "Brass"
        if (value === "Brass") {
            setStockUnit("gurace");
        } else {
            setStockUnit(""); // Reset stock unit for other categories
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCategory || !productName || !stockUnit || !availableStock) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("category", selectedCategory);
            formData.append("productName", productName);
            formData.append("stockUnit", stockUnit);
            formData.append("availableStock", availableStock);

            const res = await fetch("/api/products/add-stock", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to add stock");
                return;
            }

            toast.success("Stock updated successfully");

            // Reset form
            setSelectedCategory("");
            setProductName("");
            setStockUnit("");
            setAvailableStock("");
        } catch (err) {
            toast.error("Something went wrong");
            console.error(err);
        }
    };

    return (
        <div>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-center">Add Stock</CardTitle>
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

                        {/* Product Name Select */}
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Select
                                value={productName}
                                onValueChange={setProductName}
                                disabled={!selectedCategory} // disable until category selected
                            >
                                <SelectTrigger id="productName">
                                    <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getProductOptions().map((p) => (
                                        <SelectItem key={p._id} value={p.productName}>
                                            {p.productName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Stock Unit Select */}
                        <div className="space-y-2">
                            <Label htmlFor="stockUnit">Stock Unit</Label>
                            <Select
                                value={stockUnit}
                                onValueChange={setStockUnit}
                                disabled={!selectedCategory}
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

                        <Button type="submit" className="w-full">
                            Add Stock
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddStock;
