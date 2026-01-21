import { WalletId } from "@aurum-sdk/types";
import { RADIUS_MAP } from "@/constants";

export type HeadlessUIProps = {
  radius: keyof typeof RADIUS_MAP;
  primaryColor: string;
  isDark: boolean;
  logo: string | null;
  onWalletConnect: (walletId: WalletId) => Promise<void>;
  onEmailAuthStart: (email: string) => Promise<string>;
  onEmailAuthVerify: (flowId: string, otp: string) => Promise<void>;
};

export const ALL_HEADLESS_WALLETS = [
  { id: WalletId.MetaMask, name: "MetaMask" },
  { id: WalletId.Phantom, name: "Phantom" },
  { id: WalletId.Rabby, name: "Rabby" },
  { id: WalletId.CoinbaseWallet, name: "Coinbase" },
  { id: WalletId.WalletConnect, name: "WalletConnect" },
  { id: WalletId.Ledger, name: "Ledger" },
  { id: WalletId.Brave, name: "Brave" },
] as const;

export function isBraveBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  return (navigator as unknown as { brave?: unknown }).brave !== undefined;
}
