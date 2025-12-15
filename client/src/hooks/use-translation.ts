import { useAppStore } from "@/lib/store";
import { getTranslation, type Language } from "@/lib/i18n";

export function useTranslation() {
  const { language } = useAppStore();

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  const dir = ["ar"].includes(language) ? "rtl" : "ltr";

  return { t, language, dir };
}
