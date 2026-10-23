// next-pwa ships no types (TECH_STACK §1 dependency) — minimal ambient declaration
declare module "next-pwa" {
  import type { NextConfig } from "next";

  interface NextPWAOptions {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    scope?: string;
    [key: string]: unknown;
  }

  function withPWA(options: NextPWAOptions): (config: NextConfig) => NextConfig;
  export default withPWA;
}
