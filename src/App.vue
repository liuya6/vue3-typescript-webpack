<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component v-if="route.meta.keepAlive" :is="Component" />
    </keep-alive>
    <component v-if="!route.meta.keepAlive" :is="Component" />
    <!--    <transition :name="transitionName" appear>-->
    <!--      <keep-alive v-if="route.meta.keepAlive">-->
    <!--        <component :is="Component" />-->
    <!--      </keep-alive>-->
    <!--      <component v-else :is="Component" />-->
    <!--    </transition>-->
  </router-view>
  <PlayMusic />
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";
// import { useRoute } from "vue-router";

import PlayMusic from "./view/PlayMusic/PlayMusic.vue";

export default defineComponent({
  components: {
    PlayMusic,
  },

  setup() {
    const store = useStore();
    // const transitionName = ref("");
    // const route = useRoute();
    store.dispatch("User/checkLoginStatus");
    store.commit("PlayMusic/setPlayCount", 0);

    const userInfo = computed(() => {
      return store.state.User.userInfo;
    });

    watch(
      userInfo,
      () => {
        if (userInfo.value && userInfo.value.userId) {
          store.dispatch("User/getUserLikeMusicList");
          // store.dispatch("User/getUserPlayList");
        }
      },
      { deep: true }
    );

    // const index = computed(() => {
    //   return route.meta.index;
    // });

    // watch(index, (newIndex, oldIndex) => {
    //   console.log(newIndex, oldIndex);
    //   newIndex = newIndex ? newIndex : 0;
    //   oldIndex = oldIndex ? oldIndex : 0;
    //   if (typeof newIndex === "number" && typeof oldIndex === "number") {
    //     if (newIndex > oldIndex) {
    //       transitionName.value = "slide-left";
    //     } else {
    //       transitionName.value = "slide-right";
    //     }
    //   }
    // });

    return {
      // transitionName,
    };
  },
});
</script>
