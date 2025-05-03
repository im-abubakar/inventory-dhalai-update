import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inventoryData = [
  { id: 1, type: "Plastic", quantity: "150 kg", unitPrice: "100 Rs", totalValue: "15,000 Rs", lastUpdated: "15 April 2025" },
  { id: 2, type: "Pital", quantity: "80 kg", unitPrice: "200 Rs", totalValue: "15,000 Rs", lastUpdated: "15 April 2025" },
  { id: 3, type: "Backlight Storage Box", quantity: "50 pcs", unitPrice: "500 Rs", totalValue: "15,000 Rs", lastUpdated: "15 April 2025" },
  { id: 4, type: "Plastic Molding", quantity: "150 kg", unitPrice: "150 Rs", totalValue: "15,000 Rs", lastUpdated: "15 April 2025" },
  { id: 5, type: "Brass", quantity: "50 kg", unitPrice: "300 kg", totalValue: "15,000 Rs", lastUpdated: "15 April 2025" },
  { id: 6, type: "Backolight", quantity: "25 kg", unitPrice: "250 kg", totalValue: "6,250 Rs", lastUpdated: "15 April 2025" },
];

export default function Inventory() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 flex justify-between">
        <span>Inventory</span>
        <span className="font-urdu">انوینٹری</span>
      </h1>
      
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex justify-between">
                <span>#</span>
                <span className="font-urdu">نمبر</span>
              </TableHead>
              <TableHead className="flex justify-between">
                <span>Item Type</span>
                <span className="font-urdu">آئٹم کی قسم</span>
              </TableHead>
              <TableHead className="flex justify-between">
                <span>Quantity</span>
                <span className="font-urdu">مقدار</span>
              </TableHead>
              <TableHead className="flex justify-between">
                <span>Unit Price</span>
                <span className="font-urdu">فی یونٹ قیمت</span>
              </TableHead>
              <TableHead className="flex justify-between">
                <span>Total Value</span>
                <span className="font-urdu">کل قیمت</span>
              </TableHead>
              <TableHead className="flex justify-between">
                <span>Last Updated</span>
                <span className="font-urdu">آخری تجدید</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.totalValue}</TableCell>
                <TableCell>{item.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}