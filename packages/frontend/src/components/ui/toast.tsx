'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* ─── Types ─── */

type ToastType = 'info' | 'success' | 'warning';

interface Toast {
  readonly id: number;
  readonly message: string;
  readonly type: ToastType;
  readonly duration: number;
  readonly onClick?: () => void;
}

interface ToastContextValue {
  readonly showToast: (
    message: string,
    options?: { type?: ToastType; duration?: number; onClick?: () => void },
  ) => void;
}

/* ─── Context ─── */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/* ─── Colors ─── */

const TYPE_COLORS: Record<ToastType, string> = {
  info: 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
  success: 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
  warning: 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
};

const PROGRESS_COLORS: Record<ToastType, string> = {
  info: 'bg-blue-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
};

const ICONS: Record<ToastType, string> = {
  info: '\u2139\uFE0F',
  success: '\u2705',
  warning: '\u26A0\uFE0F',
};

const MAX_VISIBLE = 3;

/* ─── Provider ─── */

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback(
    (
      message: string,
      { type = 'info', duration = 5000, onClick }: { type?: ToastType; duration?: number; onClick?: () => void } = {},
    ) => {
      const id = nextId.current++;
      const toast: Toast = { id, message, type, duration, onClick };
      setToasts((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1, y: index * 4 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={toast.onClick}
              className={[
                'pointer-events-auto min-w-[300px] max-w-[400px]',
                'rounded-xl border backdrop-blur-xl bg-white/[0.05] p-4',
                'cursor-pointer',
                TYPE_COLORS[toast.type],
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{ICONS[toast.type]}</span>
                <p className="text-sm text-white/90 flex-1">{toast.message}</p>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-0.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${PROGRESS_COLORS[toast.type]}`}
                  style={{
                    animation: `progress-bar ${toast.duration}ms linear forwards`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
