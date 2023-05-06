import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const menuRoutes: RouteRecordRaw[] = [
  {
    path: "/pie",
    title: "饼图",
    redirect: "/pie/basic",
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
        path: "/pie/unlabeled",
        title: "无标签饼图",
        component: () => import("@/views/Pie/UnlabeledPie"),
      },
      {
        path: "/pie/dount",
        title: "空心饼图",
        component: () => import("@/views/Pie/DountPie"),
      },
      {
        path: "/pie/outline",
        title: "带边框饼图",
        component: () => import("@/views/Pie/OutlinePie"),
      },
      {
        path: "/pie/sector",
        title: "扇形饼图",
        component: () => import("@/views/Pie/SectorPie"),
      },
      {
        path: "/pie/radial-gradient",
        title: "径向渐变饼图",
        component: () => import("@/views/Pie/RadialGradientPie"),
      },
      {
        path: "/pie/slow-animation",
        title: "缓慢动画饼图",
        component: () => import("@/views/Pie/SlowAnimationPie"),
      },
      {
        path: "/pie/adaptive-size",
        title: "自适应大小饼图",
        component: () => import("@/views/Pie/AdaptiveSizePie"),
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
