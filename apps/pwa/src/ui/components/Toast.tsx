import { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'info' | 'success' | 'error';

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const Toast = memo(function Toast({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 3000;
    const exitTimer = setTimeout(() => setIsExiting(true), duration - 300);
    const dismissTimer = setTimeout(() => onDismiss(toast.id), duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, toast.duration, onDismiss]);

  const bgColor = {
    info: 'bg-blue-500/90',
    success: 'bg-green-500/90',
    error: 'bg-red-500/90',
  }[toast.type];

  const icon = {
    info: 'ℹ️',
    success: '✓',
    error: '✕',
  }[toast.type];

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-[var(--radius-md)] shadow-lg
        backdrop-blur-sm text-white
        transition-all duration-300
        ${bgColor}
        ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
      role="alert"
      aria-live="polite"
    >
      <span className="text-lg">{icon}</span>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-auto p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss"
      >
        <span className="text-sm">✕</span>
      </button>
    </div>
  );
});

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer = memo(function ToastContainer({
  toasts,
  onDismiss,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>,
    document.body
  );
});

// Toast manager for imperative API
type ToastListener = (toasts: ToastData[]) => void;

class ToastManager {
  private toasts: ToastData[] = [];
  private listeners: Set<ToastListener> = new Set();
  private counter = 0;

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener(this.toasts);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  show(message: string, type: ToastType = 'info', duration?: number): string {
    const id = `toast-${++this.counter}`;
    this.toasts.push({ id, message, type, duration });
    this.notify();
    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration ?? 5000);
  }
}

export const toastManager = new ToastManager();
