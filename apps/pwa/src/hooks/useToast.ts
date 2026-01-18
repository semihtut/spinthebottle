import { useState, useEffect, useCallback } from 'react';
import { toastManager, type ToastData, type ToastType } from '@/ui/components/Toast';

/**
 * Hook for using the toast notification system
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    return toastManager.show(message, type, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    toastManager.dismiss(id);
  }, []);

  const info = useCallback((message: string, duration?: number) => {
    return toastManager.info(message, duration);
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    return toastManager.success(message, duration);
  }, []);

  const error = useCallback((message: string, duration?: number) => {
    return toastManager.error(message, duration);
  }, []);

  return {
    toasts,
    show,
    dismiss,
    info,
    success,
    error,
  };
}
