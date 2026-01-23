import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type ToastType = "default" | "success" | "error";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastIdCounter = 0;

// Global reference for the toast function to work outside of React components
let globalAddToast: ((message: string, type?: ToastType) => void) | null = null;

export function setGlobalAddToast(
  fn: ((message: string, type?: ToastType) => void) | null
) {
  globalAddToast = fn;
}

export function getGlobalAddToast() {
  return globalAddToast;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "default") => {
    const id = `toast-${++toastIdCounter}`;
    const toast: Toast = {
      id,
      message,
      type,
      createdAt: Date.now(),
    };
    setToasts((prev) => [toast, ...prev]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Register the global addToast function immediately when provider mounts
  useEffect(() => {
    setGlobalAddToast(addToast);
    return () => setGlobalAddToast(null);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}
