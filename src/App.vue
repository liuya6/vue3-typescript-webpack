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
import { useStore } from "vuex";

import PlayMusic from "./view/PlayMusic/PlayMusic.vue";

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
    const store = useStore();
    store.dispatch("User/checkLoginStatus");
    // const el = getCurrentInstance();
  },
});
</script>
