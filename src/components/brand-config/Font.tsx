import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { FONT_OPTIONS } from "@/constants";

export function Font() {
  const { fontIndex, setFontIndex } = useApp();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Font</label>
      <Select
        value={fontIndex.toString()}
        onValueChange={(v) => setFontIndex(Number(v))}
      >
        <SelectTrigger className="w-full cursor-pointer bg-background shadow-xs dark:bg-input/30 dark:border-input">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_OPTIONS.map((option, index) => (
            <SelectItem
              key={index}
              value={index.toString()}
              className="cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
