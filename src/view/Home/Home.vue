<template>
  <div class="home">
    <HomeHeader />
    <div class="homeContent cl">
      <router-view v-slot:="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script>
import HomeHeader from "./components/HomeHeader";

export default {
  name: "Home",
  components: {
    HomeHeader,
  },
};
</script>

<style scoped lang="less"></style>
