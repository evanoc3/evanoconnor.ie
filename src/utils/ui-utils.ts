export function showElementsRequiringJs(): void {
  const elements = document.querySelectorAll<HTMLElement>("[data-requires-js]");
  for(const el of elements) {
    el.removeAttribute("hidden");
    el.removeAttribute("data-requires-js");
  }
}
