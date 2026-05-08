import type { Toast } from "../core/types";
import { store } from "../core/store";
import { icons } from "./icons";

export function createToastElement(toast: Toast): HTMLElement {
  const el = document.createElement("div");
  el.className = `seen-toast ${toast.theme} ${toast.type} ${toast.className || ""}`;
  el.setAttribute("data-toast-id", toast.id);
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "polite");

  // Build inner HTML
  const actionsHtml = toast.actions.length > 0 || toast.closable
    ? `<div class="actions">
        ${toast.actions.map(action => `<button class="action-btn ${action.className || ""}">${action.label}</button>`).join("")}
        ${toast.closable ? `<button class="close" aria-label="Close toast">✕</button>` : ""}
       </div>`
    : "";

  el.innerHTML = `
    <div class="icon">${icons[toast.type]}</div>
    <div class="content">
      ${toast.title ? `<div class="title">${escapeHtml(toast.title)}</div>` : ""}
      <div class="message">${escapeHtml(toast.message)}</div>
    </div>
    ${actionsHtml}
    ${toast.duration > 0 ? '<div class="progress-bar"></div>' : ""}
  `;

  // Setup progress bar
  if (toast.duration > 0) {
    const progressBar = el.querySelector(".progress-bar") as HTMLElement;
    if (progressBar) {
      progressBar.style.animation = `progress ${toast.duration}ms linear forwards`;
    }
  }

  // Handle close button
  const closeBtn = el.querySelector(".close");
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dismissWithAnimation(el, toast.id);
    });
  }

  // Handle action buttons
  const actionBtns = el.querySelectorAll(".action-btn");
  actionBtns.forEach((btn, index) => {
    const action = toast.actions[index];
    if (action?.onClick) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        action.onClick(toast.id);
        // Dismiss after action if not persisting
        if (toast.duration > 0) {
          dismissWithAnimation(el, toast.id);
        }
      });
    }
  });

  // Handle pause on hover
  if (toast.pauseOnHover && toast.duration > 0) {
    let progressBar = el.querySelector(".progress-bar") as HTMLElement;
    if (progressBar) {
      let animation = progressBar.getAnimations()[0];
      
      el.addEventListener("mouseenter", () => {
        if (animation) {
          animation.pause();
        }
      });
      
      el.addEventListener("mouseleave", () => {
        if (animation) {
          animation.play();
        }
      });
    }
  }

  // Handle window blur pause
  if (toast.pauseOnWindowBlur && toast.duration > 0) {
    let progressBar = el.querySelector(".progress-bar") as HTMLElement;
    if (progressBar) {
      let animation = progressBar.getAnimations()[0];
      
      const handleBlur = () => animation?.pause();
      const handleFocus = () => animation?.play();
      
      window.addEventListener("blur", handleBlur);
      window.addEventListener("focus", handleFocus);
      
      // Cleanup listeners when toast is removed
      const observer = new MutationObserver(() => {
        if (!document.body.contains(el)) {
          window.removeEventListener("blur", handleBlur);
          window.removeEventListener("focus", handleFocus);
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  // Trigger enter animation
  requestAnimationFrame(() => {
    el.classList.add("enter");
    toast.onShow?.(toast.id);
  });

  return el;
}

function dismissWithAnimation(el: HTMLElement, toastId: string) {
  if (el.classList.contains("exit")) return;
  
  el.classList.add("exit");
  const handleAnimationEnd = () => {
    store.remove(toastId);
    el.removeEventListener("animationend", handleAnimationEnd);
    el.removeEventListener("transitionend", handleAnimationEnd);
  };
  
  el.addEventListener("animationend", handleAnimationEnd);
  el.addEventListener("transitionend", handleAnimationEnd);
  
  // Fallback timeout
  setTimeout(() => {
    if (document.body.contains(el)) {
      store.remove(toastId);
    }
  }, 300);
}

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}