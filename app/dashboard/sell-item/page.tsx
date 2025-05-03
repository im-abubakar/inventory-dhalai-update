"use client";

import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Receipt } from "@/components/Receipt";

// 🧠 Item type to categories map
const categoryMap: { [key: string]: string[] } = {
  Plastic: ["Bag A", "Bag B", "Bag C"],
  Pital: ["Pital Rod", "Pital Scrap"],
  "Backlight Storage Box": ["Small Box", "Large Box"],
  "Plastic Molding": ["Mold Type 1", "Mold Type 2"],
  Brass: ["Brass Type A", "Brass Type B"],
  Backolight: ["Sheet", "Granules"],
};

export default function SellItem() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [measurementType, setMeasurementType] = useState<string>("pieces");
  const receiptRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setAllCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);


  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          itemType: selectedType,
          category: selectedCategory,
          quantity: Number(quantity),
          measurementType,
          price: Number(price),
        }),
      });

      if (!response.ok) throw new Error("Failed to process sale");

      toast.success("Sale completed successfully");
      handlePrint();

      // Reset form
      setSelectedType("");
      setSelectedCategory("");
      setQuantity("");
      setCustomerName("");
      setPrice("");
    } catch (error) {
      toast.error("Failed to process sale");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex justify-between">
        <span>Sell Item</span>
        <span className="font-urdu">آئٹم فروخت کریں</span>
      </h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Sale Details</span>
            <span className="font-urdu">فروخت کی تفصیلات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">


            {/* Item Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="flex justify-between">
                <span>Item Type</span>
                <span className="font-urdu">آئٹم کی قسم</span>
              </Label>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  setSelectedCategory("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Plastic">Plastic / پلاسٹک</SelectItem>
                  <SelectItem value="Pital">Pital / پیتل</SelectItem>
                  <SelectItem value="Backlight Storage Box">Backlight Storage Box / بیک لائٹ سٹوریج باکس</SelectItem>
                  <SelectItem value="Plastic Molding">Plastic Molding / پلاسٹک مولڈنگ</SelectItem>
                  <SelectItem value="Brass">Brass / پیتل</SelectItem>
                  <SelectItem value="Backolight">Backolight / بیک لائٹ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Cards */}
            {selectedType && categoryMap[selectedType] && (
              <div className="mt-4">
                <Label className="flex justify-between">
                  <span>Select Category</span>
                  <span className="font-urdu">زمرہ منتخب کریں</span>
                </Label>
                <div className="flex flex-wrap gap-4 mt-2">
                  {categoryMap[selectedType].map((category) => (
                    <div
                      key={category}
                      className={`w-[300px] h-[400px] border rounded-lg shadow-sm flex items-center justify-center text-xl font-medium cursor-pointer transition ${selectedCategory === category
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white hover:bg-gray-100"
                        }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            )}





            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                !selectedType ||
                !selectedCategory ||
                !quantity ||
                !customerName ||
                !price
              }
            >
              <span>Complete Sale</span>
              <span className="font-urdu mr-2">فروخت مکمل کریں</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Hidden receipt template for printing */}
      {currentDate && (
        <div className="hidden">
          <Receipt
            ref={receiptRef}
            customerName={customerName}
            itemType={selectedType}
            category={selectedCategory}
            quantity={Number(quantity)}
            measurementType={measurementType}
            price={Number(price)}
            date={currentDate}
          />
        </div>
      )}

    </div>
  );
}
