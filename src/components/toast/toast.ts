import { getGlobalAddToast, type ToastType } from "./ToastContext";

// Queue for toasts that come in before the provider is ready
let pendingToasts: Array<{ message: string; type: ToastType }> = [];
let isProcessingQueue = false;

function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  const addToast = getGlobalAddToast();
  if (addToast && pendingToasts.length > 0) {
    pendingToasts.forEach(({ message, type }) => {
      addToast(message, type);
    });
    pendingToasts = [];
  }

  isProcessingQueue = false;
}

function createToast(message: string, type: ToastType = "default") {
  const addToast = getGlobalAddToast();
  if (addToast) {
    addToast(message, type);
    // Also process any queued toasts
    processQueue();
  } else {
    // Queue the toast and try again shortly
    pendingToasts.push({ message, type });
    setTimeout(processQueue, 10);
  }
}

export const toast = Object.assign(
  (message: string) => createToast(message, "default"),
  {
    success: (message: string) => createToast(message, "success"),
    error: (message: string) => createToast(message, "error"),
  }
);
