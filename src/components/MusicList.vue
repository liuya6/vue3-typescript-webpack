<template>
  <ul class="musicList">
    <li
      v-for="(item, i) in musicList"
      :key="item.id"
      @click="play(item)"
      :class="{
        disable: isDisable(item),
      }"
    >
      <span>
        {{ i + 1 }}
      </span>
      <div>
        <p>{{ item.name }}</p>
        <p>
          <span v-for="(child, j) in item.ar" :key="j">{{ child.name }},</span>
          <span>{{ `<${item.al.name}>` }}</span>
        </p>
      </div>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { Dialog } from "vant";

import { playMusic, playMusics } from "@/utils/player";
import { isLogin } from "@/utils/user";

import MusicDetail from "@/view/MusicDetail/MusicDetail.vue";

export default defineComponent({
  name: "MusicList",

  props: {
    musicList: Array,
    showPlay: Boolean,
  },

  setup(props) {
    const router = useRouter();

    const play = (item: MusicDetail) => {
      if (isDisable(item)) {
        return Dialog.confirm({
          title: "提示",
          message: "有些歌得登录之后才能听，是否登录？",
        })
          .then(() => {
            router.push("/login");
          })
          .catch((e) => {
            console.log(e);
          });
      }
      if (props.showPlay) {
        playMusics(item);
      } else {
        playMusic(item);
      }
    };

    const isDisable = (item: MusicDetail) => {
      if (isLogin()) {
        return false;
      } else {
        return !item.playable;
      }
    };

    return {
      play,
      isDisable,
    };
  },
});
</script>

<style scoped lang="less">
.musicList {
  transform: translate3d(0, 0, 0);
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
        background-color: #eee;
        opacity: 0.8;
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
      span {
        &:last-child {
          font-size: 12px;
          padding-left: 5px;
          color: #999;
        }
      }
    }
  }
}
</style>
