export function showGlobalToast(message) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('showGlobalToast', { detail: { message } }));
}
