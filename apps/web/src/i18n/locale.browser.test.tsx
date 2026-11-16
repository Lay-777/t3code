import { DEFAULT_CLIENT_SETTINGS } from "@t3tools/contracts/settings";
import { expect, it } from "vite-plus/test";

import { render } from "../../test/render";
import {
  __resetClientSettingsPersistenceForTests,
  __setClientSettingsForTests,
  persistClientSettingsPatch,
} from "../hooks/useSettings";
import { LocaleProvider, useTranslate } from "./locale";

function LanguageProbe() {
  const { t } = useTranslate();
  return <h1>{t("Settings")}</h1>;
}

it("switches visible copy immediately and restores English", async () => {
  __resetClientSettingsPersistenceForTests();
  __setClientSettingsForTests(DEFAULT_CLIENT_SETTINGS);
  // The probe has no route; the language lives in client settings, not the router.
  await using screen = await render(
    <LocaleProvider>
      <LanguageProbe />
    </LocaleProvider>,
    { router: false },
  );

  await expect.element(screen.getByRole("heading", { name: "Settings" })).toBeVisible();
  expect(document.documentElement.lang).toBe("en");

  await persistClientSettingsPatch({ uiLocale: "zh-CN" }, async () => undefined);
  await expect.element(screen.getByRole("heading", { name: "设置" })).toBeVisible();
  expect(document.documentElement.lang).toBe("zh-CN");

  await persistClientSettingsPatch({ uiLocale: "en" }, async () => undefined);
  await expect.element(screen.getByRole("heading", { name: "Settings" })).toBeVisible();
  expect(document.documentElement.lang).toBe("en");
});

it("keeps an untranslated sentence in English while Chinese is active", async () => {
  __resetClientSettingsPersistenceForTests();
  __setClientSettingsForTests({ ...DEFAULT_CLIENT_SETTINGS, uiLocale: "zh-CN" });
  function Probe() {
    const { t } = useTranslate();
    return <p>{t("Provider error: invalid_grant from codex")}</p>;
  }
  // The probe has no route; it only checks catalog fallback.
  await using screen = await render(
    <LocaleProvider>
      <Probe />
    </LocaleProvider>,
    { router: false },
  );
  await expect.element(screen.getByText("Provider error: invalid_grant from codex")).toBeVisible();
});
