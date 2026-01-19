import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";

const BREAKPOINT = 800;
const DEFAULT_SIDEBAR_WIDTH = 320; // matches min-w-80

type SidebarContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
  isLargeScreen: boolean;
  hasMounted: boolean;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

type SidebarProviderProps = {
  children: ReactNode;
};

export function SidebarProvider({ children }: SidebarProviderProps) {
  const isInitiallyLargeScreen = window.innerWidth > BREAKPOINT;
  const [isOpen, setIsOpen] = useState(isInitiallyLargeScreen);
  // Initialize with default width if sidebar will be open, to prevent layout shift
  const [sidebarWidth, setSidebarWidth] = useState(
    isInitiallyLargeScreen ? DEFAULT_SIDEBAR_WIDTH : 0
  );
  const [isLargeScreen, setIsLargeScreen] = useState(isInitiallyLargeScreen);
  const [hasMounted, setHasMounted] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  // Mark as mounted after first render to enable transitions
  useEffect(() => {
    // Use requestAnimationFrame to ensure we're past the initial paint
    requestAnimationFrame(() => {
      setHasMounted(true);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > BREAKPOINT;
      setIsLargeScreen(isLarge);

      if (!isLarge) {
        setIsOpen(false);
      }
    };

    // Check on mount in case window size changed since initial render
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggle,
        sidebarWidth,
        setSidebarWidth,
        isLargeScreen,
        hasMounted,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
