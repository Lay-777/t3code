import { RouterProvider } from "@tanstack/react-router";

import { ElectronBrowserHost } from "./browser/ElectronBrowserHost";
import { QuitHoldOverlay } from "./components/QuitHoldOverlay";
import { LocaleProvider } from "./i18n/locale";
import { AppAtomRegistryProvider } from "./rpc/atomRegistry";
import type { AppRouter } from "./router";

// Keep webviews outside the router but inside its atom registry so route changes preserve them.
export function AppRoot({ router }: { readonly router: AppRouter }) {
  return (
    <AppAtomRegistryProvider>
      <LocaleProvider>
        <RouterProvider router={router} />
        <ElectronBrowserHost />
        <QuitHoldOverlay />
      </LocaleProvider>
    </AppAtomRegistryProvider>
  );
}
