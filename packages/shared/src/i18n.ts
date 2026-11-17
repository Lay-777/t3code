import { ZH_CN } from "./i18nCatalog.ts";

export const APP_LOCALES = ["en", "zh-CN"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export function resolveAppLocale(value: unknown): AppLocale {
  return value === "zh-CN" ? "zh-CN" : "en";
}

export function appLocaleHtmlLang(locale: AppLocale): "en" | "zh-CN" {
  return locale === "zh-CN" ? "zh-CN" : "en";
}

export function translate(
  locale: AppLocale,
  message: string,
  values?: Readonly<Record<string, string | number>>,
): string {
  const template = locale === "zh-CN" ? (ZH_CN[message] ?? message) : message;
  if (values === undefined) return template;
  return template.replace(/\{([A-Za-z0-9_]+)\}/g, (token, key: string) => {
    const value = values[key];
    return value === undefined ? token : String(value);
  });
}

let activeLocale: AppLocale = "en";

/** Event-time copy, such as a menu opened after the React locale has changed. */
export function setActiveAppLocale(locale: AppLocale): void {
  activeLocale = locale;
}

export function getActiveAppLocale(): AppLocale {
  return activeLocale;
}

export function translateActive(
  message: string,
  values?: Readonly<Record<string, string | number>>,
): string {
  return translate(activeLocale, message, values);
}
