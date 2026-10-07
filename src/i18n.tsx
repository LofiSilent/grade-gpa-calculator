import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  loadLocale,
  messages,
  translate,
  localizedDecimal,
  type Locale,
  type MessageKey,
} from "./locales";
function useLanguageState() {
  const [locale, setLocale] = useState<Locale>(loadLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `${translate(locale, "title")} · Grade`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", translate(locale, "subtitle"));
    try {
      localStorage.setItem("grade-language", locale);
    } catch {}
  }, [locale]);
  return {
    locale,
    setLocale,
    t: (key: MessageKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    decimal: (value: string) => localizedDecimal(value, locale),
    exampleNames: messages[locale].exampleNames,
  };
}
const I18nContext = createContext<ReturnType<typeof useLanguageState> | null>(
  null,
);
export function I18nProvider({ children }: { children: ReactNode }) {
  const value = useLanguageState();
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw Error("I18nProvider required");
  return value;
}
