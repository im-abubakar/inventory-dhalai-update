import React from 'react';

interface ReceiptProps {
  customerName: string;
  itemType: string;
  category?: string;
  quantity: number;
  measurementType: string;
  price: number;
  date: Date;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(
  ({ customerName, itemType, category, quantity, measurementType, price, date }, ref) => {
    return (
      <div ref={ref} className="p-4 w-80 font-mono text-sm">
        <div className="text-center mb-4">
          <h2 className="font-bold">Ali Hassan Dhalai Brass</h2>
          <p className="text-xs">Receipt</p>
        </div>

        <div className="border-t border-b border-dashed py-2 mb-2">
          <p>Date: {date.toLocaleString()}</p>
          <p>Customer: {customerName}</p>
        </div>

        <div className="mb-4">
          <p>Item: {itemType}</p>
          {category && <p>Category: {category}</p>}
          <p>Quantity: {quantity} {measurementType}</p>
        </div>

        <div className="text-center text-xs mt-4">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);