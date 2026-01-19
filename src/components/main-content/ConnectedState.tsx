import { WalletLogo } from "@aurum-sdk/logos/react";
import { WalletId } from "@aurum-sdk/types";
import { Loader2, Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { RADIUS_MAP } from "@/constants";

export type ConnectedStateProps = {
  userInfo: NonNullable<ReturnType<typeof useApp>["userInfo"]>;
  radius: keyof typeof RADIUS_MAP;
  primaryColor: string;
  isDark: boolean;
  isSigning: boolean;
  onSign: () => void;
  onDisconnect: () => void;
};

export function ConnectedState({
  userInfo,
  radius,
  primaryColor,
  isDark,
  isSigning,
  onSign,
  onDisconnect,
}: ConnectedStateProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <div className="shrink-0">
          {userInfo?.walletId && (
            <WalletLogo
              id={userInfo.walletId as WalletId}
              variant="brand"
              sizeSlot="md"
              size={48}
              radius={radius}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate">
            Connected to {userInfo?.walletName ?? "Wallet"}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground font-mono">
            {userInfo?.publicAddress &&
              `${userInfo.publicAddress.slice(
                0,
                6
              )}...${userInfo.publicAddress.slice(-4)}`}
          </p>
        </div>
      </div>

      {/* getUserInfo Response */}
      <div
        className="p-3 bg-muted/50"
        style={{ borderRadius: RADIUS_MAP[radius] }}
      >
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          User Info
        </p>
        <pre className="overflow-x-auto">
          <code className="text-xs font-mono">
            {JSON.stringify(
              userInfo,
              (_, v) => (v === undefined ? "__undefined__" : v),
              2
            ).replace(/"__undefined__"/g, "undefined")}
          </code>
        </pre>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={onSign}
          disabled={isSigning}
          className="w-full cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            color: isDark ? "#000" : "#fff",
            borderRadius: RADIUS_MAP[radius],
          }}
        >
          {isSigning ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wallet className="h-4 w-4 mr-2" />
          )}
          {isSigning ? "Signing..." : "Sign Message"}
        </Button>
        <Button
          variant="outline"
          onClick={onDisconnect}
          className="w-full cursor-pointer"
          style={{ borderRadius: RADIUS_MAP[radius] }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </div>
  );
}
