import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        category: { type: String, required: true },
        productName: { type: String, required: true },
        stockUnit: { type: String, required: true },
        availableStock: { type: Number, required: true },
        image: { type: String }, // optional image URL
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
