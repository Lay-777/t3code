import * as NodeServices from "@effect/platform-node/NodeServices";
import { expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as ChildProcessSpawner from "effect/process/ChildProcessSpawner";

import * as DesktopCliCommand from "./DesktopCliCommand.ts";
import * as DesktopEnvironment from "./DesktopEnvironment.ts";

const environmentFor = (
  path: Path.Path,
  input: { home: string; baseDir: string; platform?: NodeJS.Platform; isPackaged?: boolean },
) =>
  DesktopEnvironment.DesktopEnvironment.of({
    path,
    platform: input.platform ?? "linux",
    isPackaged: input.isPackaged ?? true,
    homeDirectory: input.home,
    baseDir: input.baseDir,
    stateDir: path.join(input.baseDir, "userdata"),
    desktopSettingsPath: path.join(input.baseDir, "userdata", "desktop-settings.json"),
    serverRoot: "/opt/T3 Code Bilingual Test/resources/app.asar",
    appImagePath: Option.none(),
  } as unknown as DesktopEnvironment.DesktopEnvironment["Service"]);

const commandIn = (input: {
  home: string;
  baseDir?: string;
  platform?: NodeJS.Platform;
  isPackaged?: boolean;
  env?: NodeJS.ProcessEnv;
}) =>
  Effect.gen(function* () {
    const path = yield* Path.Path;
    const fs = yield* FileSystem.FileSystem;
    const baseDir = input.baseDir ?? path.join(input.home, ".t3-bilingual-test");
    yield* fs.makeDirectory(path.join(baseDir, "userdata"), { recursive: true });
    return yield* DesktopCliCommand.make.pipe(
      Effect.provideService(
        DesktopEnvironment.DesktopEnvironment,
        environmentFor(path, { ...input, baseDir }),
      ),
      Effect.provideService(HostProcess.Environment, input.env ?? { PATH: "", SHELL: "/bin/zsh" }),
      Effect.provideService(
        ChildProcessSpawner.ChildProcessSpawner,
        ChildProcessSpawner.make(() =>
          Effect.die("this edition must not spawn a shell to edit PATH"),
        ),
      ),
    );
  });

it.layer(NodeServices.layer)("DesktopCliCommand", (it) => {
  it.effect("does not install t3 onto PATH or into the official home", () =>
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const home = yield* fs.makeTempDirectoryScoped();
      const env: NodeJS.ProcessEnv = { PATH: "", SHELL: "/bin/zsh" };
      const command = yield* commandIn({ home, env });
      const link = path.join(home, ".local", "bin", "t3");
      const official = path.join(home, ".t3", "bin", "t3");
      const zshrc = path.join(home, ".zshrc");
      yield* fs.writeFileString(zshrc, "# mine\n");
      yield* fs.makeDirectory(path.dirname(official), { recursive: true });
      yield* fs.writeFileString(official, "#!/bin/sh\necho official\n");

      const error = yield* Effect.flip(command.install);
      expect(error.message).toContain("does not install the t3 command");
      expect((yield* Effect.flip(command.addToPath)).message).toContain(
        "does not install the t3 command",
      );
      yield* command.installOnFirstLaunch;

      expect(yield* fs.exists(link)).toBe(false);
      expect(yield* fs.readFileString(zshrc)).toBe("# mine\n");
      expect(yield* fs.readFileString(official)).toContain("official");
      expect((yield* command.state).installedPath).toBeNull();
      expect((yield* command.state).onPath).toBe(false);
    }).pipe(Effect.scoped),
  );
});
