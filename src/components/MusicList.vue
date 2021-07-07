<template>
  <ul class="musicList">
    <li
      v-for="(item, i) in musicList"
      :key="item.id"
      @click="play(item)"
      :class="{
        'bd-btm': true,
        disable: isDisable(item),
      }"
    >
      <span class="iconfont" v-if="currentMusicId === item.id">&#xe637;</span>
      <span v-else>
        {{ i + 1 }}
      </span>
      <div class="des">
        <p>{{ item.name }}</p>
        <p>
          <span v-for="(child, j) in item.ar" :key="j">{{ child.name }},</span>
          <span>{{ `<${item.al.name}>` }}</span>
        </p>
      </div>
      <span class="iconfont" @click.stop="moreOption(item)">&#xe62c;</span>
    </li>
  </ul>
  <van-popup v-model:show="moreOptionShow" round position="bottom">
    <dl class="moreOption" v-if="chooseMusic && chooseMusic.name">
      <dt class="bd-btm">
        <div>
          <img v-lazy="`${chooseMusic.al.picUrl}?param=50y50`" alt="" />
        </div>
        <div class="des">
          <p>{{ chooseMusic.name }}</p>
          <p>
            <span v-for="(item, j) in chooseMusic.ar" :key="j"
              >{{ item.name }},</span
            >
            <span>{{ `<${chooseMusic.al.name}>` }}</span>
          </p>
        </div>
      </dt>
      <dd @click="nextPlay">
        <span class="iconfont">&#xe611;</span>
        下一首播放
      </dd>
      <dd />
    </dl>
  </van-popup>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Dialog, Notify } from "vant";

import { playMusic, playMusics } from "@/utils/player";
import { isLogin } from "@/utils/user";
import { deepClone } from "@/utils/tools";

export default defineComponent({
  name: "MusicList",

  props: {
    musicList: Array,
    showPlay: Boolean,
  },

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const moreOptionShow = ref(false);
    const chooseMusic = ref({});

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

    const currentMusicId = computed(() => {
      if (store.state.PlayMusic.currentMusic) {
        return store.state.PlayMusic.currentMusic.id;
      }
      return "";
    });

    const isDisable = (item: MusicDetail) => {
      if (isLogin()) {
        return false;
      } else {
        return !item.playable;
      }
    };

    const moreOption = (data: MusicDetail) => {
      chooseMusic.value = data;
      moreOptionShow.value = true;
    };

    const nextPlay = () => {
      let playList = deepClone(store.state.PlayMusic.playList);
      if (playList.length) {
        const currentMusic = store.state.PlayMusic.currentMusic as MusicDetail;
        if (currentMusic.id === (chooseMusic.value as MusicDetail).id) {
          return Notify({
            type: "danger",
            message: "正在播放这首歌",
          });
        }
        const index = playList
          .map((playListItem: MusicDetail, i: number) => {
            if (playListItem.id === (chooseMusic.value as MusicDetail).id) {
              return i;
            } else {
              return -1;
            }
          })
          .filter((item: number) => item >= 0)
          .toString();
        const currentIndex = store.state.PlayMusic.playListIndex as number;
        if (index) {
          if (Number(index) === currentIndex + 1) {
            return Notify({ type: "danger", message: "下一首就是这首歌" });
          } else {
            playList.splice(index, 1);
          }
        }
        playList.splice(currentIndex + 1, 0, chooseMusic.value);
        store.commit("PlayMusic/setPlayList", playList);
      } else {
        playMusic(chooseMusic.value as MusicDetail);
      }
      moreOptionShow.value = false;
      chooseMusic.value = {};
      return Notify({
        type: "success",
        message: "添加成功~",
      });
    };

    return {
      play,
      isDisable,
      moreOptionShow,
      moreOption,
      chooseMusic,
      nextPlay,
      currentMusicId,
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
      width: 35px;
      font-size: 15px;
      &.iconfont {
        font-size: 18px;
        color: @theme;
      }
      &:last-child {
        line-height: 60px;
        font-size: 25px;
      }
    }
    p {
      width: calc(100vw - 10px - 35px - 35px);
    }
  }
}
.moreOption {
  padding: 20px 0 20px 20px;
  dt {
    height: 60px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    > div {
      &:first-child {
        width: 50px;
        height: 50px;
        background-color: #ccc;
        margin-right: 10px;
        border-radius: 5px;
        overflow: hidden;
      }
      img {
        width: 100%;
        height: 100%;
      }
      p {
        width: calc(100vw - 50px - 20px - 10px);
      }
    }
  }
  dd {
    font-size: 18px;
    .iconfont {
      margin-right: 5px;
      font-size: 18px;
    }
  }
}

.des {
  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
</style>
