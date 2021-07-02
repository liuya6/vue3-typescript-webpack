<template>
  <ul class="musicList">
    <li v-for="(item, i) in musicList" :key="item.id" @click="play(item)">
      <span>
        {{ i + 1 }}
      </span>
      <div>
        <p>{{ item.name }}</p>
        <p>
          <span v-for="(child, j) in item.ar" :key="j">{{ child.name }}</span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { playMusic, playMusics } from "@/utils/player";

import MusicDetail from "@/view/MusicDetail/MusicDetail.vue";

export default defineComponent({
  name: "MusicList",

  props: {
    musicList: Array,
    showPlay: Boolean,
  },

  setup(props) {
    const play = (item: MusicDetail) => {
      if (props.showPlay) {
        playMusics(item);
      } else {
        playMusic(item);
      }
    };

    return {
      play,
    };
  },
});
</script>

<style scoped lang="less">
.musicList {
  li {
    height: 60px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e3e3e3;
    padding-left: 10px;
    &.disable {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: #ccc;
        opacity: 0.6;
      }
    }

    &:last-child {
      border-bottom: none;
    }
    > span {
      width: 30px;
      font-size: 15px;
    }
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100vw - 10px - 30px);
      &:first-child {
        font-size: 18px;
        color: #2d2f2d;
      }
      &:last-child {
        font-size: 13px;
        margin-top: 5px;
        color: #7a7b7a;
      }
    }
  }
}
</style>
