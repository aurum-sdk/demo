import { useState, useMemo } from "react";
import { WalletLogo } from "@aurum-sdk/logos/react";
import { WalletId } from "@aurum-sdk/types";
import { Loader2 } from "lucide-react";
import { RADIUS_MAP } from "@/constants";
import { ALL_HEADLESS_WALLETS, isBraveBrowser } from "./types";

type WalletGridProps = {
  radius: keyof typeof RADIUS_MAP;
  onWalletConnect: (walletId: WalletId) => Promise<void>;
};

export function WalletGrid({ radius, onWalletConnect }: WalletGridProps) {
  const [connectingWallet, setConnectingWallet] = useState<WalletId | null>(
    null
  );

  const headlessWallets = useMemo(() => {
    const isBrave = isBraveBrowser();
    return ALL_HEADLESS_WALLETS.filter(
      (wallet) => wallet.id !== WalletId.Brave || isBrave
    );
  }, []);

  // Calculate optimal columns for balanced rows
  const walletGridCols = useMemo(() => {
    const count = headlessWallets.length;
    if (count <= 4) return count;

    // Find column count where rows are most balanced (differ by at most 1)
    for (let cols = Math.ceil(count / 2); cols <= count; cols++) {
      const remainder = count % cols;
      if (remainder === 0 || remainder >= cols - 1) {
        return cols;
      }
    }
    return Math.ceil(count / 2);
  }, [headlessWallets.length]);

  const handleWalletClick = async (walletId: WalletId) => {
    setConnectingWallet(walletId);
    try {
      await onWalletConnect(walletId);
    } finally {
      setConnectingWallet(null);
    }
  };

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${walletGridCols}, minmax(0, 1fr))`,
      }}
    >
      {headlessWallets.map((wallet) => (
        <button
          key={wallet.id}
          onClick={() => handleWalletClick(wallet.id)}
          disabled={connectingWallet !== null}
          className="flex flex-col items-center gap-1.5 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderRadius: RADIUS_MAP[radius] }}
        >
          {connectingWallet === wallet.id ? (
            <div className="h-[42px] w-[42px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <WalletLogo id={wallet.id} variant="icon" size={42} />
          )}
        </button>
      ))}
    </div>
  );
}
