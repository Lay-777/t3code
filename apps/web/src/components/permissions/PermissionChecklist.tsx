import { CircleCheckIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useTranslate } from "../../i18n/locale";
import { Button } from "../ui/button";

export interface PermissionItem {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  granted: boolean;
  onAllow: () => void;
}

export function PermissionChecklist({
  permissions,
  busy = false,
}: {
  permissions: readonly PermissionItem[];
  busy?: boolean;
}) {
  const { t } = useTranslate();
  return (
    <div className="space-y-2">
      {permissions.map((permission) => (
        <div key={permission.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
          {permission.icon}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-pretty">{t(permission.title)}</p>
            <p className="text-xs text-pretty text-muted-foreground">{t(permission.description)}</p>
          </div>
          {permission.granted ? (
            <span role="status" className="flex items-center gap-1 text-xs text-success">
              <CircleCheckIcon className="size-4" aria-hidden="true" />
              {t("Allowed")}
            </span>
          ) : (
            <Button size="xs" variant="outline" disabled={busy} onClick={permission.onAllow}>
              {t("Allow")}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export function PermissionContinueButton({
  ready,
  busy = false,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "disabled"> & { ready: boolean; busy?: boolean }) {
  const { t } = useTranslate();
  return (
    <Button {...props} disabled={!ready || busy}>
      {children ?? t("Continue")}
    </Button>
  );
}
