import { store } from "./store";
import type { Toast, ToastOptions } from "./types";

const uid = () => crypto.randomUUID();

export function toast(options: ToastOptions) {
  const t: Toast = {
    id: uid(),
    title: options.title ?? "",
    message: options.message,
    type: options.type ?? "info",
    theme: options.theme ?? "light",
    position: options.position ?? "bottom-center",
    duration: options.duration ?? 3000,
    pauseOnHover: options.pauseOnHover ?? true,
    pauseOnWindowBlur: options.pauseOnWindowBlur ?? true,
    closable: options.closable ?? true,
    actions: options.actions ?? [],
    className: options.className ?? "",
    createdAt: Date.now(),
    onDismiss: options.onDismiss,
    onShow: options.onShow
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