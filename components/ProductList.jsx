import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProductList = ({ products, fetchProducts }) => {
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedProduct, setEditedProduct] = useState(null);

    const handleEdit = (product) => {
        setEditingProductId(product._id); // Use _id as the unique identifier
        setEditedProduct({ ...product }); // Initialize the edited product state
    };

    const handleEditChange = (e, field) => {
        setEditedProduct((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const saveEdit = async () => {
        if (!editedProduct?.productName || !editedProduct.stockUnit || !editedProduct.availableStock || !editedProduct.category) {
            toast.error("Product name and price are required.");
            return;
        }

        try {
            const response = await fetch(`/api/products/${editingProductId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedProduct),
            });

            if (response.ok) {
                toast.success("Product updated successfully!");
                setEditingProductId(null); // Reset editing state
                setEditedProduct(null); // Clear edited product state
                fetchProducts(); // Refresh the product list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to update product.");
            }
        } catch (err) {
            console.error("Failed to update product:", err);
            toast.error("An error occurred while updating the product.");
        }
    };

    const cancelEdit = () => {
        setEditingProductId(null); // Reset editing state
        setEditedProduct(null); // Clear edited product state
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Product deleted successfully!");
                fetchProducts(); // Refresh the product list
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Failed to delete product.");
            }
        } catch (err) {
            console.error("Failed to delete product:", err);
            toast.error("An error occurred while deleting the product.");
        }
    };

    return (
        <div className="overflow-y-auto border rounded-lg shadow-sm bg-white p-2">
            <div className="max-h-[400px]">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-100 text-sm text-left">
                        <tr>
                            <th className="p-2 border">Item</th>
                            <th className="p-2 border">Category</th>
                            <th className="p-2 border">Product Name</th>
                            <th className="p-2 border">Stock</th>
                            <th className="p-2 border">Unit</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-gray-500">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {
                                const isEditing = editingProductId === product._id;

                                return (
                                    <tr key={product._id} className="text-sm border-t">
                                        <td className="p-2 border">
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt=""
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 text-gray-500 flex items-center justify-center rounded text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            {isEditing ? (
                                                <select
                                                    value={editedProduct?.category || ""}
                                                    onChange={(e) => handleEditChange(e, "category")}
                                                    className="border p-1 text-sm w-full"
                                                >
                                                    <option value="">Select Category</option>
                                                    <option value="Backlight Storage Box">
                                                        Backlight Storage Box
                                                    </option>
                                                    <option value="Plastic">Plastic</option>
                                                    <option value="Plastic Molding">Plastic Molding</option>
                                                    <option value="Brass">Brass</option>
                                                    <option value="Backlight">Backlight</option>
                                                </select>
                                            ) : (
                                                product.category
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            {isEditing ? (
                                                <input
                                                    value={editedProduct?.productName || ""}
                                                    onChange={(e) => handleEditChange(e, "productName")}
                                                    className="border p-1 text-sm w-full"
                                                />
                                            ) : (
                                                product.productName
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            {isEditing ? (
                                                <input
                                                    value={editedProduct?.availableStock || ""}
                                                    onChange={(e) => handleEditChange(e, "availableStock")}
                                                    className="border p-1 text-sm w-full"
                                                />
                                            ) : (
                                                product.availableStock
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            {isEditing ? (
                                                <select
                                                    value={editedProduct?.stockUnit || ""}
                                                    onChange={(e) => handleEditChange(e, "stockUnit")}
                                                    className="border p-1 text-sm w-full"
                                                >
                                                    <option value="">Select Unit</option>
                                                    <option value="kg">kg</option>
                                                    <option value="bags">bags</option>
                                                    <option value="quantity">quantity</option>
                                                    <option value="dozen">dozen</option>
                                                    <option value="gurace">gurace</option>
                                                </select>
                                            ) : (
                                                product.stockUnit
                                            )}
                                        </td>
                                        <td className="p-2 border">
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={saveEdit}>
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => deleteProduct(product._id)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;