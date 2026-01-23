import { useState, useCallback, useEffect } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useToastContext, type Toast, type ToastType } from "./ToastContext";

const TOAST_DURATION = 3000;

type ToastItemProps = {
  toast: Toast;
  onRemove: (id: string) => void;
};

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(TOAST_DURATION);

  const handleRemove = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  }, [onRemove, toast.id]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      handleRemove();
    }, remainingTime);

    const startTime = Date.now();

    return () => {
      clearTimeout(timer);
      if (!isExiting) {
        setRemainingTime((prev) => prev - (Date.now() - startTime));
      }
    };
  }, [isPaused, remainingTime, handleRemove, isExiting]);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg
        bg-[#1a1a1a] border border-[#333] shadow-[0_4px_20px_rgba(0,0,0,0.5)]
        text-white text-sm min-w-[280px] max-w-[420px]
        transform transition-all duration-200 ease-out
        ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}
        animate-slide-in
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {getIcon(toast.type)}
      <span className="flex-1 break-words">{toast.message}</span>
      <button
        onClick={handleRemove}
        className="p-1 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5 text-gray-400" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
