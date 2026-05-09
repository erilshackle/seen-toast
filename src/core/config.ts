import type { ToastOptions } from "./types";

export let defaultConfig: Partial<ToastOptions> = {
  position: "bottom-center",
  theme: "light",
  duration: 3000,
  closable: true,
  pauseOnHover: true,
  pauseOnWindowBlur: true,
  showIcon: true
};

export function configure(
  config: Partial<ToastOptions>
) {
  defaultConfig = {
    ...defaultConfig,
    ...config
  };
}