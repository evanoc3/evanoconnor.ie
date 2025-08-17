export function setupBackButton(): void {
  const backButton = document.querySelector<HTMLButtonElement>("button.back-link");
  if(backButton) {
    backButton.removeAttribute("hidden");
    backButton.addEventListener("click", () => window.history.back());
  }
}
