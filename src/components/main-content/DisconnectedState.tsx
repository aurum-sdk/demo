import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RADIUS_MAP } from "@/constants";

export type DisconnectedStateProps = {
  logo: string;
  radius: keyof typeof RADIUS_MAP;
  primaryColor: string;
  isDark: boolean;
  onConnect: () => void;
};

export function DisconnectedState({
  logo,
  radius,
  primaryColor,
  isDark,
  onConnect,
}: DisconnectedStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {logo ? (
        <img
          src={logo}
          alt="App logo"
          className="h-16 w-16 object-contain"
          style={{ borderRadius: RADIUS_MAP[radius] }}
        />
      ) : (
        <div
          className="h-16 w-16"
          style={{
            borderRadius: RADIUS_MAP[radius],
            background: `linear-gradient(135deg, ${primaryColor}, ${
              isDark ? "#1a1a2e" : "#ffffff"
            })`,
          }}
        />
      )}
      <div className="text-center flex flex-col items-center gap-2">
        <h2 className="text-xl font-semibold">Aurum Demo</h2>
        <p className="text-sm text-muted-foreground">
          Click below to open
          <br /> the wallet connection modal
        </p>
      </div>
      <Button
        onClick={onConnect}
        className="mt-2 cursor-pointer"
        style={{
          backgroundColor: primaryColor,
          color: isDark ? "#000" : "#fff",
          borderRadius: RADIUS_MAP[radius],
        }}
      >
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    </div>
  );
}
