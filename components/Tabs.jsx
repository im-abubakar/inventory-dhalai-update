import { useState } from "react";

const Tabs = () => {
    const [selectedTab, setSelectedTab] = useState("All");

    const categories = [
        "Plastic",
        "Plastic Molding",
        "Backolight Storage Box",
        "Backlight",
        "Brass",
        "Pital",
    ];

    return (
        <div className="flex gap-2 mb-4 flex-wrap">
            <button
                onClick={() => setSelectedTab("All")}
                className={`px-4 py-2 rounded ${selectedTab === "All" ? "bg-blue-500 text-white" : "bg-gray-200"
                    } hover:bg-blue-600`}
            >
                All
            </button>

            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setSelectedTab(cat)}
                    className={`px-4 py-2 rounded ${selectedTab === cat ? "bg-blue-500 text-white" : "bg-gray-200"
                        } hover:bg-gray-300`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
