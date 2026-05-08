//#region src/core/store.ts
var e = 4, t = new class {
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
	add(t) {
		let n = this.toasts.filter((e) => e.position === t.position);
		if (n.length >= e) {
			let e = n[0];
			this.remove(e.id);
		}
		this.toasts = [...this.toasts, t], this.notify();
	}
	remove(e) {
		let t = this.toasts.find((t) => t.id === e);
		t?.onDismiss && t.onDismiss(e), this.toasts = this.toasts.filter((t) => t.id !== e), this.notify();
	}
	update(e, t) {
		this.toasts = this.toasts.map((n) => n.id === e ? {
			...n,
			...t
		} : n), this.notify();
	}
	clearAll() {
		this.toasts.forEach((e) => {
			e.onDismiss && e.onDismiss(e.id);
		}), this.toasts = [], this.notify();
	}
	clearPosition(e) {
		this.toasts.filter((t) => t.position === e).forEach((e) => {
			e.onDismiss && e.onDismiss(e.id);
		}), this.toasts = this.toasts.filter((t) => t.position !== e), this.notify();
	}
}(), n = {
	success: "\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <path d=\"M8 12l2.5 2.5L16 9\"></path>\n    </svg>\n  ",
	error: "\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <path d=\"M9 9l6 6M15 9l-6 6\"></path>\n    </svg>\n  ",
	warning: "\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\">\n      <path d=\"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z\"></path>\n      <path d=\"M12 9v4\"></path>\n      <path d=\"M12 17h.01\"></path>\n    </svg>\n  ",
	info: "\n    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\">\n      <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n      <path d=\"M12 10v4\"></path>\n      <path d=\"M12 7h.01\"></path>\n    </svg>\n  "
};
//#endregion
//#region src/ui/ToastItem.ts
function r(e) {
	let t = document.createElement("div");
	t.className = `seen-toast ${e.theme} ${e.type} ${e.className || ""}`, t.setAttribute("data-toast-id", e.id), t.setAttribute("role", "alert"), t.setAttribute("aria-live", "polite");
	let r = e.showIcon === !1 ? "" : `<div class="icon">${n[e.type]}</div>`, o = e.actions.length > 0 ? `
      <div class="actions">
        ${e.actions.map((e) => `<button class="action-btn ${e.className || ""}">
                ${a(e.label)}
              </button>`).join("")}
      </div>
    ` : "", s = e.closable ? "<button class=\"close-btn\" aria-label=\"Close toast\">✕</button>" : "", c = e.duration >= 2e3;
	t.innerHTML = `
    ${s}
    ${r}

    <div class="content">
      ${e.title ? `<div class="title">${a(e.title)}</div>` : ""}

      <div class="message">
        ${a(e.message)}
      </div>

      ${o}
    </div>

    ${c ? "<div class=\"progress-bar\"></div>" : ""}
  `;
	let l = null, u = null, d = 0, f = e.duration, p = !1;
	if (e.duration > 0) {
		let n = t.querySelector(".progress-bar"), r = () => {
			if (p) return;
			let a = Date.now(), o = a - d;
			f -= o, d = a;
			let s = Math.max(0, f / e.duration);
			if (n && (n.style.transform = `scaleX(${s})`), f <= 0) {
				i(t, e.id);
				return;
			}
			u = requestAnimationFrame(r);
		}, a = () => {
			d = Date.now(), l = window.setTimeout(() => {
				i(t, e.id);
			}, f), u = requestAnimationFrame(r);
		};
		e.pauseOnHover && (t.addEventListener("mouseenter", () => {
			p || (p = !0, l &&= (clearTimeout(l), null), u &&= (cancelAnimationFrame(u), null));
		}), t.addEventListener("mouseleave", () => {
			p && (p = !1, a());
		})), a(), t._cleanupTimers = () => {
			l && clearTimeout(l), u && cancelAnimationFrame(u);
		};
	}
	let m = t.querySelector(".close-btn");
	return m && m.addEventListener("click", (n) => {
		n.stopPropagation(), i(t, e.id);
	}), t.querySelectorAll(".action-btn").forEach((n, r) => {
		let a = e.actions[r];
		a?.onClick && n.addEventListener("click", (n) => {
			n.stopPropagation(), a.onClick(e.id), a.dismiss !== !1 && i(t, e.id);
		});
	}), requestAnimationFrame(() => {
		t.classList.add("enter"), e.onShow?.(e.id);
	}), t;
}
function i(e, n) {
	if (e.classList.contains("exit")) return;
	e._cleanupTimers && e._cleanupTimers(), e.classList.add("exit");
	let r = () => {
		t.remove(n), e.removeEventListener("animationend", r), e.removeEventListener("transitionend", r);
	};
	e.addEventListener("animationend", r), e.addEventListener("transitionend", r), setTimeout(() => {
		document.body.contains(e) && t.remove(n);
	}, 300);
}
function a(e) {
	let t = document.createElement("div");
	return t.textContent = e, t.innerHTML;
}
//#endregion
//#region src/ui/ToastContainer.ts
var o = class {
	containers = /* @__PURE__ */ new Map();
	unsubscribe;
	elementsMap = /* @__PURE__ */ new Map();
	constructor() {
		this.init();
	}
	init() {
		this.unsubscribe = t.subscribe((e) => {
			this.render(e);
		});
	}
	getContainer(e) {
		if (!this.containers.has(e)) {
			let t = document.createElement("div");
			t.className = `seen-container ${e}`, document.body.appendChild(t), this.containers.set(e, t);
		}
		return this.containers.get(e);
	}
	render(e) {
		let t = new Set(e.map((e) => e.id));
		this.elementsMap.forEach((e, n) => {
			t.has(n) || (e.remove(), this.elementsMap.delete(n));
		});
		let n = e.reduce((e, t) => {
			let n = t.position;
			return e[n] || (e[n] = []), e[n].push(t), e;
		}, {});
		Object.entries(n).forEach(([e, t]) => {
			let n = this.getContainer(e);
			(e.startsWith("bottom") ? [...t].reverse() : t).forEach((e, t) => {
				let i = this.elementsMap.get(e.id);
				i || (i = r(e), this.elementsMap.set(e.id, i)), i.parentElement === n ? n.children[t] !== i && n.insertBefore(i, n.children[t] || null) : n.appendChild(i);
			});
		});
	}
	destroy() {
		this.unsubscribe?.(), this.elementsMap.forEach((e) => e.remove()), this.elementsMap.clear(), this.containers.forEach((e) => e.remove()), this.containers.clear();
	}
}, s = null;
function c() {
	return s ||= new o(), s;
}
//#endregion
//#region src/core/toast.ts
var l = () => crypto.randomUUID();
function u(e) {
	let n = {
		id: l(),
		title: e.title ?? "",
		message: e.message,
		type: e.type ?? "info",
		theme: e.theme ?? "light",
		position: e.position ?? "bottom-center",
		duration: e.duration ?? 3e3,
		pauseOnHover: e.pauseOnHover ?? !0,
		pauseOnWindowBlur: e.pauseOnWindowBlur ?? !0,
		closable: e.closable ?? !0,
		actions: e.actions ?? [],
		className: e.className ?? "",
		showIcon: e.showIcon ?? !0,
		createdAt: Date.now(),
		onDismiss: e.onDismiss,
		onShow: e.onShow
	};
	return t.add(n), {
		dismiss: () => t.remove(n.id),
		update: (e) => {
			t.update(n.id, e);
		}
	};
}
u.success = (e, t) => u({
	...t,
	message: e,
	type: "success"
}), u.error = (e, t) => u({
	...t,
	message: e,
	type: "error"
}), u.warning = (e, t) => u({
	...t,
	message: e,
	type: "warning"
}), u.info = (e, t) => u({
	...t,
	message: e,
	type: "info"
});
//#endregion
//#region src/index.ts
function d() {
	c();
}
var f = {
	toast: u,
	clearAll: () => t.clearAll(),
	clearPosition: (e) => t.clearPosition(e)
};
//#endregion
export { f as Seen, f as default, d as initSeen };
