import { X } from 'lucide-react'
import React from 'react'

const CartItems = ({ cartItems, setCartItems , onRemove }) => {

  
    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="flex justify-between px-4 py-2 bg-gray-100 font-semibold">
                <span>#</span>
                <span>Category</span>
                <span>Item</span>
                <span>Qty</span>
                <span>X</span>
            </div>
            {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                    <div
                        key={item._id}
                        className="flex justify-between px-4 py-2 border-b items-center"
                    >
                        <span>{index + 1}</span>
                        <span>{item.category}</span>
                        <span>{item.productName}</span>
                        <span>{item.qty} {item.stockUnit}</span>
                        <button
                            onClick={() => onRemove(item._id)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))
            ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                    No items added
                </div>
            )}
        </div>
    )
}

export default CartItems