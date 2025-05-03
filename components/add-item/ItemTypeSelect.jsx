import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ItemTypeSelect = ({
    selectedType,
    setSelectedType,
    setSelectedCategory,
    setQuantity,
    setMeasurementType,
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor="type">Item Type</Label>
            <Select
                value={selectedType}
                onValueChange={(value) => {
                    setSelectedType(value);
                    setSelectedCategory("");
                    setQuantity("");
                    setMeasurementType("quantity");
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Plastic">Plastic</SelectItem>
                    <SelectItem value="Pital">Pital</SelectItem>
                    <SelectItem value="Backlight Storage Box">Backlight Storage Box</SelectItem>
                    <SelectItem value="Plastic Molding">Plastic Molding</SelectItem>
                    <SelectItem value="Brass">Brass</SelectItem>
                    <SelectItem value="Backolight">Backolight</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}


export default ItemTypeSelect;