<template>
  <div class="musicLyric">
    <div class="noLyric" v-if="noLyric">纯音乐,请欣赏~</div>
    <ul class="content" v-else>
      <li class="placeholder"></li>
      <li
        v-for="(item, i) in currentMusicLyric"
        :class="{
          [`lyricLi${i}`]: true,
          active: currentLineNum === i,
        }"
      >
        {{ item.txt }}
      </li>
      <li class="placeholder"></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from "vue";
import { useStore } from "vuex";

import { deepClone } from "@/utils/tools";

export default defineComponent({
  name: "MusicLyric",

  props: {
    currentTime: Number,
  },

  setup(props) {
    const store = useStore();

    let currentLineNum = ref(0);

    const currentMusicLyric = computed(() => {
      return store.state.PlayMusic.currentMusicLyric;
    });

    const currentTime = computed(() => {
      return props.currentTime;
    });

    const noLyric = computed(() => {
      return store.state.PlayMusic.NoLyric;
    });

    watch(currentTime, (newVal) => {
      let time = Math.ceil(deepClone(newVal) * 1000);
      let arr: number[] = [];
      (currentMusicLyric.value as { txt: string; time: number }[]).forEach(
        (item, i) => {
          if (time > item.time) arr.push(i);
        }
      );
      if (currentLineNum.value != arr[arr.length - 1]) {
        currentLineNum.value = arr[arr.length - 1];
        handleLyric();
      }
    });

    const handleLyric = () => {
      let el: HTMLElement | null = document.querySelector(
        `.lyricLi${currentLineNum.value}`
      );
      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    };

    return {
      currentMusicLyric,
      currentLineNum,
      noLyric,
    };
  },
});
</script>

<style scoped lang="less">
.musicLyric {
  .noLyric {
    color: #fff;
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
  }
  ul {
    height: calc(100vh - 60px - 150px);
    overflow: auto;
    padding: 0 10px;
    li {
      text-align: center;
      height: 60px;
      line-height: 20px;
      color: #bbb;
      margin-bottom: 10px;
      &.active {
        color: #fff;
      }
      &.placeholder {
        height: 30vh;
      }
    }
  }
}
</style>
