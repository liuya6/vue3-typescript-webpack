<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component :is="Component" v-if="route.meta.keepAlive" />
    </keep-alive>
    <component v-if="!route.meta.keepAlive" :is="Component" />
  </router-view>
  <PlayMusic />
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import PlayMusic from "./view/PlayMusic/PlayMusic.vue";
// import { useStore, mapState } from "vuex";
// import { getHome } from "@/api/modules/home";

export default defineComponent({
  components: {
    PlayMusic,
  },

  computed: {
    // ...mapState({
    // message: (state) => state.Home.message,
    // }),
  },

  setup() {
    // const el = getCurrentInstance();
  },
});
</script>
