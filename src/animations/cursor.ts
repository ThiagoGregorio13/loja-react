// Lets any part of the app (even the 3D scene, which has no DOM elements)
// change the label of the custom cursor. The <Cursor /> component listens to it.
const EVENT = "cursor-label";

export function setCursorLabel(label: string | null) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: label }));
}

export function onCursorLabel(callback: (label: string | null) => void) {
  const listener = (e: Event) => callback((e as CustomEvent<string | null>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
