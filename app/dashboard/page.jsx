"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Check, Printer, Hand, Ban, DollarSign, X, TicketIcon, CheckCheck, CheckCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  // Static categories
  const categories = [
    "All",
    "Plastic",
    "Plastic Molding",
    "Backlight Storage Box",
    "Backlight",
    "Brass",
    "Pital",
  ];

  const [selectedTab, setSelectedTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // State to hold items added to cart (left table)
  const [cartItems, setCartItems] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data); // Initially show all
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter when tab changes
  useEffect(() => {
    if (selectedTab === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((prod) => prod.category === selectedTab)
      );
    }
  }, [selectedTab, products]);

  // Handle adding to cart
  const handleAddToCart = (product) => {
    // If already in cart, increase qty
    const existing = cartItems.find((item) => item._id === product._id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  // Handle removing from cart
  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };

  return (
    <div className="flex p-4 bg-gradient-to-br from-green-100 to-green-200">
      {/* Left Section */}
      <div className="w-1/2 p-4 bg-white rounded-xl shadow-md flex flex-col justify-between">
        <div>
          {/* Customer Select and Barcode */}
          <div className="flex items-center gap-2 mb-2">
            <Input placeholder="Walk in customer" />
            <Button size="icon">
              <Plus />
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Input placeholder="Scan barcode or type the number then hit enter" />
            <Button size="icon" variant="secondary">
              <Check />
            </Button>
          </div>

          {/* Items Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between px-4 py-2 bg-gray-100 font-semibold">
              <span>#</span>
              <span>Category</span>
              <span>Item</span>
              <span>Qty</span>
              <span>X</span>
            </div>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className="flex justify-between px-4 py-2 border-b items-center"
                >
                  <span>{index + 1}</span>
                  <span>{item.category}</span>
                  <span>{item.productName}</span>
                  <span>{item.qty} {item.stockUnit}</span>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                No items added
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Total Item(s): {cartItems.length}</span>
            
          </div>

          <div className="flex gap-2">
            <Button variant="secondary">
              <Printer size={16} className="mr-1" />
              Print
            </Button>
            <Button variant="destructive">
              <Ban size={16} className="mr-1" />
              Cancel
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <CheckCheckIcon size={16} className="mr-1" />
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-4 bg-white rounded-xl shadow-md ml-4">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedTab === cat ? "default" : "secondary"}
              onClick={() => setSelectedTab(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-5 gap-4">
          {filteredProducts.map((prod, index) => (
            <Card
              key={prod._id || index}
              className="text-center cursor-pointer hover:shadow-lg transition"
              onClick={() => handleAddToCart(prod)}
            >
              <CardContent className="py-4">
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.productName}
                    className="h-20 w-full object-cover mb-2 rounded"
                  />
                ) : (
                  <div className="text-gray-400 mb-1">NO IMAGE</div>
                )}
                <div className="text-blue-500 font-semibold">
                  {prod.productName}
                </div>
                <div className="text-xs text-gray-500">
                  Stock: {prod.availableStock} {prod.stockUnit}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
