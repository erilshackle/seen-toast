import type { Toast } from "../core/types";
import { store } from "../core/store";
import { icons } from "./icons";

export function createToastElement(toast: Toast): HTMLElement {
  const el = document.createElement("div");

  el.className = `seen-toast ${toast.theme} ${toast.type} ${toast.className || ""}`;

  el.setAttribute("data-toast-id", toast.id);
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "polite");

  const showIcon = toast.showIcon !== false;

  const iconHtml = showIcon
    ? `<div class="icon">${icons[toast.type]}</div>`
    : "";

  const hasActions = toast.actions.length > 0;

  const actionsHtml = hasActions
    ? `
      <div class="actions">
        ${toast.actions
      .map(
        action =>
          `<button class="action-btn ${action.className || ""}">
                ${escapeHtml(action.label)}
              </button>`
      )
      .join("")}
      </div>
    `
    : "";

  const closeHtml = toast.closable
    ? `<button class="close-btn" aria-label="Close toast">✕</button>`
    : "";

  const shouldShowProgress = toast.showProgress && toast.duration >= 2000;

  el.innerHTML = `
    ${closeHtml}
    ${iconHtml}

    <div class="content">
      ${toast.title
      ? `<div class="title">${escapeHtml(toast.title)}</div>`
      : ""
    }

      <div class="message">
        ${escapeHtml(toast.message)}
      </div>

      ${actionsHtml}
    </div>

    ${shouldShowProgress ? `<div class="progress-bar"></div>` : ""}
  `;

  let timeoutId: number | null = null;
  let animationFrameId: number | null = null;

  let startedAt = 0;
  let remaining = toast.duration;

  let paused = false;

  if (toast.actions.length < 2 && toast.duration > 0) {
    const progressBar = el.querySelector(
      ".progress-bar"
    ) as HTMLElement | null;

    const updateProgress = () => {
      if (paused) return;

      const now = Date.now();
      const elapsed = now - startedAt;

      remaining -= elapsed;
      startedAt = now;

      const progress = Math.max(0, remaining / toast.duration);

      if (progressBar) {
        progressBar.style.transform = `scaleX(${progress})`;
      }

      if (remaining <= 0) {
        dismissWithAnimation(el, toast.id);
        return;
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    const start = () => {
      startedAt = Date.now();

      timeoutId = window.setTimeout(() => {
        dismissWithAnimation(el, toast.id);
      }, remaining);

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    const pause = () => {
      if (paused) return;

      paused = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const resume = () => {
      if (!paused) return;

      paused = false;
      start();
    };

    if (toast.pauseOnHover) {
      el.addEventListener("mouseenter", pause);
      el.addEventListener("mouseleave", resume);
    }

    start();

    (el as any)._cleanupTimers = () => {
      if (timeoutId) clearTimeout(timeoutId);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }

  // Close button

  const closeBtn = el.querySelector(".close-btn");

  if (closeBtn) {
    closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      dismissWithAnimation(el, toast.id);
    });
  }

  // Action buttons

  const actionBtns = el.querySelectorAll(".action-btn");

  actionBtns.forEach((btn, index) => {
    const action = toast.actions[index];

    if (!action?.onClick) return;

    btn.addEventListener("click", e => {
      e.stopPropagation();

      action.onClick(toast.id);

      if ((action as any).dismiss !== false) {
        dismissWithAnimation(el, toast.id);
      }
    });
  });

  requestAnimationFrame(() => {
    el.classList.add("enter");
    toast.onShow?.(toast.id);
  });

  return el;
}

function dismissWithAnimation(el: HTMLElement, toastId: string) {
  if (el.classList.contains("exit")) return;

  if ((el as any)._cleanupTimers) {
    (el as any)._cleanupTimers();
  }

  el.classList.add("exit");

  const handleAnimationEnd = () => {
    store.remove(toastId);

    el.removeEventListener("animationend", handleAnimationEnd);

    el.removeEventListener("transitionend", handleAnimationEnd);
  };

  el.addEventListener("animationend", handleAnimationEnd);

  el.addEventListener("transitionend", handleAnimationEnd);

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