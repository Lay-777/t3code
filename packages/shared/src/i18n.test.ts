import { describe, expect, it, afterEach } from "vite-plus/test";

import {
  EDITION_APP_ID,
  EDITION_DESKTOP_BACKEND_PORT,
  EDITION_HOME_DIRECTORY_NAME,
  EDITION_INSTALLS_CLI_ON_PATH,
  EDITION_LOCKS_AUTO_UPDATE,
  EDITION_PROTOCOL_SCHEME,
  EDITION_USER_DATA_DIRECTORY_NAME,
  OFFICIAL_USER_DATA_DIRECTORY_NAMES,
  lockUnofficialEdition,
} from "./edition.ts";
import {
  getActiveAppLocale,
  resolveAppLocale,
  setActiveAppLocale,
  translate,
  translateActive,
} from "./i18n.ts";

afterEach(() => {
  setActiveAppLocale("en");
});

describe("display language", () => {
  it("falls back to English for unknown locales and untranslated text", () => {
    expect(resolveAppLocale(undefined)).toBe("en");
    expect(resolveAppLocale("en")).toBe("en");
    expect(resolveAppLocale("zh-CN")).toBe("zh-CN");
    expect(resolveAppLocale("zh")).toBe("en");
    expect(resolveAppLocale("es")).toBe("en");
    expect(translate("zh-CN", "Settings")).toBe("设置");
    expect(translate("en", "Settings")).toBe("Settings");
    expect(translate("zh-CN", "This sentence has no catalog entry.")).toBe(
      "This sentence has no catalog entry.",
    );
  });

  it("switches immediately and does not translate inserted values", () => {
    expect(translate("zh-CN", "Set up {name}", { name: "Codex" })).toBe("设置 Codex");
    expect(translate("zh-CN", "Filter by {name}", { name: "my-project" })).toBe(
      "按 my-project 筛选",
    );
    expect(translate("en", "Set up {name}", { name: "deepseek" })).toBe("Set up deepseek");
    expect(translate("zh-CN", "Missing {name}", { name: "gpt-5.4" })).toBe("Missing gpt-5.4");
    setActiveAppLocale("zh-CN");
    expect(getActiveAppLocale()).toBe("zh-CN");
    expect(translateActive("New thread")).toBe("新建会话");
    setActiveAppLocale("en");
    expect(translateActive("New thread")).toBe("New thread");
  });

  it("leaves paths, urls, commands, and raw provider errors unchanged", () => {
    const samples = [
      "C:\\Users\\me\\.t3\\userdata\\settings.json",
      "/home/me/.codex/auth.json",
      "https://auth.openai.com/api/accounts/authorize",
      "codex login",
      "node.exe script.js",
      "gpt-5.4",
      "deepseek-v4",
      "Error: provider rejected the request: invalid_grant",
    ];
    for (const sample of samples) {
      expect(translate("zh-CN", sample)).toBe(sample);
    }
    expect(translate("zh-CN", "Run {command}", { command: "codex login" })).toBe("Run codex login");
  });
});

describe("unofficial edition isolation", () => {
  it("uses a distinct home, profile, protocol, port, and update lock", () => {
    expect(EDITION_HOME_DIRECTORY_NAME).not.toBe(".t3");
    expect(EDITION_USER_DATA_DIRECTORY_NAME).not.toBe("t3code-v2");
    expect(OFFICIAL_USER_DATA_DIRECTORY_NAMES).not.toContain(EDITION_USER_DATA_DIRECTORY_NAME);
    expect(EDITION_APP_ID).not.toBe("com.t3tools.t3code");
    expect(EDITION_PROTOCOL_SCHEME).not.toBe("t3code");
    expect(EDITION_PROTOCOL_SCHEME).not.toBe("t3code-dev");
    expect(EDITION_DESKTOP_BACKEND_PORT).not.toBe(3773);
    expect(EDITION_LOCKS_AUTO_UPDATE).toBe(true);
    expect(EDITION_INSTALLS_CLI_ON_PATH).toBe(false);
    const env: NodeJS.ProcessEnv = { T3CODE_DESKTOP_MOCK_UPDATES: "true" };
    lockUnofficialEdition(env);
    expect(env.T3CODE_DISABLE_AUTO_UPDATE).toBe("true");
  });
});
