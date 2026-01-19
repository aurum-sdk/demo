import { ChevronDown, RotateCcw } from "lucide-react";
import { WalletLogo } from "@aurum-sdk/logos/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useApp } from "@/context/AppContext";
import { ALL_WALLETS } from "@/constants";

export function EnabledWallets() {
  const {
    excludeWallets,
    setExcludeWallets,
    toggleWallet,
    isWalletsOpen,
    setIsWalletsOpen,
  } = useApp();

  const enabledWalletsCount = ALL_WALLETS.length - excludeWallets.length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Enabled</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExcludeWallets([])}
          className={`p-0 cursor-pointer text-sm text-muted-foreground transition-opacity ${
            excludeWallets.length > 0
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          title="Enable all wallets"
        >
          <RotateCcw className="h-2 w-2" />
          Reset
        </Button>
      </div>
      <Collapsible open={isWalletsOpen} onOpenChange={setIsWalletsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between cursor-pointer"
          >
            <span className="text-sm">
              {enabledWalletsCount === ALL_WALLETS.length
                ? "All wallets enabled"
                : `${enabledWalletsCount} of ${ALL_WALLETS.length} wallets enabled`}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isWalletsOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
            {ALL_WALLETS.map((wallet) => {
              const isEnabled = !excludeWallets.includes(wallet.id);
              return (
                <label
                  key={wallet.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                >
                  <Checkbox
                    checked={isEnabled}
                    onCheckedChange={() => toggleWallet(wallet.id)}
                    className="cursor-pointer"
                  />
                  <WalletLogo
                    id={wallet.id}
                    variant="brand"
                    sizeSlot="sm"
                    size={24}
                    radius="sm"
                  />
                  <span className="text-sm">{wallet.name}</span>
                </label>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
