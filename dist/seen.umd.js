(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.Seen={}))})(this,function(e){Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:`Module`}});var t=4,n=new class{toasts=[];listeners=new Set;get(){return this.toasts}subscribe(e){return this.listeners.add(e),e(this.toasts),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.toasts))}add(e){let n=this.toasts.filter(t=>t.position===e.position);if(n.length>=t){let e=n[0];this.remove(e.id)}this.toasts=[...this.toasts,e],this.notify()}remove(e){let t=this.toasts.find(t=>t.id===e);t?.onDismiss&&t.onDismiss(e),this.toasts=this.toasts.filter(t=>t.id!==e),this.notify()}update(e,t){this.toasts=this.toasts.map(n=>n.id===e?{...n,...t}:n),this.notify()}clearAll(){this.toasts.forEach(e=>{e.onDismiss&&e.onDismiss(e.id)}),this.toasts=[],this.notify()}clearPosition(e){this.toasts.filter(t=>t.position===e).forEach(e=>{e.onDismiss&&e.onDismiss(e.id)}),this.toasts=this.toasts.filter(t=>t.position!==e),this.notify()}},r={success:`
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
  `};function i(e){let t=document.createElement(`div`);t.className=`seen-toast ${e.theme} ${e.type} ${e.className||``}`,t.setAttribute(`data-toast-id`,e.id),t.setAttribute(`role`,`alert`),t.setAttribute(`aria-live`,`polite`);let n=e.showIcon===!1?``:`<div class="icon">${r[e.type]}</div>`,i=e.actions.length>0?`
      <div class="actions">
        ${e.actions.map(e=>`<button class="action-btn ${e.className||``}">
                ${o(e.label)}
              </button>`).join(``)}
      </div>
    `:``,s=e.closable?`<button class="close-btn" aria-label="Close toast">✕</button>`:``,c=e.duration>=2e3;t.innerHTML=`
    ${s}
    ${n}

    <div class="content">
      ${e.title?`<div class="title">${o(e.title)}</div>`:``}

      <div class="message">
        ${o(e.message)}
      </div>

      ${i}
    </div>

    ${c?`<div class="progress-bar"></div>`:``}
  `;let l=null,u=null,d=0,f=e.duration,p=!1;if(e.duration>0){let n=t.querySelector(`.progress-bar`),r=()=>{if(p)return;let i=Date.now(),o=i-d;f-=o,d=i;let s=Math.max(0,f/e.duration);if(n&&(n.style.transform=`scaleX(${s})`),f<=0){a(t,e.id);return}u=requestAnimationFrame(r)},i=()=>{d=Date.now(),l=window.setTimeout(()=>{a(t,e.id)},f),u=requestAnimationFrame(r)};e.pauseOnHover&&(t.addEventListener(`mouseenter`,()=>{p||(p=!0,l&&=(clearTimeout(l),null),u&&=(cancelAnimationFrame(u),null))}),t.addEventListener(`mouseleave`,()=>{p&&(p=!1,i())})),i(),t._cleanupTimers=()=>{l&&clearTimeout(l),u&&cancelAnimationFrame(u)}}let m=t.querySelector(`.close-btn`);return m&&m.addEventListener(`click`,n=>{n.stopPropagation(),a(t,e.id)}),t.querySelectorAll(`.action-btn`).forEach((n,r)=>{let i=e.actions[r];i?.onClick&&n.addEventListener(`click`,n=>{n.stopPropagation(),i.onClick(e.id),i.dismiss!==!1&&a(t,e.id)})}),requestAnimationFrame(()=>{t.classList.add(`enter`),e.onShow?.(e.id)}),t}function a(e,t){if(e.classList.contains(`exit`))return;e._cleanupTimers&&e._cleanupTimers(),e.classList.add(`exit`);let r=()=>{n.remove(t),e.removeEventListener(`animationend`,r),e.removeEventListener(`transitionend`,r)};e.addEventListener(`animationend`,r),e.addEventListener(`transitionend`,r),setTimeout(()=>{document.body.contains(e)&&n.remove(t)},300)}function o(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}var s=class{containers=new Map;unsubscribe;elementsMap=new Map;constructor(){this.init()}init(){this.unsubscribe=n.subscribe(e=>{this.render(e)})}getContainer(e){if(!this.containers.has(e)){let t=document.createElement(`div`);t.className=`seen-container ${e}`,document.body.appendChild(t),this.containers.set(e,t)}return this.containers.get(e)}render(e){let t=new Set(e.map(e=>e.id));this.elementsMap.forEach((e,n)=>{t.has(n)||(e.remove(),this.elementsMap.delete(n))});let n=e.reduce((e,t)=>{let n=t.position;return e[n]||(e[n]=[]),e[n].push(t),e},{});Object.entries(n).forEach(([e,t])=>{let n=this.getContainer(e);(e.startsWith(`bottom`)?[...t].reverse():t).forEach((e,t)=>{let r=this.elementsMap.get(e.id);r||(r=i(e),this.elementsMap.set(e.id,r)),r.parentElement===n?n.children[t]!==r&&n.insertBefore(r,n.children[t]||null):n.appendChild(r)})})}destroy(){this.unsubscribe?.(),this.elementsMap.forEach(e=>e.remove()),this.elementsMap.clear(),this.containers.forEach(e=>e.remove()),this.containers.clear()}},c=null;function l(){return c||=new s,c}var u=()=>crypto.randomUUID();function d(e){let t={id:u(),title:e.title??``,message:e.message,type:e.type??`info`,theme:e.theme??`light`,position:e.position??`bottom-center`,duration:e.duration??3e3,pauseOnHover:e.pauseOnHover??!0,pauseOnWindowBlur:e.pauseOnWindowBlur??!0,closable:e.closable??!0,actions:e.actions??[],className:e.className??``,showIcon:e.showIcon??!0,createdAt:Date.now(),onDismiss:e.onDismiss,onShow:e.onShow};return n.add(t),{dismiss:()=>n.remove(t.id),update:e=>{n.update(t.id,e)}}}d.success=(e,t)=>d({...t,message:e,type:`success`}),d.error=(e,t)=>d({...t,message:e,type:`error`}),d.warning=(e,t)=>d({...t,message:e,type:`warning`}),d.info=(e,t)=>d({...t,message:e,type:`info`});function f(){l()}var p={toast:d,clearAll:()=>n.clearAll(),clearPosition:e=>n.clearPosition(e)};e.Seen=p,e.default=p,e.initSeen=f});