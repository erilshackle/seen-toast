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
  (window as any).Seen = Seen;

  initSeen();
}

export default Seen;