<template>
  <HomeHeader />
  <router-view />
</template>

<script>
import HomeHeader from "./components/HomeHeader";

export default {
  name: "Home",
  components: {
    HomeHeader,
  },
  // data() {
  //   return {
  //     tabList,
  //   };
  // },
};
</script>

<style scoped lang="less"></style>
