import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type ColorTheme = "dark" | "aqua";
export type BrandTheme = "water" | "gym" | "other";

interface ThemeContextType {
  theme: ColorTheme;
  brand: BrandTheme;
  toggleTheme: () => void;
  setBrand: (brand: BrandTheme) => void;
}

const DEFAULT_STATE: ThemeContextType = { theme: "dark", brand: "water", toggleTheme: () => {}, setBrand: () => {} };

const ThemeContext = createContext<ThemeContextType>(DEFAULT_STATE);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ColorTheme>(() => {
    try { return (localStorage.getItem("bp-theme") as ColorTheme) || "dark"; } catch { return "dark"; }
  });
  const [brand, setBrandState] = useState<BrandTheme>(() => {
    try {
      const saved = localStorage.getItem("bp-brand") as BrandTheme;
      return ["water", "gym", "other"].includes(saved) ? saved : "water";
    } catch { return "water"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("bp-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-brand", brand);
    localStorage.setItem("bp-brand", brand);
  }, [brand]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "aqua" : "dark"));
  }

  function setBrand(brand: BrandTheme) {
    setBrandState(brand);
  }

  return (
    <ThemeContext.Provider value={{ theme, brand, toggleTheme, setBrand }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
