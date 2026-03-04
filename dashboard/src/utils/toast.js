export function showGlobalToast(message, type = "error") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("showGlobalToast", { detail: { message, type } })
  );
}
