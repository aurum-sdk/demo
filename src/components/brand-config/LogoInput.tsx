import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";

export function LogoInput() {
  const { logo, setLogo } = useApp();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Logo URL</label>
      <Input
        type="text"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
        placeholder="https://... or data:image/..."
        className="text-sm"
      />
    </div>
  );
}
