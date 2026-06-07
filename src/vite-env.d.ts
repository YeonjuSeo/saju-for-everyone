/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional endpoint for anonymous usage logging. Leave empty to disable. */
  readonly VITE_LOG_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
