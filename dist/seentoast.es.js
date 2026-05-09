class S {
  toasts = [];
  listeners = /* @__PURE__ */ new Set();
  get() {
    return this.toasts;
  }
  subscribe(e) {
    return this.listeners.add(e), e(this.toasts), () => this.listeners.delete(e);
  }
  notify() {
    this.listeners.forEach((e) => e(this.toasts));
  }
  add(e) {
    const n = this.toasts.filter((s) => s.position === e.position);
    if (n.length >= 4) {
      const s = n[0];
      this.remove(s.id);
    }
    this.toasts = [...this.toasts, e], this.notify();
  }
  remove(e) {
    const n = this.toasts.find((s) => s.id === e);
    n?.onDismiss && n.onDismiss(e), this.toasts = this.toasts.filter((s) => s.id !== e), this.notify();
  }
  update(e, n) {
    this.toasts = this.toasts.map(
      (s) => s.id === e ? { ...s, ...n } : s
    ), this.notify();
  }
  clearAll() {
    this.toasts.forEach((e) => {
      e.onDismiss && e.onDismiss(e.id);
    }), this.toasts = [], this.notify();
  }
  clearPosition(e) {
    this.toasts.filter((s) => s.position === e).forEach((s) => {
      s.onDismiss && s.onDismiss(s.id);
    }), this.toasts = this.toasts.filter((s) => s.position !== e), this.notify();
  }
}
const u = new S(), $ = {
  success: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 12l2.5 2.5L16 9"></path>
    </svg>
  `,
  error: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9 9l6 6M15 9l-6 6"></path>
    </svg>
  `,
  warning: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  `,
  info: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 10v4"></path>
      <path d="M12 7h.01"></path>
    </svg>
  `,
  notification: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  `
};
function B(t) {
  const e = document.createElement("div");
  e.className = `seen-toast ${t.theme} ${t.type} ${t.className || ""}`, e.setAttribute("data-toast-id", t.id), e.setAttribute("role", "alert"), e.setAttribute("aria-live", "polite");
  const s = t.showIcon !== !1 ? `<div class="icon">${$[t.type]}</div>` : "", r = t.actions.length > 0 ? `
      <div class="actions">
        ${t.actions.map(
    (d) => `<button class="action-btn ${d.className || ""}">
                ${b(d.label)}
              </button>`
  ).join("")}
      </div>
    ` : "", c = t.closable ? '<button class="close-btn" aria-label="Close toast">✕</button>' : "", A = t.showProgress && t.duration >= 2e3;
  e.innerHTML = `
    ${c}
    ${s}

    <div class="content">
      ${t.title ? `<div class="title">${b(t.title)}</div>` : ""}

      <div class="message">
        ${b(t.message)}
      </div>

      ${r}
    </div>

    ${A ? '<div class="progress-bar"></div>' : ""}
  `;
  let h = null, l = null, m = 0, a = t.duration, p = !1;
  if (t.actions.length < 2 && t.duration > 0) {
    const d = e.querySelector(
      ".progress-bar"
    ), v = () => {
      if (p) return;
      const E = Date.now(), C = E - m;
      a -= C, m = E;
      const L = Math.max(0, a / t.duration);
      if (d && (d.style.transform = `scaleX(${L})`), a <= 0) {
        g(e, t.id);
        return;
      }
      l = requestAnimationFrame(v);
    }, f = () => {
      m = Date.now(), h = window.setTimeout(() => {
        g(e, t.id);
      }, a), l = requestAnimationFrame(v);
    }, w = () => {
      p || (p = !0, h && (clearTimeout(h), h = null), l && (cancelAnimationFrame(l), l = null));
    }, T = () => {
      p && (p = !1, f());
    };
    t.pauseOnHover && (e.addEventListener("mouseenter", w), e.addEventListener("mouseleave", T)), f(), e._cleanupTimers = () => {
      h && clearTimeout(h), l && cancelAnimationFrame(l);
    };
  }
  const M = e.querySelector(".close-btn");
  return M && M.addEventListener("click", (d) => {
    d.stopPropagation(), g(e, t.id);
  }), e.querySelectorAll(".action-btn").forEach((d, v) => {
    const f = t.actions[v];
    f?.onClick && d.addEventListener("click", (w) => {
      w.stopPropagation(), f.onClick(t.id), f.dismiss !== !1 && g(e, t.id);
    });
  }), requestAnimationFrame(() => {
    e.classList.add("enter"), t.onShow?.(t.id);
  }), e;
}
function g(t, e) {
  if (t.classList.contains("exit")) return;
  t._cleanupTimers && t._cleanupTimers(), t.classList.add("exit");
  const n = () => {
    u.remove(e), t.removeEventListener("animationend", n), t.removeEventListener("transitionend", n);
  };
  t.addEventListener("animationend", n), t.addEventListener("transitionend", n), setTimeout(() => {
    document.body.contains(t) && u.remove(e);
  }, 300);
}
function b(t) {
  const e = document.createElement("div");
  return e.textContent = t, e.innerHTML;
}
class D {
  containers = /* @__PURE__ */ new Map();
  unsubscribe;
  elementsMap = /* @__PURE__ */ new Map();
  // Track existing elements
  constructor() {
    this.init();
  }
  init() {
    this.unsubscribe = u.subscribe((e) => {
      this.render(e);
    });
  }
  getContainer(e) {
    if (!this.containers.has(e)) {
      const n = document.createElement("div");
      n.className = `seen-container ${e}`, document.body.appendChild(n), this.containers.set(e, n);
    }
    return this.containers.get(e);
  }
  render(e) {
    const n = new Set(e.map((i) => i.id));
    this.elementsMap.forEach((i, r) => {
      n.has(r) || (i.remove(), this.elementsMap.delete(r));
    });
    const s = e.reduce((i, r) => {
      const c = r.position;
      return i[c] || (i[c] = []), i[c].push(r), i;
    }, {});
    Object.entries(s).forEach(([i, r]) => {
      const c = this.getContainer(i);
      (i.startsWith("bottom") ? [...r].reverse() : r).forEach((l, m) => {
        let a = this.elementsMap.get(l.id);
        a || (a = B(l), this.elementsMap.set(l.id, a)), a.parentElement !== c ? c.appendChild(a) : c.children[m] !== a && c.insertBefore(a, c.children[m] || null);
      });
    });
  }
  destroy() {
    this.unsubscribe?.(), this.elementsMap.forEach((e) => e.remove()), this.elementsMap.clear(), this.containers.forEach((e) => e.remove()), this.containers.clear();
  }
}
let y = null;
function x() {
  return y || (y = new D()), y;
}
let P = {
  position: "bottom-center",
  theme: "light",
  duration: 3e3,
  closable: !0,
  pauseOnHover: !0,
  pauseOnWindowBlur: !0,
  showIcon: !0
};
const H = () => crypto.randomUUID();
function o(t) {
  const e = {
    ...P,
    ...t
  }, s = e.actions && e.actions.length > 1 ? 0 : 3e3, i = {
    id: H(),
    title: e.title ?? "",
    message: e.message,
    type: e.type ?? "info",
    theme: e.theme ?? "light",
    position: e.position ?? "bottom-center",
    duration: e.duration ?? s,
    pauseOnHover: e.pauseOnHover ?? !0,
    pauseOnWindowBlur: e.pauseOnWindowBlur ?? !0,
    closable: e.closable ?? !0,
    actions: e.actions ?? [],
    className: e.className ?? "",
    showIcon: e.showIcon ?? !0,
    // Padrão: mostrar ícone
    showProgress: e.showProgress ?? !0,
    createdAt: Date.now(),
    onDismiss: e.onDismiss,
    onShow: e.onShow
  };
  return u.add(i), {
    dismiss: () => u.remove(i.id),
    update: (r) => {
      u.update(i.id, r);
    }
  };
}
o.success = (t, e) => o({ ...e, message: t, type: "success" });
o.error = (t, e) => o({ ...e, message: t, type: "error" });
o.warning = (t, e) => o({ ...e, message: t, type: "warning" });
o.info = (t, e) => o({ ...e, message: t, type: "info" });
function k() {
  x();
}
function I(t = {}) {
}
const O = {
  initSeen: k,
  config: I,
  toast: o,
  success: o.success,
  error: o.error,
  warning: o.warning,
  info: o.info,
  clearAll: () => u.clearAll(),
  clearPosition: (t) => u.clearPosition(t)
};
typeof window < "u" && (window.Seen = O, k());
export {
  O as Seen,
  I as configureSeen,
  O as default,
  k as initSeen
};
