<script lang="ts" setup>
import MenuItem from './MenuItem.vue';

import type { RecursiveMenuData } from '.';

defineProps<{
  data: RecursiveMenuData[];
}>();
</script>
<template>
  <ElMenu>
    <MenuItem v-for="(item, index) in data" :key="index" :data="item" />
  </ElMenu>
</template>
