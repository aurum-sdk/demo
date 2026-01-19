import { Layers, Paintbrush } from "lucide-react";
import { SidebarSection } from "@/components/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { BorderRadius } from "./BorderRadius";
import { BrandColor } from "./BrandColor";
import { LogoInput } from "./LogoInput";
import { Font } from "./Font";
import { AurumBranding } from "./AurumBranding";
import { ConnectUX } from "./ConnectUX";

export function BrandConfig() {
  return (
    <>
      <SidebarSection
        title="Connect UX"
        icon={<Layers className="h-3.5 w-3.5" />}
      >
        <ConnectUX />
      </SidebarSection>

      <SidebarSection
        title="Branding"
        icon={<Paintbrush className="h-3.5 w-3.5" />}
      >
        <ThemeToggle />
        <BorderRadius />
        <BrandColor />
        <LogoInput />
        <Font />
        <AurumBranding />
      </SidebarSection>
    </>
  );
}
