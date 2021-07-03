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
import { computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";

import PlayMusic from "./view/PlayMusic/PlayMusic.vue";

export default defineComponent({
  components: {
    PlayMusic,
  },

  setup() {
    const store = useStore();
    store.dispatch("User/checkLoginStatus");

    const userInfo = computed(() => {
      return store.state.User.userInfo;
    });

    watch(
      userInfo,
      () => {
        if (userInfo.value.userId) {
          store.dispatch("User/getUserLikeMusicList");
          // store.dispatch("User/getUserPlayList");
        }
      },
      { deep: true }
    );
  },
});
</script>
