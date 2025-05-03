"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Check, Printer, Hand, Ban, DollarSign, X, TicketIcon, CheckCheck, CheckCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CartItems from "@/components/cartItems";

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

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const handleDone = async () => {
    try {
      // Loop through each cart item
      for (const item of cartItems) {
        await fetch(`/api/products/${item._id}/deduct`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ qty: item.qty }), // deduct these many qty
        });
      }

      // Optionally refetch products to update UI
      await fetchProducts();

      // Clear cart
      setCartItems([]);

      // Show toast or success alert
      alert("Stock updated & sale completed!");

    } catch (err) {
      console.error("Failed to complete sale:", err);
      alert("Error occurred while completing sale.");
    }
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
          <CartItems
            cartItems={cartItems}
            setCartItems={setCartItems}
            onRemove={handleRemoveFromCart}
          />
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
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={handleDone}
            >
              <CheckCheckIcon size={16} className="mr-1" />
              Done
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-4 bg-white rounded-xl shadow-md ml-4 h-[600px] overflow-y-auto">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap sticky top-0 bg-white py-2 z-10">
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
