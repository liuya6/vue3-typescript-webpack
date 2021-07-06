<template>
  <div class="homeHeader">
    <Header :title="'M U S I C'">
      <template v-slot:left>
        <span class="iconfont" @click="sidebar.show()">&#xe606;</span>
      </template>
      <template v-slot:right>
        <span class="iconfont" @click="$router.push({ name: 'musicSearch' })"
          >&#xe653;</span
        >
      </template>
    </Header>
    <ul>
      <li v-for="item in tabList" :key="item.path">
        <router-link :to="item.path" exact-active-class="active">{{
          item.title
        }}</router-link>
      </li>
    </ul>
  </div>
  <div class="placeholder"></div>
  <Sidebar ref="sidebar" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Sidebar from "./Sidebar.vue";

const tabList = [
  {
    path: "/",
    title: "推荐",
  },
  {
    path: "/rank",
    title: "排行",
  },
  {
    path: "/singer",
    title: "歌手",
  },
];
export default defineComponent({
  name: "HomeHeader",

  components: {
    Sidebar,
  },

  setup() {
    const sidebar = ref(null);

    return {
      tabList,
      sidebar,
    };
  },
});
</script>

<style scoped lang="less">
.homeHeader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 88px;
  background-color: @theme;
  color: #fff;
  font-size: 15px;
  z-index: 90;
  .top {
    height: 44px;
    display: flex;
    align-items: center;
    h1 {
      flex: 1;
      text-align: center;
    }
    .iconfont {
      font-size: 20px;
      &:first-child {
        margin-left: 10px;
      }
      &:last-child {
        margin-right: 10px;
      }
    }
  }
  ul {
    display: flex;
    background-color: @theme;
    color: #fff;
    li {
      flex: 1;
      text-align: center;
      line-height: 44px;
      .active {
        font-weight: bold;
        position: relative;
        &::after {
          background-color: #fff;
          content: "";
          width: 100%;
          height: 2px;
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translate(-50%, 0);
        }
      }
    }
  }
}
.placeholder {
  height: 88px;
}
</style>
