"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Ban, CheckCheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CartItems from "../../components/CartItems";
import Navbar from "@/components/Navbar";
export default function Dashboard() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to login if not authenticated
      router.push("/login");
    },
  });

  // console.log("role is", session?.user?.role);
  const [selectedTab, setSelectedTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);



  const fetchProducts = async () => {   // fetching products
    try {
      const res = await fetch("/api/products");
      const data = await res.json(); // Only this declaration is needed
      setProducts(data);
      setFilteredProducts(data); // Initially show all
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // if (status === "loading") {
  //   return <div className="flex items-center justify-center h-screen">
  //     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  //     <span className="ml-2">Checking session...</span>
  //   </div>; // While checking session
  // }


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
    if (cartItems.length === 0) {
      toast.error("Please add at least one product before submitting.");
      return; // Stop the function here
    }

    try {
      setIsSubmitting(true);
      // 1. Deduct stock first
      // console.log("cart items are", cartItems);
      const itemsToDeduct = cartItems.map((item) => ({
        id: item._id,
        qty: item.qty,
        stockUnit: item.stockUnit,
        category: item.category,
      }));

      const res1 = await fetch("/api/products/deduct", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemsToDeduct),
      });

      const data1 = await res1.json();

      if (!res1.ok) {
        toast.error(data1.error || "Failed to update stock");
        return;
      }

      // 2. Save sale record
      const salePayload = {
        items: cartItems.map((item) => ({
          productName: item.productName,
          qty: item.qty,
          soldAt: new Date(),
        })),
      };

      const res2 = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(salePayload),
      });

      const data2 = await res2.json();

      if (!res2.ok) {
        toast.error(data2.error || "Failed to record sale");
        return;
      }

      toast.success("Sale recorded and stock updated!");

      setCartItems([]); // Clear cart
      fetchProducts();  // Refresh products

    } catch (err) {
      console.error(err);
      toast.error("Error during sale process");
    } finally {
      setIsSubmitting(false); // Always re-enable button
    }
  };





  return (

    <div className="min-h-screen bg-gray-50">
      <Navbar
        products={products}
        fetchProducts={fetchProducts}
        handleLogout={handleLogout}
      />
      <div className="flex flex-col lg:flex-row p-4 bg-gradient-to-br from-green-100 to-green-200 gap-4">
        {/* Left Section */}
        <div className="lg:w-1/2 w-full p-4 bg-white rounded-xl shadow-md flex flex-col justify-between">
          <div>
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

            <div className="flex gap-2 flex-wrap">
              <Button variant="secondary">
                <Printer size={16} className="mr-1" />
                Print
              </Button>
              <Button variant="destructive">
                <Ban size={16} className="mr-1" />
                Cancel
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                onClick={handleDone}
                disabled={isSubmitting} // Disable button when submitting
              >
                <CheckCheckIcon size={16} className="mr-1" />
                {isSubmitting ? "Processing..." : "Done"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        {/* Right Section */}
        <div className="lg:w-1/2 w-full p-4 bg-white rounded-xl shadow-md h-auto">
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

          {/* Product List with Scrollbar */}
          <div className="h-[500px] lg:h-[420px] overflow-y-auto">
            {/* Product Cards */}
            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-[600px]">
              {filteredProducts.map((prod, index) => (
                <Card
                  key={prod._id || index}
                  className="text-center cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleAddToCart(prod)}
                >
                  <CardContent className="py-4">
                    {prod.image ? (
                      <Image
                        src={prod.image}
                        alt={prod.productName}
                        className="h-15 w-full object-cover mb-2 rounded"
                        width={60}
                        height={80}
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
      </div>
    </div>
  );
}

