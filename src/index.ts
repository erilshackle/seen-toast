import { initToastUI } from "./ui/ToastContainer";
import { toast } from "./core/toast";
import { store } from "./core/store";

export * from "./core/types";

export function initSeen() {
  initToastUI();
}

// Utilitários adicionais
export const Seen = { 
  toast,
  clearAll: () => store.clearAll(),
  clearPosition: (position: string) => store.clearPosition(position)
};

// Export default para uso mais simples
export default Seen;