import { RegistryContext } from "@effect/atom-react";
import type { DesktopCliCommandState } from "@t3tools/contracts";
import { AtomRegistry } from "effect/reactivity";
import { expect, it, vi } from "vite-plus/test";

import { render, stubGlobal } from "../../../test/render";
import { CliCommandSettingsRow } from "./CliCommandSettingsRow";

it("does not offer to install t3 over the official command", async () => {
  const state: DesktopCliCommandState = {
    supported: true,
    installedPath: null,
    onPath: false,
    launcherPath: "/home/test/.t3/bin/t3",
  };
  const getState = vi.fn(async (): Promise<DesktopCliCommandState> => ({
    ...state,
    shadowedBy: "/usr/local/bin/t3",
  }));
  const uninstall = vi.fn(async () => state);
  using _bridge = stubGlobal("desktopBridge", {
    cliCommand: { getState, install: vi.fn(async () => state), uninstall },
    getLocalEnvironmentEnabled: () => true,
    getLocalEnvironmentBootstraps: () => [],
  });
  const registry = AtomRegistry.make();
  using _registry = { [Symbol.dispose]: () => registry.dispose() };
  await using screen = await render(
    <RegistryContext.Provider value={registry}>
      <CliCommandSettingsRow />
    </RegistryContext.Provider>,
  );

  await expect.element(screen.getByText(/does not install the t3 command/)).toBeVisible();
  expect(screen.getByRole("button", { name: "Install" }).query()).toBeNull();
  expect(uninstall).not.toHaveBeenCalled();
});
