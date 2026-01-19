import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useApp } from "@/context/AppContext";
import type { RadiusSize } from "@/types";

const RADIUS_OPTIONS = ["none", "sm", "md", "lg", "xl"] as const;

const RADIUS_DISPLAY_MAP = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
};

export function BorderRadius() {
  const { radius, setRadius } = useApp();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Border Radius</label>
      <ToggleGroup
        type="single"
        value={radius}
        onValueChange={(v) => v && setRadius(v as RadiusSize)}
        className="justify-center w-full"
        spacing={1}
      >
        {RADIUS_OPTIONS.map((r) => (
          <ToggleGroupItem
            key={r}
            value={r}
            className="flex-1 cursor-pointer text-xs sm:text-sm"
            style={{ borderRadius: RADIUS_DISPLAY_MAP[r] }}
          >
            {r}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
