import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";

export function AurumBranding() {
  const { hideFooter, setHideFooter } = useApp();

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Aurum Branding
      </label>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Switch
          checked={hideFooter}
          onCheckedChange={setHideFooter}
          className="cursor-pointer"
        />
        <span className="text-sm text-muted-foreground">
          {hideFooter ? "Hidden" : "Visible"}
        </span>
      </div>
    </div>
  );
}
