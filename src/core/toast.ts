import { store } from "./store";
import type { Toast, ToastOptions } from "./types";
import { defaultConfig } from "./config";

const uid = () => crypto.randomUUID();

export function toast(options: ToastOptions) {
  const merged = {
    ...defaultConfig,
    ...options
  };

  const hasActions = merged.actions && merged.actions.length > 1;
  const autoDuration = hasActions ? 0 : 3000;

  const t: Toast = {
    id: uid(),
    title: merged.title ?? "",
    message: merged.message,
    type: merged.type ?? "info",
    theme: merged.theme ?? "light",
    position: merged.position ?? "bottom-center",
    duration: merged.duration ?? autoDuration,
    pauseOnHover: merged.pauseOnHover ?? true,
    pauseOnWindowBlur: merged.pauseOnWindowBlur ?? true,
    closable: merged.closable ?? true,
    actions: merged.actions ?? [],
    className: merged.className ?? "",
    showIcon: merged.showIcon ?? true, // Padrão: mostrar ícone
    showProgress: merged.showProgress ?? true,
    createdAt: Date.now(),
    onDismiss: merged.onDismiss,
    onShow: merged.onShow
  };

  store.add(t);

  return {
    dismiss: () => store.remove(t.id),
    update: (newOptions: Partial<ToastOptions>) => {
      store.update(t.id, newOptions);
    }
  };
}

// Helpers pra facilitar o uso
toast.success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
  return toast({ ...options, message, type: "success" });
};

toast.error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
  return toast({ ...options, message, type: "error" });
};

toast.warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
  return toast({ ...options, message, type: "warning" });
};

toast.info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
  return toast({ ...options, message, type: "info" });
};