import { ORCHESTRATION_PROTOCOL_HEADER } from "@t3tools/contracts";
import { EDITION_DEV_PROTOCOL_SCHEME, EDITION_PROTOCOL_SCHEME } from "@t3tools/shared/edition";

export const browserApiCorsAllowedMethods = ["GET", "POST", "OPTIONS"] as const;
export const browserApiCorsAllowedHeaders = [
  "authorization",
  "b3",
  "traceparent",
  "content-type",
  "dpop",
  ORCHESTRATION_PROTOCOL_HEADER,
] as const;

export const DESKTOP_RENDERER_ORIGINS = [
  `${EDITION_PROTOCOL_SCHEME}://app`,
  `${EDITION_DEV_PROTOCOL_SCHEME}://app`,
] as const;
