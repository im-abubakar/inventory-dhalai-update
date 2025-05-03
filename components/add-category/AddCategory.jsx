"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AddCategories() {
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: newCategory,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.message || "Failed to add category");
        return;
      }

      toast.success("Category added successfully");
      setNewCategory("");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Category</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category Name</Label>
              <Input
                id="category"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!newCategory}
            >
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
