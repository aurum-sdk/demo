import { useApp } from "@/context/AppContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Rows3, LayoutGrid } from "lucide-react";
import type { WalletLayout as WalletLayoutType } from "@/types";

export function WalletLayout() {
  const { walletLayout, setWalletLayout } = useApp();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Layout</label>
      <ToggleGroup
        type="single"
        value={walletLayout}
        onValueChange={(value) => {
          if (value) setWalletLayout(value as WalletLayoutType);
        }}
        className="w-full"
      >
        <ToggleGroupItem
          value="stacked"
          className="flex-1 gap-2 cursor-pointer"
          aria-label="Stacked Layout"
        >
          <Rows3 className="h-4 w-4" />
          Stacked
        </ToggleGroupItem>
        <ToggleGroupItem
          value="grid"
          className="flex-1 gap-2 cursor-pointer"
          aria-label="Grid Layout"
        >
          <LayoutGrid className="h-4 w-4" />
          Grid
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

