<template>
  <div class="homeHeader">
    <div class="top">
      <span class="iconfont">&#xe606;</span>
      <h1>M U S I C - D E M O</h1>
      <span class="iconfont">&#xe653;</span>
    </div>
    <ul>
      <li v-for="item in tabList" :key="item.path">
        <router-link :to="item.path" exact-active-class="active">{{
          item.title
        }}</router-link>
      </li>
    </ul>
  </div>
  <div class="displace"></div>
</template>

<script lang="ts">
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
export default {
  name: "HomeHeader",
  setup() {
    return {
      tabList,
    };
  },
};
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
  z-index: 99;
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
.displace {
  height: 88px;
}
</style>
