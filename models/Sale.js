import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    items: [
      {
        productName: { type: String, required: true },
        qty: { type: Number, required: true },
        soldAt: { type: Date, default: Date.now }, // Sold time per item
      },
    ],
    saleDate: { type: Date, default: Date.now }, // Overall sale timestamp
  },
  { timestamps: true }
);

const Sale = mongoose.models.Sale || mongoose.model("Sale", SaleSchema);

export default Sale;
