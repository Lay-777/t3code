/**
 * Unofficial Simplified Chinese / English test edition of T3 Code 0.1.9.
 * MIT license and the T3 Tools copyright stay in LICENSE.
 * Data, protocol, and update identity stay off the official install.
 */

export const EDITION_ID = "bilingual-test" as const;

export const EDITION_PRODUCT_NAME = "T3 Code Bilingual Test";
export const EDITION_BASE_NAME = "T3 Code Bilingual Test";
export const EDITION_UNOFFICIAL_LABEL = "Unofficial bilingual test edition";

/** Not `~/.t3`, so this edition never opens the official database, settings, or secrets. */
export const EDITION_HOME_DIRECTORY_NAME = ".t3-bilingual-test";

/** Electron userData. Official profiles are never copied, including their safeStorage keys. */
export const EDITION_USER_DATA_DIRECTORY_NAME = "t3code-bilingual-test";
export const EDITION_DEV_USER_DATA_DIRECTORY_NAME = "t3code-bilingual-test-dev";

export const EDITION_APP_ID = "com.t3tools.t3code.bilingual-test";
export const EDITION_LINUX_DESKTOP_ENTRY_NAME = "com.t3tools.t3code.bilingual-test.desktop";
export const EDITION_LINUX_DEV_DESKTOP_ENTRY_NAME =
  "com.t3tools.t3code.bilingual-test.development.desktop";

/**
 * A single letter-group after `t3code-` so existing app-link parsers accept it.
 * It is not the official `t3code` or `t3code-dev` protocol.
 */
export const EDITION_PROTOCOL_SCHEME = "t3code-zh";
export const EDITION_DEV_PROTOCOL_SCHEME = "t3code-zhdev";

/** Official desktop servers start at 3773. This edition starts later so it does not take that port. */
export const EDITION_DESKTOP_BACKEND_PORT = 4773;

export const EDITION_LOCKS_AUTO_UPDATE = true;
export const EDITION_INSTALLS_CLI_ON_PATH = false;

export const OFFICIAL_USER_DATA_DIRECTORY_NAMES = [
  "t3code",
  "t3code-v2",
  "t3code-dev",
  "T3 Code",
  "T3 Code (Alpha)",
  "T3 Code (Beta)",
  "T3 Code (Dev)",
  "T3 Code (Nightly)",
] as const;

/** Packaged startup calls this before update config is read. It cannot be skipped by an empty environment. */
export function lockUnofficialEdition(env: NodeJS.ProcessEnv): void {
  if (!EDITION_LOCKS_AUTO_UPDATE) return;
  env.T3CODE_DISABLE_AUTO_UPDATE = "true";
}
