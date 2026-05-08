# SeenToast

Minimal, modern and customizable toast notification library built with TypeScript.

## Features

* Lightweight
* TypeScript support
* Multiple positions
* Light and dark themes
* Auto dismiss
* Pause on hover
* Progress bar
* Action buttons
* Closable notifications
* Stack management
* Fully customizable
* No dependencies

---

# Installation

Using npm:

```bash
npm install seentoast
```

Using pnpm:

```bash
pnpm add seentoast
```

Using yarn:

```bash
yarn add seentoast
```

---

# Basic Usage

```ts
import Seen, { initSeen } from "seentoast";

initSeen();

Seen.toast({
  message: "Hello world"
});
```

---

# Quick Helpers

```ts
Seen.toast.success("Saved successfully");

Seen.toast.error("Something went wrong");

Seen.toast.warning("Be careful");

Seen.toast.info("New update available");
```

---

# Initialization

The UI container must be initialized once.

```ts
import { initSeen } from "seentoast";

initSeen();
```

Usually this should be done in your app entry file.

Example:

```ts
// main.ts
import { initSeen } from "seentoast";

initSeen();
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

Short-lived notifications do not show a progress bar.

---

# Pause On Hover

```ts
Seen.toast({
  message: "Hover me",
  pauseOnHover: true
});
```

When the user hovers the toast:

* the timer pauses
* the progress bar pauses
* dismiss resumes after mouse leave

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

Clear all:

```ts
Seen.clearAll();
```

Clear by position:

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

You can customize the appearance using CSS.

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
import Seen, { initSeen } from "seentoast";

initSeen();

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

## initSeen

```ts
initSeen(): void
```

Initializes the toast container.

---

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

# License

MIT
