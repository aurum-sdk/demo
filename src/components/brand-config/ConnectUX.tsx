import { useApp } from "@/context/AppContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AppWindow, Layers, Code, HelpCircle } from "lucide-react";
import type { ConnectUxMode } from "@/types";

export function ConnectUX() {
  const { connectUxMode, setConnectUxMode } = useApp();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-medium">Mode</label>
        <div className="group relative">
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60 cursor-help" />
          <div className="absolute left-0 top-full mt-1.5 w-56 p-2.5 rounded-lg bg-popover border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-xs text-muted-foreground z-50">
            <p className="font-medium text-foreground mb-1.5">
              Connection Modes
            </p>
            <ul className="space-y-1">
              <li>
                <span className="font-medium">Widget:</span> Embedded widget
              </li>
              <li>
                <span className="font-medium">Modal:</span> Popup dialog
              </li>
              <li>
                <span className="font-medium">Headless:</span> Your custom UI
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToggleGroup
        type="single"
        value={connectUxMode}
        onValueChange={(value) => {
          if (value) setConnectUxMode(value as ConnectUxMode);
        }}
      >
        <ToggleGroupItem
          value="widget"
          className="gap-2 cursor-pointer"
          aria-label="Embedded Widgets"
        >
          <Layers className="h-4 w-4" />
          Embedded
        </ToggleGroupItem>
        <ToggleGroupItem
          value="modal"
          className="gap-2 cursor-pointer"
          aria-label="Modal UI"
        >
          <AppWindow className="h-4 w-4" />
          Modal
        </ToggleGroupItem>
        <ToggleGroupItem
          value="headless"
          className="gap-2 cursor-pointer"
          aria-label="Headless API"
        >
          <Code className="h-4 w-4" />
          Headless
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
