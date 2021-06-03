<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
// import { useStore, mapState } from "vuex";
// import { getHome } from "@/api/modules/home";

export default defineComponent({
  components: {},

  computed: {
    // ...mapState({
    // message: (state) => state.Home.message,
    // }),
  },

  setup() {
    // const el = getCurrentInstance();
    // console.log(el);
    // const store = useStore();
    // console.log(store.state.Home.message);
    // console.log(this.message);
    // store
    // const params = {
    //   offset: 0,
    //   limit: 5,
    // };
    // getHome(params).then((res) => {
    //   console.log(res);
    // });
    // console.log(getHome);
  },
});
</script>

<style scoped lang="less"></style>
