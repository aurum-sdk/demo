import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { toast } from "react-toastify";
import { Aurum } from "@aurum-sdk/core";
import { WalletId, type UserInfo } from "@aurum-sdk/types";
import type {
  RadiusSize,
  BrandConfig,
  ConnectUxMode,
  WalletLayout,
} from "../types";
import { DEFAULTS, FONT_OPTIONS, STORAGE_KEY } from "../constants";
import { getInitialConfig, encodeConfig } from "../utils/config";
import { useDebounce } from "../hooks/useDebounce";
import { CDP_PROJECT_ID, WALLETCONNECT_PROJECT_ID } from "@/env";

// Get initial config from URL or localStorage
const initialConfig = getInitialConfig();

// Create Aurum instance
export const aurum = new Aurum({
  brand: {
    appName: "Aurum Demo",
    theme: initialConfig.isDark ?? DEFAULTS.isDark ? "dark" : "light",
    primaryColor:
      initialConfig.isDark ?? DEFAULTS.isDark
        ? initialConfig.primaryColor ?? DEFAULTS.primaryColorDark
        : initialConfig.primaryColor ?? DEFAULTS.primaryColorLight,
    borderRadius: initialConfig.radius ?? DEFAULTS.radius,
    font: FONT_OPTIONS[initialConfig.fontIndex ?? DEFAULTS.fontIndex]?.value,
    logo: initialConfig.logo || undefined,
    hideFooter: initialConfig.hideFooter ?? DEFAULTS.hideFooter,
    walletLayout: initialConfig.walletLayout ?? DEFAULTS.walletLayout,
  },
  wallets: {
    embedded: { projectId: CDP_PROJECT_ID },
    walletConnect: { projectId: WALLETCONNECT_PROJECT_ID },
    exclude: initialConfig.excludeWallets ?? DEFAULTS.excludeWallets,
  },
});

type AppContextType = {
  // Brand config state
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  radius: RadiusSize;
  setRadius: (value: RadiusSize) => void;
  fontIndex: number;
  setFontIndex: (value: number) => void;
  primaryColor: string;
  setPrimaryColor: (value: string) => void;
  logo: string;
  setLogo: (value: string) => void;
  hideFooter: boolean;
  setHideFooter: (value: boolean) => void;
  excludeWallets: WalletId[];
  setExcludeWallets: (value: WalletId[]) => void;
  toggleWallet: (walletId: WalletId) => void;
  connectUxMode: ConnectUxMode;
  setConnectUxMode: (value: ConnectUxMode) => void;
  walletLayout: WalletLayout;
  setWalletLayout: (value: WalletLayout) => void;

  // UI state
  isWalletsOpen: boolean;
  setIsWalletsOpen: (value: boolean) => void;
  isResetting: boolean;

  // Wallet state
  isLoading: boolean;
  userInfo: UserInfo | undefined;
  isSigning: boolean;

  // Actions
  handleReset: () => void;
  handleShare: () => void;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
  handleSign: () => Promise<void>;
  handleWidgetConnect: (result: UserInfo) => Promise<void>;
  handleHeadlessConnect: (walletId: WalletId) => Promise<void>;
  handleEmailAuthStart: (email: string) => Promise<string>;
  handleEmailAuthVerify: (flowId: string, otp: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Brand config state
  const [isDark, setIsDarkState] = useState(
    initialConfig.isDark ?? DEFAULTS.isDark
  );
  const [radius, setRadiusState] = useState<RadiusSize>(
    initialConfig.radius ?? DEFAULTS.radius
  );
  const [fontIndex, setFontIndexState] = useState(
    initialConfig.fontIndex ?? DEFAULTS.fontIndex
  );
  const [primaryColor, setPrimaryColorState] = useState(
    initialConfig.primaryColor ??
      (DEFAULTS.isDark ? DEFAULTS.primaryColorDark : DEFAULTS.primaryColorLight)
  );
  const [logo, setLogoState] = useState(initialConfig.logo ?? DEFAULTS.logo);
  const [hideFooter, setHideFooterState] = useState(
    initialConfig.hideFooter ?? DEFAULTS.hideFooter
  );
  const [excludeWallets, setExcludeWallets] = useState<WalletId[]>(
    initialConfig.excludeWallets ?? DEFAULTS.excludeWallets
  );
  const [connectUxMode, setConnectUxMode] = useState<ConnectUxMode>(
    initialConfig.connectUxMode ?? DEFAULTS.connectUxMode
  );
  const [walletLayout, setWalletLayoutState] = useState<WalletLayout>(
    initialConfig.walletLayout ?? DEFAULTS.walletLayout
  );

  // Wrapped setters that update aurum config synchronously
  const setIsDark = useCallback((value: boolean) => {
    setIsDarkState(value);
    aurum.updateBrandConfig({ theme: value ? "dark" : "light" });
  }, []);

  const setRadius = useCallback((value: RadiusSize) => {
    setRadiusState(value);
    aurum.updateBrandConfig({ borderRadius: value });
  }, []);

  const setFontIndex = useCallback((value: number) => {
    setFontIndexState(value);
    aurum.updateBrandConfig({ font: FONT_OPTIONS[value]?.value });
  }, []);

  const setPrimaryColor = useCallback((value: string) => {
    setPrimaryColorState(value);
    aurum.updateBrandConfig({ primaryColor: value });
  }, []);

  const setLogo = useCallback((value: string) => {
    setLogoState(value);
    aurum.updateBrandConfig({ logo: value || undefined });
  }, []);

  const setHideFooter = useCallback((value: boolean) => {
    setHideFooterState(value);
    aurum.updateBrandConfig({ hideFooter: value });
  }, []);

  const setWalletLayout = useCallback((value: WalletLayout) => {
    setWalletLayoutState(value);
    aurum.updateBrandConfig({ walletLayout: value });
  }, []);

  const setExcludeWalletsWithSync = useCallback((value: WalletId[]) => {
    setExcludeWallets(value);
    aurum.updateWalletsConfig({ exclude: value });
  }, []);

  // UI state
  const [isWalletsOpen, setIsWalletsOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Wallet state
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
  const [isSigning, setIsSigning] = useState(false);

  // Track if user was previously connected (for accountsChanged event)
  const wasConnectedRef = useRef(false);

  // Debounced primary color for updateBrandConfig
  const debouncedPrimaryColor = useDebounce(primaryColor, 200);

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await aurum.isConnected();

      if (connected) {
        const info = await aurum.getUserInfo();
        setUserInfo(info);
      }
      setIsLoading(false);
    };
    checkConnection();
  }, []);

  // Persist config to localStorage
  useEffect(() => {
    const config: BrandConfig = {
      isDark,
      radius,
      fontIndex,
      primaryColor: debouncedPrimaryColor,
      logo,
      hideFooter,
      excludeWallets,
      connectUxMode,
      walletLayout,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [
    isDark,
    radius,
    fontIndex,
    debouncedPrimaryColor,
    logo,
    hideFooter,
    excludeWallets,
    connectUxMode,
    walletLayout,
  ]);

  // Update document dark class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Keep wasConnectedRef in sync with userInfo
  useEffect(() => {
    wasConnectedRef.current = !!userInfo;
  }, [userInfo]);

  // EIP1193 event listeners
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      const wasAlreadyConnected = wasConnectedRef.current;

      if (accounts.length === 0) {
        // User disconnected
        toast("User disconnected");
        setUserInfo(undefined);
      } else if (wasAlreadyConnected) {
        // User was already connected and changed accounts
        toast(`Accounts changed: ${accounts.join(", ")}`);
        const info = await aurum.getUserInfo();
        setUserInfo(info);
      }
      // If not already connected and accounts > 0, this is a new connection
      // which will be handled by the connect handlers (handleConnect, handleWidgetConnect, etc.)
    };

    aurum.rpcProvider?.on?.("accountsChanged", handleAccountsChanged);

    return () => {
      aurum.rpcProvider?.removeListener?.(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

  const handleReset = useCallback(() => {
    setIsResetting(true);
    setIsDark(DEFAULTS.isDark);
    setRadius(DEFAULTS.radius);
    setFontIndex(DEFAULTS.fontIndex);
    const resetColor = DEFAULTS.isDark
      ? DEFAULTS.primaryColorDark
      : DEFAULTS.primaryColorLight;
    setPrimaryColor(resetColor);
    // Update primary color immediately for reset (bypassing debounce)
    aurum.updateBrandConfig({ primaryColor: resetColor });
    setLogo(DEFAULTS.logo);
    setHideFooter(DEFAULTS.hideFooter);
    setExcludeWalletsWithSync(DEFAULTS.excludeWallets);
    setConnectUxMode(DEFAULTS.connectUxMode);
    setWalletLayout(DEFAULTS.walletLayout);
    localStorage.removeItem(STORAGE_KEY);
    setTimeout(() => setIsResetting(false), 500);
  }, [
    setIsDark,
    setRadius,
    setFontIndex,
    setPrimaryColor,
    setLogo,
    setHideFooter,
    setExcludeWalletsWithSync,
    setWalletLayout,
  ]);

  const handleShare = useCallback(async () => {
    const config = encodeConfig({
      isDark,
      radius,
      fontIndex,
      primaryColor,
      logo,
      hideFooter,
      excludeWallets,
      connectUxMode,
      walletLayout,
    });
    const url = `${window.location.origin}${window.location.pathname}?config=${config}`;

    try {
      await navigator.clipboard.writeText(url);
      toast("Preview URL copied to clipboard");
    } catch {
      // Final fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast("Preview URL copied to clipboard");
    }
  }, [
    isDark,
    radius,
    fontIndex,
    primaryColor,
    logo,
    hideFooter,
    excludeWallets,
    connectUxMode,
    walletLayout,
  ]);

  const toggleWallet = useCallback((walletId: WalletId) => {
    setExcludeWallets((prev) => {
      const newExcludeWallets = prev.includes(walletId)
        ? prev.filter((id) => id !== walletId)
        : [...prev, walletId];
      aurum.updateWalletsConfig({ exclude: newExcludeWallets });
      return newExcludeWallets;
    });
  }, []);

  const handleConnect = useCallback(async () => {
    try {
      await aurum.connect();
      const info = await aurum.getUserInfo();
      setUserInfo(info);
      toast(`User connected with ${info?.walletId}`);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDisconnect = useCallback(async () => {
    await aurum.disconnect();
    setUserInfo(undefined);
  }, []);

  const handleSign = useCallback(async () => {
    if (!userInfo?.publicAddress) return;
    setIsSigning(true);
    try {
      const message = "Hello from aurum demo";
      const hexMessage = `0x${Array.from(
        new TextEncoder().encode(message),
        (b) => b.toString(16).padStart(2, "0")
      ).join("")}`;
      const result = await aurum.rpcProvider.request({
        method: "personal_sign",
        params: [hexMessage, userInfo.publicAddress],
      });
      toast(`Signature: ${result}`);
    } catch (error) {
      console.error(error);
      toast.error(
        `Error: ${(error as { message?: string })?.message ?? "Sign failed"}`
      );
    } finally {
      setIsSigning(false);
    }
  }, [userInfo?.publicAddress]);

  const handleWidgetConnect = useCallback(
    async (result: UserInfo) => {
      setUserInfo(result);
      toast(`User connected with ${result.walletId}`);
    },
    []
  );

  const handleHeadlessConnect = useCallback(async (walletId: WalletId) => {
    try {
      await aurum.connect(walletId);
      const info = await aurum.getUserInfo();
      setUserInfo(info);
      toast(`User connected with ${walletId}`);
    } catch (error) {
      console.error(error);
      toast.error(
        `Error: ${
          (error as { message?: string })?.message ??
          "Headless connection failed"
        }`
      );
    }
  }, []);

  const handleEmailAuthStart = useCallback(async (email: string) => {
    const { flowId } = await aurum.emailAuthStart(email);
    return flowId;
  }, []);

  const handleEmailAuthVerify = useCallback(
    async (flowId: string, otp: string) => {
      await aurum.emailAuthVerify(flowId, otp);
      const info = await aurum.getUserInfo();
      setUserInfo(info);
      toast(`User connected with ${info?.walletId}`);
    },
    []
  );

  const value: AppContextType = {
    isDark,
    setIsDark,
    radius,
    setRadius,
    fontIndex,
    setFontIndex,
    primaryColor,
    setPrimaryColor,
    logo,
    setLogo,
    hideFooter,
    setHideFooter,
    excludeWallets,
    setExcludeWallets: setExcludeWalletsWithSync,
    toggleWallet,
    connectUxMode,
    setConnectUxMode,
    walletLayout,
    setWalletLayout,
    isWalletsOpen,
    setIsWalletsOpen,
    isResetting,
    isLoading,
    userInfo,
    isSigning,
    handleReset,
    handleShare,
    handleConnect,
    handleDisconnect,
    handleSign,
    handleWidgetConnect,
    handleHeadlessConnect,
    handleEmailAuthStart,
    handleEmailAuthVerify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
