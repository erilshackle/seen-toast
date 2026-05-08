import { store } from "../core/store";
import type { Toast } from "../core/types";
import { createToastElement } from "./ToastItem";
import "./styles.css";

class ToastContainer {
  private containers: Map<string, HTMLElement> = new Map();
  private unsubscribe?: () => void;

  constructor() {
    this.init();
  }

  private init() {
    this.unsubscribe = store.subscribe((toasts: Toast[]) => {
      this.render(toasts);
    });
  }

  private getContainer(position: string): HTMLElement {
    if (!this.containers.has(position)) {
      const el = document.createElement("div");
      el.className = `seen-container ${position}`;
      document.body.appendChild(el);
      this.containers.set(position, el);
    }
    return this.containers.get(position)!;
  }

  private render(toasts: Toast[]) {
    // Clear all containers but keep them
    this.containers.forEach(container => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    });

    // Group toasts by position
    const grouped = toasts.reduce((acc, toast) => {
      if (!acc[toast.position]) {
        acc[toast.position] = [];
      }
      acc[toast.position].push(toast);
      return acc;
    }, {} as Record<string, Toast[]>);

    // Render toasts in their respective containers
    Object.entries(grouped).forEach(([position, positionToasts]) => {
      const container = this.getContainer(position);
      positionToasts.forEach(toast => {
        const element = createToastElement(toast);
        container.appendChild(element);
      });
    });
  }

  destroy() {
    this.unsubscribe?.();
    this.containers.forEach(container => container.remove());
    this.containers.clear();
  }
}

let instance: ToastContainer | null = null;

export function initToastUI() {
  if (!instance) {
    instance = new ToastContainer();
  }
  return instance;
}