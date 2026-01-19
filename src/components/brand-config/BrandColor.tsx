import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

const COLOR_PRESETS = [
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
];

export function BrandColor() {
  const { primaryColor, setPrimaryColor, isDark } = useApp();

  const defaultColor = isDark ? "#ffffff" : "#000000";
  const allColors = [defaultColor, ...COLOR_PRESETS];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        Color
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded-lg border-2 border-border bg-transparent p-1 shrink-0"
        />
        <Input
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
          className="font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {allColors.map((color) => (
          <button
            key={color}
            onClick={() => setPrimaryColor(color)}
            className={`h-7 w-7 rounded-md cursor-pointer border-2 transition-transform hover:scale-110 ${
              primaryColor.toLowerCase() === color.toLowerCase()
                ? "border-foreground ring-2 ring-foreground/20"
                : "border-border"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}

