"use client"
import React, { useEffect, useState } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
const Transaction = () => {
    const { data: session, status } = useSession(); // get session
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // wait till session loads
        if (session?.user?.role === "user") {
            router.push("/dashboard"); // redirect to home or any page
        }
    }, [session, status, router]);

    const [products, setProducts] = useState([]);
    const [sales, setSales] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [selectedSale, setSelectedSale] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
            setFilteredProducts(data); // Initially show all
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const fetchSales = async () => {
        try {
            const res = await fetch("/api/sales");
            const data = await res.json();
            setSales(data);
        } catch (err) {
            console.error("Failed to fetch sales:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, []);

    const getSoldCount = (productName) => {
        let count = 0;
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                if (item.productName === productName) {
                    count += item.qty;
                }
            });
        });
        return count;
    };

    const exportCSV = () => {
        const headers = ["Invoice", "Time", "Total Items"];
        const rows = sales.map((sale) => {
            const invoiceNumber = new Date(sale.saleDate)
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            const time = new Date(sale.saleDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            return [invoiceNumber, time, sale.items.length];
        });

        let csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
    };

    // PDF Export
    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Transaction Details", 14, 20);

        // Table Headers
        doc.setFontSize(12);
        doc.text("Invoice", 14, 40);
        doc.text("Time", 64, 40);
        doc.text("Total Items", 114, 40);

        let y = 50; // starting y position

        sales.forEach((sale) => {
            const invoiceNumber = new Date(sale.saleDate)
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            const time = new Date(sale.saleDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            const totalItems = sale.items.length.toString();

            doc.text(invoiceNumber, 14, y);
            doc.text(time, 64, y);
            doc.text(totalItems, 114, y);

            y += 10; // move to next row
        });

        doc.save("transactions.pdf");
    };

    if (status === "loading" || session?.user?.role === "user") {
        return <div>Loading...</div>; // Or skeleton
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 p-4">
            {/* Header */}
            <h1 className="text-3xl font-semibold mb-4">Transactions</h1>

            {/* Filters */}
            {/* <div className="flex flex-wrap gap-4 mb-6">
                <select className="border p-2 rounded">
                    <option>All Tills</option>
                </select>
                <select className="border p-2 rounded">
                    <option>All Cashiers</option>
                </select>
                <select className="border p-2 rounded">
                    <option>Paid</option>
                    <option>Unpaid</option>
                </select>
                <input type="date" className="border p-2 rounded" />
            </div> */}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Products</h2>
                    <table className="w-full text-left border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Product Name</th>
                                <th className="p-2">Sold</th>
                                <th className="p-2">Available</th>
                            </tr>
                        </thead>
                        <tbody>

                            {products.map((product, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-2">{product.productName}</td>
                                    <td className="p-2">{getSoldCount(product.productName)}</td>
                                    <td className="p-2">{product.availableStock} {product.stockUnit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Transaction Details */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
                    <div className="flex gap-2 mb-4">
                        <button className="bg-gray-200 px-3 py-1 rounded" onClick={exportCSV}>CSV</button>
                        <button className="bg-gray-200 px-3 py-1 rounded" onClick={exportPDF}>PDF</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search"
                        className="border p-2 rounded w-full mb-4"
                    />
                    <table className="w-full text-left border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">Invoice</th>
                                <th className="p-2">Time</th>
                                <th className="p-2">Total Items</th>
                                <th className="p-2">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...sales]
                                .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()) // Sort latest first
                                .map((sale) => {
                                    // Generate Invoice number as YYYYMMDD
                                    const invoiceNumber = new Date(sale.saleDate)
                                        .toISOString()
                                        .slice(0, 10)
                                        .replace(/-/g, "");

                                    return (
                                        <tr key={sale._id} className="border-t">
                                            <td className="p-2">{invoiceNumber}</td>
                                            <td className="p-2">
                                                {new Date(sale.saleDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </td>
                                            <td className="p-2">{sale.items.length}</td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => setSelectedSale(sale)}
                                                    className="bg-cyan-400 text-white px-2 py-1 rounded"
                                                >
                                                    🔍
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                        </tbody>
                    </table>


                    {selectedSale && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-4 rounded w-96">
                                <h2 className="text-lg font-bold mb-2">Receipt</h2>
                                <table className="w-full text-left border">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="p-2">Item</th>
                                            <th className="p-2">Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedSale.items.map((item, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2">{item.productName}</td>
                                                <td className="p-2">{item.qty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <button
                                    onClick={() => setSelectedSale(null)}
                                    className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-4">
                        <button className="border px-3 py-1 rounded">Previous</button>
                        <span>1</span>
                        <button className="border px-3 py-1 rounded">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transaction;


