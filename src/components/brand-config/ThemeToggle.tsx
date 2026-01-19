import { Sun, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppContext";
import { DEFAULTS } from "@/constants";

export function ThemeToggle() {
  const { isDark, setIsDark, primaryColor, setPrimaryColor } = useApp();

  const handleThemeChange = (newIsDark: boolean) => {
    // If primary color is at the default for current theme, switch to new theme's default
    const currentDefault = isDark
      ? DEFAULTS.primaryColorDark
      : DEFAULTS.primaryColorLight;
    if (primaryColor.toLowerCase() === currentDefault.toLowerCase()) {
      setPrimaryColor(
        newIsDark ? DEFAULTS.primaryColorDark : DEFAULTS.primaryColorLight
      );
    }
    setIsDark(newIsDark);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Theme</label>
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <Sun className="h-4 w-4" />
        <Switch
          checked={isDark}
          onCheckedChange={handleThemeChange}
          className="cursor-pointer"
        />
        <Moon className="h-4 w-4" />
        <span className="ml-auto text-sm text-muted-foreground">
          {isDark ? "Dark" : "Light"}
        </span>
      </div>
    </div>
  );
}
