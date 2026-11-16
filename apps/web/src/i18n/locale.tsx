import {
  appLocaleHtmlLang,
  resolveAppLocale,
  setActiveAppLocale,
  translate,
  type AppLocale,
} from "@t3tools/shared/i18n";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

import { useClientSettings } from "../hooks/useSettings";

export type Translate = (
  message: string,
  values?: Readonly<Record<string, string | number>>,
) => string;

const LocaleContext = createContext<{ readonly locale: AppLocale; readonly t: Translate }>({
  locale: "en",
  t: (message, values) => translate("en", message, values),
});

export function LocaleProvider({ children }: { readonly children: ReactNode }) {
  const stored = useClientSettings((settings) => settings.uiLocale);
  const locale = resolveAppLocale(stored);
  const value = useMemo(
    () => ({
      locale,
      t: (message: string, values?: Readonly<Record<string, string | number>>) =>
        translate(locale, message, values),
    }),
    [locale],
  );
  // oxlint-disable-next-line t3code/no-unreasoned-state-sync -- document language and event-time menus live outside React
  useEffect(() => {
    setActiveAppLocale(locale);
    document.documentElement.lang = appLocaleHtmlLang(locale);
    return () => {
      setActiveAppLocale("en");
    };
  }, [locale]);
  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useTranslate(): { readonly locale: AppLocale; readonly t: Translate } {
  return useContext(LocaleContext);
}
