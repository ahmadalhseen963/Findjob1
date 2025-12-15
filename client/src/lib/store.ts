import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "./i18n";
import type { User } from "@shared/schema";

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: "ar",
      setLanguage: (lang) => {
        set({ language: lang });
        const dir = ["ar"].includes(lang) ? "rtl" : "ltr";
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
      },
      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
    }),
    {
      name: "find-job-syria-storage",
      partialize: (state) => ({ language: state.language, theme: state.theme }),
    }
  )
);
