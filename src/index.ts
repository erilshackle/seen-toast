import { initToastUI } from "./ui/ToastContainer";
import { toast } from "./core/toast";
import { store } from "./core/store";

export * from "./core/types";

export function initSeen() {
  initToastUI();
}

let globalConfig = {};

export function configureSeen(config = {}) {
  globalConfig = config;
}

export const Seen = {
  initSeen,

  config: configureSeen,

  toast,

  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,

  clearAll: () => store.clearAll(),

  clearPosition: (position: string) =>
    store.clearPosition(position)
};

if (typeof window !== "undefined") {
  // Evita rodar o init se o usuário quiser controlar isso manualmente
  if (!(window as any).Seen) {
    (window as any).Seen = Seen;
    // Opcional: initSeen() automático pode ser configurado via data-attributes no script
  }
}

export default Seen;