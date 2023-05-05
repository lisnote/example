/// <reference types="vite/client" />
import { _RouteRecordBase } from "vue-router";

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >;
  export default component;
}

declare module "vue-router" {
  interface _RouteRecordBase {
    title?: string;
  }
}
