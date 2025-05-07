"use client";

import { useRouter, usePathname } from "next/navigation";
import AddProduct from "@/components/add-item/AddProduct";
import ProductList from "@/components/ProductList";
import { useEffect, useState } from "react";
import { Package, Plus, File, BookDashed, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddStock from "@/components/AddStock";
import Settings from "@/components/settings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  const [products, setProducts] = useState([]);
  const [openProductList, setOpenProductList] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openStockForm, setOpenStockForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Hamburger Menu Button for Mobile */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-2">
            <Dialog open={openProductForm} onOpenChange={setOpenProductForm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 mt-1">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="mt-0 mx-auto w-[25%] max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>
                <AddProduct />
              </DialogContent>
            </Dialog>

            <Dialog open={openProductList} onOpenChange={setOpenProductList}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Products
                </Button>
              </DialogTrigger>
              <DialogContent className="mt-0 mx-auto w-[95%] max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Products</DialogTitle>
                </DialogHeader>

                <ProductList
                  products={products}
                  fetchProducts={fetchProducts}
                />
              </DialogContent>
            </Dialog>

            <Dialog open={openStockForm} onOpenChange={setOpenStockForm}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center ml-4">
                  <Package className="mr-2 h-4 w-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="mt-0 mx-auto w-[25%] max-w-xl">
                <DialogHeader></DialogHeader>
                <AddStock />
              </DialogContent>
            </Dialog>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              className="flex items-center"
              onClick={() => router.push("/dashboard")}
            >
              <BookDashed className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            {session?.user?.role === "admin" && (
              <Button
                variant={
                  pathname === "/dashboard/transaction" ? "default" : "ghost"
                }
                className="flex items-center"
                onClick={() => router.push("/dashboard/transaction")}
              >
                <File className="mr-2 h-4 w-4" />
                Transaction
              </Button>
            )}

            {session?.user?.role === "admin" && (
              <Image
                src="/profile.jpeg"
                alt="Profile"
                className="w-8 h-8 object-cover"
                height={100}
                width={100}
              />
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white shadow-md p-4 space-y-2">
            <Dialog open={openProductForm} onOpenChange={setOpenProductForm}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Add Product
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={openProductList} onOpenChange={setOpenProductList}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  Products
                </Button>
              </DialogTrigger>
            </Dialog>

            <Dialog open={openStockForm} onOpenChange={setOpenStockForm}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full">
                  Add Stock
                </Button>
              </DialogTrigger>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => router.push("/dashboard")}
            >
              Dashboard
            </Button>

            {session?.user?.role === "admin" && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => router.push("/dashboard/transaction")}
              >
                Transaction
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        )}
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}