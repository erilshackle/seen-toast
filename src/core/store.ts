import type { Toast, ToastOptions } from "./types";

type Listener = (toasts: Toast[]) => void;
type Unsubscribe = () => void;

const MAX_STACK = 4;

class ToastStore {
  private toasts: Toast[] = [];
  private listeners: Set<Listener> = new Set();

  get(): Toast[] {
    return this.toasts;
  }

  subscribe(listener: Listener): Unsubscribe {
    this.listeners.add(listener);
    // Chamar imediatamente com o estado atual
    listener(this.toasts);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.toasts));
  }

  add(toast: Toast) {
    // Remover toasts da mesma posição se exceder o limite
    const samePositionToasts = this.toasts.filter(t => t.position === toast.position);

    if (samePositionToasts.length >= MAX_STACK) {
      const toRemove = samePositionToasts[0];
      this.remove(toRemove.id);
    }

    this.toasts = [...this.toasts, toast];
    this.notify();

  }

  remove(id: string) {
    const toast = this.toasts.find(t => t.id === id);
    if (toast?.onDismiss) {
      toast.onDismiss(id);
    }

    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  update(id: string, newOptions: Partial<ToastOptions>) {
    this.toasts = this.toasts.map(t =>
      t.id === id ? { ...t, ...newOptions } : t
    );
    this.notify();
  }

  clearAll() {
    // Chamar onDismiss para todos
    this.toasts.forEach(toast => {
      if (toast.onDismiss) {
        toast.onDismiss(toast.id);
      }
    });
    
    this.toasts = [];
    this.notify();
  }

  clearPosition(position: string) {
    const toastsToRemove = this.toasts.filter(t => t.position === position);

    toastsToRemove.forEach(toast => {
      if (toast.onDismiss) {
        toast.onDismiss(toast.id);
      }
    });

    this.toasts = this.toasts.filter(t => t.position !== position);
    this.notify();
  }
}

export const store = new ToastStore();