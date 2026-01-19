import { WalletId } from "@aurum-sdk/types";

export type RadiusSize = "none" | "sm" | "md" | "lg" | "xl";

export type ConnectUxMode = "widget" | "modal" | "headless";

export type WalletLayout = "stacked" | "grid";

export type BrandConfig = {
  isDark: boolean;
  radius: RadiusSize;
  fontIndex: number;
  primaryColor: string;
  logo: string;
  hideFooter: boolean;
  excludeWallets: WalletId[];
  connectUxMode: ConnectUxMode;
  walletLayout: WalletLayout;
};

export type FontOption = {
  value: string | undefined;
  label: string;
};

export type WalletOption = {
  id: WalletId;
  name: string;
};

