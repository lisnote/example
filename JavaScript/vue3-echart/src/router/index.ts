import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const menuRoutes: RouteRecordRaw[] = [
  {
    path: "/pie",
    title: "饼图",
    children: [
      {
        path: "/pie/basic",
        title: "基础饼图",
        component: () => import("@/views/Pie/BasicPie"),
      },
      {
        path: "/pie/borderPie",
        title: "描边饼图",
        component: () => import("@/views/Pie/BorderPie"),
      },
      {
        path: "/pie/non-interactive",
        title: "关闭交互饼图",
        component: () => import("@/views/Pie/NonInteractive"),
      },
      {
        path: "/pie/example",
        title: "生产示例",
        component: () => import("@/views/Pie/ExamplePie"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/pie",
      component: () => import("@/layout"),
      children: menuRoutes,
    },
  ],
});

export { router as default, menuRoutes };
