"use client";

import { useRouter } from "next/navigation";
import AddProduct from "@/components/add-item/AddProduct"
import { useState } from "react";
import {
  Package,
  Settings,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [openProductList, setOpenProductList] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex space-x-2">
            {/* Products Buttons */}
            <div className="flex items-center space-x-1">
              {/* Product List Modal */}
              <Dialog open={openProductList} onOpenChange={setOpenProductList}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center"
                    onClick={() => setOpenProductList(true)}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </Button>
                </DialogTrigger>
                <DialogContent className="mt-[0px] mx-auto w-[90%] max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Product List</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4 space-y-2">
                    <div className="border p-2 rounded">Product 1</div>
                    <div className="border p-2 rounded">Product 2</div>
                    <div className="border p-2 rounded">Product 3</div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Add Product Modal */}
              <Dialog open={openProductForm} onOpenChange={setOpenProductForm}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpenProductForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="mt-[0px] mx-auto w-[25%] max-w-xl">

                  <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                  </DialogHeader>
                  <AddProduct />

                </DialogContent>
              </Dialog>
            </div>







            {/* Categories Buttons */}

            {/* 
            <div className="flex items-center space-x-1">
              <Dialog open={openCategoryList} onOpenChange={setOpenCategoryList}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center"
                    onClick={() => setOpenCategoryList(true)}
                  >
                    <Tags className="mr-2 h-4 w-4" />
                    Categories
                  </Button>
                </DialogTrigger>
                <DialogContent className="mt-[0px] mx-auto w-[90%] max-w-xl">

                  <DialogHeader>
                    <DialogTitle>Category List</DialogTitle>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog open={openCategoryForm} onOpenChange={setOpenCategoryForm}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setOpenCategoryForm(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="mt-[0px] mx-auto w-[90%] max-w-xl">

                  <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                  </DialogHeader>
                  <AddCategory />
                </DialogContent>
              </Dialog>
            </div>

             */}


          </div>

          <div className="flex items-center space-x-2">
            
            
            <Button
              variant="ghost"
              className="flex items-center"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="destructive" size="sm">
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
