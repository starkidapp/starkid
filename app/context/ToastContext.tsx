import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import Snackbar from '../components/Snackbar';

type ToastContextType = {
  /** Short, self-hiding message at the bottom of the screen — no OK button to tap. */
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const hide = useCallback(() => setToast(null), []);
  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Keyed so a new message restarts the slide-in and the hide timer. */}
      {toast ? <Snackbar key={toast.id} visible message={toast.message} onHide={hide} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
