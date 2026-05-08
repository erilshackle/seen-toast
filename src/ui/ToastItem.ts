import type { Toast } from "../core/types";
import { store } from "../core/store";
import { icons } from "./icons";

export function createToastElement(toast: Toast): HTMLElement {
  const el = document.createElement("div");
  el.className = `seen-toast ${toast.theme} ${toast.type} ${toast.className || ""}`;
  el.setAttribute("data-toast-id", toast.id);
  el.setAttribute("role", "alert");
  el.setAttribute("aria-live", "polite");

  // Icon option (only show if duration > 0 or explicitly true)
  const showIcon = (toast as any).showIcon !== false;
  const iconHtml = showIcon ? `<div class="icon">${icons[toast.type]}</div>` : '';

  // Build actions HTML
  const hasActions = toast.actions.length > 0;
  const actionsHtml = hasActions || toast.closable
    ? `<div class="actions ${hasActions && toast.actions.length > 1 ? 'actions-column' : ''}">
        ${toast.actions.map(action => `<button class="action-btn ${action.className || ""}">${escapeHtml(action.label)}</button>`).join("")}
       </div>`
    : "";

  // Close button HTML (top right)
  const closeHtml = toast.closable 
    ? `<button class="close-btn" aria-label="Close toast">✕</button>` 
    : "";

  el.innerHTML = `
    ${closeHtml}
    ${iconHtml}
    <div class="content">
      ${toast.title ? `<div class="title">${escapeHtml(toast.title)}</div>` : ""}
      <div class="message">${escapeHtml(toast.message)}</div>
      ${actionsHtml}
    </div>
    ${toast.duration > 0 ? '<div class="progress-bar"></div>' : ""}
  `;

  // Variables for timer management
  let timeoutId: number | null = null;
  let animationFrameId: number | null = null;
  let startTime: number;
  let remaining: number;
  let isPaused = false;

  // Setup progress bar only if duration > 0
  if (toast.duration > 0) {
    const progressBar = el.querySelector(".progress-bar") as HTMLElement;
    remaining = toast.duration;
    
    // Function to update progress bar width
    const updateProgress = () => {
      if (!progressBar || isPaused) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, (remaining - elapsed) / remaining);
      progressBar.style.transform = `scaleX(${progress})`;
      
      if (progress <= 0) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        return;
      }
      
      animationFrameId = requestAnimationFrame(updateProgress);
    };
    
    // Function to start/resume the timer
    const startTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      startTime = Date.now();
      updateProgress();
      
      timeoutId = window.setTimeout(() => {
        dismissWithAnimation(el, toast.id);
      }, remaining);
    };
    
    // Function to pause the timer
    const pauseTimer = () => {
      if (isPaused) return;
      isPaused = true;
      
      // Clear timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      // Cancel animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      // Calculate remaining time
      const elapsed = Date.now() - startTime;
      remaining = Math.max(0, remaining - elapsed);
      
      // Keep progress bar at current position
      if (progressBar) {
        const progress = remaining / toast.duration;
        progressBar.style.transform = `scaleX(${progress})`;
      }
    };
    
    // Function to resume the timer
    const resumeTimer = () => {
      if (!isPaused) return;
      isPaused = false;
      
      if (remaining <= 0) {
        dismissWithAnimation(el, toast.id);
        return;
      }
      
      startTimer();
    };
    
    // Add hover listeners if pauseOnHover is enabled
    if (toast.pauseOnHover) {
      el.addEventListener("mouseenter", pauseTimer);
      el.addEventListener("mouseleave", resumeTimer);
    }
    
    // Start the timer
    startTimer();
    
    // Store cleanup function
    (el as any)._cleanupTimers = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }

  // Handle close button
  const closeBtn = el.querySelector(".close-btn");
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
        // Dismiss after action click
        if ((action as any).dismiss !== false) {
          dismissWithAnimation(el, toast.id);
        }
      });
    }
  });

  // Trigger enter animation
  requestAnimationFrame(() => {
    el.classList.add("enter");
    toast.onShow?.(toast.id);
  });

  return el;
}

function dismissWithAnimation(el: HTMLElement, toastId: string) {
  if (el.classList.contains("exit")) return;
  
  // Cleanup timers
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