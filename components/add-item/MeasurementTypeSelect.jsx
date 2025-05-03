import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MeasurementTypeSelect = ({ selectedType, measurementType, setMeasurementType, setQuantity }) => {
    if (selectedType !== "Backolight") return null;

    return (
        <div className="space-y-2">
            <Label htmlFor="measurementType">Measurement Type</Label>
            <Select
                value={measurementType}
                onValueChange={(value) => {
                    setMeasurementType(value);
                    setQuantity("");
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select measurement type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="quantity">Pieces</SelectItem>
                    <SelectItem value="dozen">Dozen</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export default MeasurementTypeSelect;