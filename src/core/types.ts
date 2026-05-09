export type ToastType = "success" | "error" | "warning" | "info" | "notification";
export type ToastTheme = "light" | "dark";

export type ToastPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: (toastId: string) => void;
  className?: string;
}

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  theme?: ToastTheme;
  position?: ToastPosition;
  duration?: number; // 0 = infinite
  pauseOnHover?: boolean;
  pauseOnWindowBlur?: boolean;
  closable?: boolean;
  actions?: ToastAction[];
  className?: string;
  showIcon?: boolean; // Nova opção: mostrar ou não o ícone
  showProgress?: boolean;
  onDismiss?: (toastId: string) => void;
  onShow?: (toastId: string) => void;
}

export interface Toast extends Required<Omit<ToastOptions, 'onDismiss' | 'onShow'>> {
  id: string;
  createdAt: number;
  onDismiss?: (toastId: string) => void;
  onShow?: (toastId: string) => void;
}