export type Theme = "light" | "dark";

export function getBrowserTheme(): Theme {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches ? "dark" : "light";
}

export function getUserTheme(): Theme | undefined {
  const dataTheme = document.body.dataset["theme"];

  if(!dataTheme || !isValidTheme(dataTheme)) {
    return undefined;
  }
  
  return dataTheme;
}

export function setUserTheme(newTheme: Theme): void {
  if(newTheme === getBrowserTheme()) {
    document.body.removeAttribute("data-theme");
    sessionStorage.removeItem("theme");
    return;
  }

  document.body.dataset["theme"] = newTheme;
  sessionStorage.setItem("theme", newTheme);
}

export function getSessionStorageTheme(): Theme | undefined {
  const theme = sessionStorage.getItem("theme");

  if(!theme || !isValidTheme(theme)) {
    return undefined;
  }

  return theme;
}

export function getCurrentTheme(): Theme {
  return getUserTheme() ?? getBrowserTheme();
}

export function toggleTheme(theme: Theme): Theme {
  return (theme === "light") ? "dark" : "light";
}

export function isValidTheme(value: string): value is Theme {
  return value === "light" || value === "dark";
}
