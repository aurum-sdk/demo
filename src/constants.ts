import { WalletId } from "@aurum-sdk/types";
import type { RadiusSize, FontOption, WalletOption, ConnectUxMode, WalletLayout } from "./types";

export const FONT_OPTIONS: FontOption[] = [
  { value: undefined, label: "Inter (Default)" },
  { value: "Monospace", label: "Monospace" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Times New Roman", label: "Times New Roman" },
];

export const ALL_WALLETS: WalletOption[] = [
  { id: WalletId.Email, name: "Email" },
  { id: WalletId.MetaMask, name: "MetaMask" },
  { id: WalletId.Phantom, name: "Phantom" },
  { id: WalletId.WalletConnect, name: "WalletConnect" },
  { id: WalletId.Rabby, name: "Rabby" },
  { id: WalletId.CoinbaseWallet, name: "Coinbase Wallet" },
  { id: WalletId.Brave, name: "Brave" },
];

export const DEFAULTS = {
  isDark: true,
  radius: "md" as RadiusSize,
  fontIndex: 0,
  primaryColorDark: "#ffffff",
  primaryColorLight: "#000000",
  logo: "",
  hideFooter: false,
  excludeWallets: [] as WalletId[],
  connectUxMode: "widget" as ConnectUxMode,
  walletLayout: "stacked" as WalletLayout,
};

export const RADIUS_VALUES: RadiusSize[] = ["none", "sm", "md", "lg", "xl"];

export const RADIUS_MAP: Record<RadiusSize, string> = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
};

export const STORAGE_KEY = "aurum-demo-brand-config";

