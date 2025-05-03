import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const QuantityInput = ({ selectedType, quantity, setQuantity, measurementType }) => {
    if (!selectedType) return null;

    let label = "Quantity";
    let placeholder = "Enter quantity";
    let unit = "";

    switch (selectedType) {
        case "Plastic":
            label = "Number of Bags";
            placeholder = "Enter number of bags";
            unit = "bags";
            break;

        case "Plastic Molding":
            label = "Quantity (in dozen)";
            placeholder = "Enter quantity in dozen";
            unit = "dozen";
            break;

        case "Brass":
            label = "Garice";
            placeholder = "Enter quantity in garice";
            unit = "garice";
            break;

        case "Pital":
            label = "Weight";
            placeholder = "Enter weight in kg";
            unit = "kg";
            break;

        case "Backolight":
            if (measurementType === "dozen") {
                label = "Quantity (in dozen)";
                placeholder = "Enter quantity in dozen";
                unit = "dozen";
            } else {
                label = "Quantity (in pieces)";
                placeholder = "Enter quantity in pieces";
                unit = "pcs";
            }
            break;

        case "Backlight Storage Box":
            label = "Quantity (in dozen)";
            placeholder = "Enter quantity in dozen";
            unit = "dozen";
            break;
    }

    return (
        <div className="space-y-2">
            <Label htmlFor="quantity">{label}</Label>
            <div className="flex gap-2">
                <Input
                    id="quantity"
                    type="number"
                    placeholder={placeholder}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <span className="flex items-center text-sm text-gray-500">{unit}</span>
            </div>
        </div>
    );
};

export default QuantityInput;
