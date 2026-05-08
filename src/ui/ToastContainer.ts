import { store } from "../core/store";
import type { Toast } from "../core/types";
import { createToastElement } from "./ToastItem";
import "./styles.css";

class ToastContainer {
  private containers: Map<string, HTMLElement> = new Map();
  private unsubscribe?: () => void;
  private elementsMap: Map<string, HTMLElement> = new Map(); // Track existing elements

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
    // Get current visible toast IDs
    const currentToastIds = new Set(toasts.map(t => t.id));
    
    // Remove toasts that are no longer in the list
    this.elementsMap.forEach((element, id) => {
      if (!currentToastIds.has(id)) {
        element.remove();
        this.elementsMap.delete(id);
      }
    });

    // Group toasts by position
    const grouped = toasts.reduce<Record<string, Toast[]>>((acc, toast) => {
      const position = toast.position;
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    }, {});

    // Render or update toasts
    Object.entries(grouped).forEach(([position, positionToasts]) => {
      const container = this.getContainer(position);
      
      // Para posições bottom, inverter a ordem
      const shouldReverse = position.startsWith('bottom');
      const toastsToRender = shouldReverse ? [...positionToasts].reverse() : positionToasts;
      
      // Reorder existing elements
      toastsToRender.forEach((toast, index) => {
        let element = this.elementsMap.get(toast.id);
        
        if (!element) {
          // Create new element if it doesn't exist
          element = createToastElement(toast);
          this.elementsMap.set(toast.id, element);
        }
        
        // Append or move to correct position
        if (element.parentElement !== container) {
          container.appendChild(element);
        } else if (container.children[index] !== element) {
          // Reorder if necessary
          container.insertBefore(element, container.children[index] || null);
        }
      });
    });
  }

  destroy() {
    this.unsubscribe?.();
    this.elementsMap.forEach(element => element.remove());
    this.elementsMap.clear();
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