import { WalletId } from "@aurum-sdk/types";
import type { BrandConfig, ConnectUxMode, RadiusSize, WalletLayout } from "../types";
import { ALL_WALLETS, FONT_OPTIONS, RADIUS_VALUES, STORAGE_KEY } from "../constants";

const CONNECT_UX_MODES: ConnectUxMode[] = ["widget", "modal", "headless"];
const WALLET_LAYOUTS: WalletLayout[] = ["stacked", "grid"];

// Encode excluded wallets as a bitmask (7 wallets = 7 bits, fits in 2 hex chars)
export function encodeExcludedWallets(excluded: WalletId[]): string {
  let bitmask = 0;
  ALL_WALLETS.forEach((wallet, index) => {
    if (excluded.includes(wallet.id)) {
      bitmask |= 1 << index;
    }
  });
  return bitmask.toString(16).padStart(2, "0");
}

export function decodeExcludedWallets(hex: string): WalletId[] {
  const bitmask = parseInt(hex, 16);
  if (isNaN(bitmask)) return [];
  return ALL_WALLETS.filter((_, index) => bitmask & (1 << index)).map(
    (w) => w.id
  );
}

export function encodeConfig(config: BrandConfig): string {
  const isDarkChar = config.isDark ? "1" : "0";
  const radiusChar = RADIUS_VALUES.indexOf(config.radius).toString();
  const fontChar = config.fontIndex.toString();
  const hideFooterChar = config.hideFooter ? "1" : "0";
  const uxModeChar = CONNECT_UX_MODES.indexOf(config.connectUxMode).toString();
  const walletLayoutChar = WALLET_LAYOUTS.indexOf(config.walletLayout).toString();
  const colorHex = config.primaryColor.replace("#", "");
  const walletsHex = encodeExcludedWallets(config.excludeWallets);

  let encoded = `${isDarkChar}${radiusChar}${fontChar}${hideFooterChar}${uxModeChar}${walletLayoutChar}${colorHex}${walletsHex}`;

  if (config.logo) {
    const logoEncoded = btoa(config.logo)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    encoded += `-${logoEncoded}`;
  }

  return encoded;
}

export function decodeConfig(encoded: string): Partial<BrandConfig> | null {
  try {
    const [main, logoEncoded] = encoded.split("-");
    // Expecting 14 chars minimum: 1 (dark) + 1 (radius) + 1 (font) + 1 (footer) + 1 (uxMode) + 1 (walletLayout) + 6 (color) + 2 (wallets)
    // Also handle legacy 13-char configs without walletLayout
    if (main.length < 11) return null;

    const isDark = main[0] === "1";
    const radiusIndex = parseInt(main[1], 10);
    const fontIndex = parseInt(main[2], 10);
    const hideFooter = main[3] === "1";
    const uxModeIndex = parseInt(main[4], 10);
    
    // Handle legacy configs (13 chars) vs new configs (14 chars)
    const isLegacyFormat = main.length === 13;
    const walletLayoutIndex = isLegacyFormat ? 0 : parseInt(main[5], 10);
    const colorHex = isLegacyFormat ? main.slice(5, 11) : main.slice(6, 12);
    const walletsHex = isLegacyFormat ? (main.slice(11, 13) || "00") : (main.slice(12, 14) || "00");

    if (radiusIndex < 0 || radiusIndex > 4) return null;
    if (fontIndex < 0 || fontIndex >= FONT_OPTIONS.length) return null;
    if (!/^[0-9a-fA-F]{6}$/.test(colorHex)) return null;
    
    // Handle legacy configs where uxModeIndex was boolean (0 or 1)
    // and new configs with 0=widget, 1=modal, 2=headless
    const connectUxMode: ConnectUxMode = CONNECT_UX_MODES[uxModeIndex] ?? "widget";
    const walletLayout: WalletLayout = WALLET_LAYOUTS[walletLayoutIndex] ?? "stacked";

    const config: Partial<BrandConfig> = {
      isDark,
      radius: RADIUS_VALUES[radiusIndex] as RadiusSize,
      fontIndex,
      hideFooter,
      connectUxMode,
      walletLayout,
      primaryColor: `#${colorHex}`,
      excludeWallets: decodeExcludedWallets(walletsHex),
    };

    if (logoEncoded) {
      const base64 = logoEncoded.replace(/-/g, "+").replace(/_/g, "/");
      config.logo = atob(base64);
    }

    return config;
  } catch {
    return null;
  }
}

export function getInitialConfig(): Partial<BrandConfig> {
  // URL params take priority (for sharing)
  const params = new URLSearchParams(window.location.search);
  const configParam = params.get("config");
  if (configParam) {
    const decoded = decodeConfig(configParam);
    if (decoded) return decoded;
  }
  // Fall back to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

