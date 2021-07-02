<template>
  <div class="header">
    <span> {{ title }} </span>
    <div class="left">
      <slot name="left">
        <span class="iconfont" @click="back">&#xe659; </span>
      </slot>
    </div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
  <div class="placeholder"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",

  props: {
    title: String,
  },
});
</script>

<style scoped lang="less">
.header {
  position: fixed;
  z-index: 99;
  width: 100%;
  line-height: 44px;
  background-color: @theme;
  color: #fff;
  font-size: 16px;
  text-align: center;
  .left,
  .right {
    position: absolute;
    top: 0;
    width: 44px;
    text-align: center;
    line-height: 44px;
    .iconfont {
      font-size: 20px;
    }
  }
  .right {
    right: 0;
  }
}
.placeholder {
  height: 44px;
}
</style>
