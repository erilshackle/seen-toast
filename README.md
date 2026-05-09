# SeenToast

Minimal, modern and customizable toast notification library built with TypeScript.

## Features

* Lightweight
* TypeScript support
* Zero dependencies
* Multiple positions
* Light and dark themes
* Auto dismiss
* Pause on hover
* Animated progress bar
* Action buttons
* Closable notifications
* Stack management
* CDN support
* Fully customizable

---

# Installation

## npm

```bash
npm install seentoast
```

## pnpm

```bash
pnpm add seentoast
```

## yarn

```bash
yarn add seentoast
```

---

# Usage

## ESM / Bundlers

```ts
import Seen from "seentoast";

Seen.toast({
  message: "Hello world"
});
```

---

# CDN Usage

```html
<link rel="stylesheet" href="https://unpkg.com/seentoast/dist/seentoast.css">

<script src="https://unpkg.com/seentoast/dist/seentoast.umd.js"></script>

<script>
  Seen.toast({
    message: "Hello from CDN"
  });
</script>
```

SeenToast initializes automatically in browser environments.

---

# Quick Helpers

```ts
Seen.toast.success("Saved successfully");

Seen.toast.error("Something went wrong");

Seen.toast.warning("Be careful");

Seen.toast.info("New update available");
```

---

# Toast Options

```ts
Seen.toast({
  title: "Notification",
  message: "Your changes have been saved",
  type: "success",
  theme: "dark",
  position: "top-right",
  duration: 5000,
  pauseOnHover: true,
  closable: true,
  showIcon: true
});
```

---

# Available Types

```ts
type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";
```

---

# Available Themes

```ts
type ToastTheme =
  | "light"
  | "dark";
```

---

# Available Positions

```ts
type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

---

# Actions

```ts
Seen.toast({
  title: "Delete file",
  message: "This action cannot be undone",
  type: "warning",

  actions: [
    {
      label: "Cancel",
      onClick: () => {
        console.log("Cancelled");
      }
    },

    {
      label: "Delete",
      className: "danger",
      onClick: () => {
        console.log("Deleted");
      }
    }
  ]
});
```

Action buttons automatically stay grouped on a single row and wrap only when necessary.

---

# Manual Dismiss

```ts
const notification = Seen.toast({
  message: "Uploading..."
});

notification.dismiss();
```

---

# Update Toast

```ts
const notification = Seen.toast({
  message: "Uploading..."
});

notification.update({
  message: "Upload completed",
  type: "success"
});
```

---

# Infinite Toast

Set duration to `0`.

```ts
Seen.toast({
  message: "Persistent notification",
  duration: 0
});
```

---

# Progress Bar

The progress bar is automatically displayed when:

```ts
duration >= 2000
```

Short-lived notifications do not display a progress bar.

The progress bar automatically syncs with the remaining toast lifetime.

---

# Pause On Hover

```ts
Seen.toast({
  message: "Hover me",
  pauseOnHover: true
});
```

When the user hovers the toast:

* the dismiss timer pauses
* the progress bar pauses
* the remaining duration is preserved
* the timer resumes on mouse leave

---

# Hide Icon

```ts
Seen.toast({
  message: "No icon",
  showIcon: false
});
```

---

# Disable Close Button

```ts
Seen.toast({
  message: "Not closable",
  closable: false
});
```

---

# Clear Notifications

## Clear all

```ts
Seen.clearAll();
```

## Clear by position

```ts
Seen.clearPosition("top-right");
```

---

# Lifecycle Callbacks

```ts
Seen.toast({
  message: "Hello",

  onShow: (id) => {
    console.log("shown", id);
  },

  onDismiss: (id) => {
    console.log("dismissed", id);
  }
});
```

---

# Styling

You can fully customize the appearance using CSS.

Main classes:

```css
.seen-container
.seen-toast

.seen-toast.light
.seen-toast.dark

.seen-toast.success
.seen-toast.error
.seen-toast.warning
.seen-toast.info

.progress-bar
.close-btn

.actions
.action-btn
```

---

# Example

```ts
import Seen from "seentoast";

Seen.toast.success("Profile updated");

Seen.toast({
  title: "Session expired",
  message: "Please login again",
  type: "warning",
  theme: "dark",
  position: "top-right",
  duration: 6000,
  closable: true,
  pauseOnHover: true
});
```

---

# API

## Seen.toast

```ts
Seen.toast(options: ToastOptions)
```

Creates a toast notification.

Returns:

```ts
{
  dismiss(): void;
  update(options): void;
}
```

---

## Seen.clearAll

```ts
Seen.clearAll(): void
```

Removes all notifications.

---

## Seen.clearPosition

```ts
Seen.clearPosition(position): void
```

Removes notifications from a specific position.

---

# TypeScript

All types are exported.

```ts
import type {
  ToastOptions,
  ToastType,
  ToastTheme,
  ToastPosition
} from "seentoast";
```

---

# Build Outputs

SeenToast provides multiple builds:

| File               | Description     |
| ------------------ | --------------- |
| `seentoast.es.js`  | ES Module build |
| `seentoast.umd.js` | UMD / CDN build |
| `seentoast.css`    | Stylesheet      |

---

# Browser Support

SeenToast works in all modern browsers supporting:

* ES2020+
* CSS backdrop-filter
* CSS flexbox/grid

---

# License

MIT
