import { Wallet } from "lucide-react";
import { SidebarSection } from "@/components/sidebar";
import { EnabledWallets } from "./EnabledWallets";
import { WalletLayout } from "./WalletLayout";

export function WalletsConfig() {
  return (
    <SidebarSection title="Wallets" icon={<Wallet className="h-3.5 w-3.5" />}>
      <WalletLayout />
      <EnabledWallets />
    </SidebarSection>
  );
}
