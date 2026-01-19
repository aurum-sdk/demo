import { AurumLogo } from "@aurum-sdk/logos/react";
import { RotateCcw, ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { useSidebar } from "@/context/SidebarContext";

export function SidebarHeader() {
  const { isResetting, handleReset } = useApp();
  const { toggle } = useSidebar();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <AurumLogo variant="black" size={48} />
        <div>
          <h1 className="font-semibold tracking-tight">Aurum Demo</h1>
          <p className="text-xs text-muted-foreground">
            Brand and Wallet Config
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-8 w-8 rounded-lg hover:bg-accent cursor-pointer"
          title="Reset to defaults"
        >
          <RotateCcw
            className={`h-4 w-4 ${isResetting ? "animate-spin-once" : ""}`}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 rounded-lg hover:bg-accent cursor-pointer"
          title="Close sidebar"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
