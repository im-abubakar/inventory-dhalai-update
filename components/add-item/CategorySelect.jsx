import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CategorySelect = ({
  selectedType,
  selectedCategory,
  setSelectedCategory,
  categories,
}) => {
  if (!selectedType) return null;

  const label = "Category";

  return (
    <div className="space-y-2">
      <Label htmlFor="category">{label}</Label>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {categories.length === 0 ? (
            <SelectItem disabled>No categories available</SelectItem>
          ) : (
            categories.map((cat) => (
              <SelectItem key={cat._id} value={cat.category}>
                {cat.category}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelect;
