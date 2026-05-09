(function(d,g){typeof exports=="object"&&typeof module<"u"?g(exports):typeof define=="function"&&define.amd?define(["exports"],g):(d=typeof globalThis<"u"?globalThis:d||self,g(d.Seen={}))})(this,(function(d){"use strict";class ${toasts=[];listeners=new Set;get(){return this.toasts}subscribe(e){return this.listeners.add(e),e(this.toasts),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.toasts))}add(e){const s=this.toasts.filter(n=>n.position===e.position);if(s.length>=4){const n=s[0];this.remove(n.id)}this.toasts=[...this.toasts,e],this.notify()}remove(e){const s=this.toasts.find(n=>n.id===e);s?.onDismiss&&s.onDismiss(e),this.toasts=this.toasts.filter(n=>n.id!==e),this.notify()}update(e,s){this.toasts=this.toasts.map(n=>n.id===e?{...n,...s}:n),this.notify()}clearAll(){this.toasts.forEach(e=>{e.onDismiss&&e.onDismiss(e.id)}),this.toasts=[],this.notify()}clearPosition(e){this.toasts.filter(n=>n.position===e).forEach(n=>{n.onDismiss&&n.onDismiss(n.id)}),this.toasts=this.toasts.filter(n=>n.position!==e),this.notify()}}const h=new $,B={success:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 12l2.5 2.5L16 9"></path>
    </svg>
  `,error:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9 9l6 6M15 9l-6 6"></path>
    </svg>
  `,warning:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  `,info:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 10v4"></path>
      <path d="M12 7h.01"></path>
    </svg>
  `,notification:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  `};function D(t){const e=document.createElement("div");e.className=`seen-toast ${t.theme} ${t.type} ${t.className||""}`,e.setAttribute("data-toast-id",t.id),e.setAttribute("role","alert"),e.setAttribute("aria-live","polite");const n=t.showIcon!==!1?`<div class="icon">${B[t.type]}</div>`:"",r=t.actions.length>0?`
      <div class="actions">
        ${t.actions.map(u=>`<button class="action-btn ${u.className||""}">
                ${y(u.label)}
              </button>`).join("")}
      </div>
    `:"",c=t.closable?'<button class="close-btn" aria-label="Close toast">✕</button>':"",k=t.showProgress&&t.duration>=2e3;e.innerHTML=`
    ${c}
    ${n}

    <div class="content">
      ${t.title?`<div class="title">${y(t.title)}</div>`:""}

      <div class="message">
        ${y(t.message)}
      </div>

      ${r}
    </div>

    ${k?'<div class="progress-bar"></div>':""}
  `;let m=null,l=null,f=0,a=t.duration,v=!1;if(t.actions.length<2&&t.duration>0){const u=e.querySelector(".progress-bar"),b=()=>{if(v)return;const L=Date.now(),R=L-f;a-=R,f=L;const _=Math.max(0,a/t.duration);if(u&&(u.style.transform=`scaleX(${_})`),a<=0){w(e,t.id);return}l=requestAnimationFrame(b)},p=()=>{f=Date.now(),m=window.setTimeout(()=>{w(e,t.id)},a),l=requestAnimationFrame(b)},T=()=>{v||(v=!0,m&&(clearTimeout(m),m=null),l&&(cancelAnimationFrame(l),l=null))},O=()=>{v&&(v=!1,p())};t.pauseOnHover&&(e.addEventListener("mouseenter",T),e.addEventListener("mouseleave",O)),p(),e._cleanupTimers=()=>{m&&clearTimeout(m),l&&cancelAnimationFrame(l)}}const C=e.querySelector(".close-btn");return C&&C.addEventListener("click",u=>{u.stopPropagation(),w(e,t.id)}),e.querySelectorAll(".action-btn").forEach((u,b)=>{const p=t.actions[b];p?.onClick&&u.addEventListener("click",T=>{T.stopPropagation(),p.onClick(t.id),p.dismiss!==!1&&w(e,t.id)})}),requestAnimationFrame(()=>{e.classList.add("enter"),t.onShow?.(t.id)}),e}function w(t,e){if(t.classList.contains("exit"))return;t._cleanupTimers&&t._cleanupTimers(),t.classList.add("exit");const s=()=>{h.remove(e),t.removeEventListener("animationend",s),t.removeEventListener("transitionend",s)};t.addEventListener("animationend",s),t.addEventListener("transitionend",s),setTimeout(()=>{document.body.contains(t)&&h.remove(e)},300)}function y(t){const e=document.createElement("div");return e.textContent=t,e.innerHTML}class P{containers=new Map;unsubscribe;elementsMap=new Map;constructor(){this.init()}init(){this.unsubscribe=h.subscribe(e=>{this.render(e)})}getContainer(e){if(!this.containers.has(e)){const s=document.createElement("div");s.className=`seen-container ${e}`,document.body.appendChild(s),this.containers.set(e,s)}return this.containers.get(e)}render(e){const s=new Set(e.map(i=>i.id));this.elementsMap.forEach((i,r)=>{s.has(r)||(i.remove(),this.elementsMap.delete(r))});const n=e.reduce((i,r)=>{const c=r.position;return i[c]||(i[c]=[]),i[c].push(r),i},{});Object.entries(n).forEach(([i,r])=>{const c=this.getContainer(i);(i.startsWith("bottom")?[...r].reverse():r).forEach((l,f)=>{let a=this.elementsMap.get(l.id);a||(a=D(l),this.elementsMap.set(l.id,a)),a.parentElement!==c?c.appendChild(a):c.children[f]!==a&&c.insertBefore(a,c.children[f]||null)})})}destroy(){this.unsubscribe?.(),this.elementsMap.forEach(e=>e.remove()),this.elementsMap.clear(),this.containers.forEach(e=>e.remove()),this.containers.clear()}}let M=null;function x(){return M||(M=new P),M}let H={position:"bottom-center",theme:"light",duration:3e3,closable:!0,pauseOnHover:!0,pauseOnWindowBlur:!0,showIcon:!0};const I=()=>crypto.randomUUID();function o(t){const e={...H,...t},n=e.actions&&e.actions.length>1?0:3e3,i={id:I(),title:e.title??"",message:e.message,type:e.type??"info",theme:e.theme??"light",position:e.position??"bottom-center",duration:e.duration??n,pauseOnHover:e.pauseOnHover??!0,pauseOnWindowBlur:e.pauseOnWindowBlur??!0,closable:e.closable??!0,actions:e.actions??[],className:e.className??"",showIcon:e.showIcon??!0,showProgress:e.showProgress??!0,createdAt:Date.now(),onDismiss:e.onDismiss,onShow:e.onShow};return h.add(i),{dismiss:()=>h.remove(i.id),update:r=>{h.update(i.id,r)}}}o.success=(t,e)=>o({...e,message:t,type:"success"}),o.error=(t,e)=>o({...e,message:t,type:"error"}),o.warning=(t,e)=>o({...e,message:t,type:"warning"}),o.info=(t,e)=>o({...e,message:t,type:"info"});function A(){x()}function S(t={}){}const E={initSeen:A,config:S,toast:o,success:o.success,error:o.error,warning:o.warning,info:o.info,clearAll:()=>h.clearAll(),clearPosition:t=>h.clearPosition(t)};typeof window<"u"&&(window.Seen=E,A()),d.Seen=E,d.configureSeen=S,d.default=E,d.initSeen=A,Object.defineProperties(d,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})}));
