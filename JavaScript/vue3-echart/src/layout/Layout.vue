<script setup lang="ts">
import RecursiveMenu, { MenuRouteAdaptor } from "./RecursiveMenu";
import { menuRoutes } from "@/router";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const activeIndex = ref("");
router.isReady().then(() => {
  activeIndex.value = router.currentRoute.value.path;
});
</script>

<template>
  <div class="layout">
    <RecursiveMenu
      :data="MenuRouteAdaptor(menuRoutes)"
      :default-active="activeIndex"
      class="sidebar"
      ellipsis
    />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>
<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100%;


  .sidebar {
    width: 200px;
    height: 100%;
  }

  .article {
    flex: 1;
    position: relative;
    overflow-y: auto;
    overflow-wrap: break-word;
  }
}
</style>
