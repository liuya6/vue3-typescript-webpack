<template>
  <transition name="slide-bottom">
    <div v-show="playMiniShowFlag" class="playMini" @click="toPlayMusic">
      <div class="content">
        <div
          class="imgBox rotate"
          :class="{
            run: songStatus,
          }"
        >
          <img
            :src="`${currentMusic && currentMusic.al.picUrl}?param=100y100`"
            alt=""
          />
        </div>
        <div class="details">
          <p>{{ currentMusic && currentMusic.name }}</p>
          <p>{{ currentMusicSingerName }}</p>
        </div>
        <div class="list">
          <div class="play" @click.stop="plays">
            <van-circle
              v-model:current-rate="currentTimes"
              layer-color="#ccc"
              stroke-width="80"
            >
              <span class="iconfont"
                >{{ songStatus ? "&#xe61b;" : "&#xe610;" }}
              </span>
            </van-circle>
          </div>
          <span class="iconfont" @click.stop="musicListShow = true"
            >&#xe607;</span
          >
        </div>
      </div>
      <div class="placeholder" @click.stop></div>
    </div>
  </transition>
  <van-popup v-model:show="musicListShow" position="bottom">
    <div class="musicList">
      <div class="top">
        <div>
          <span class="iconfont">&#xe60a;</span>
          <span>循环播放</span>
          <span>{{ playList.length }}</span>
        </div>
        <span class="iconfont" @click="delMusic">&#xe73d; </span>
      </div>
      <div class="content">
        <ul>
          <li v-for="(item, i) in playList" :key="item.id">
            <p @click="playMusic(item)">
              <span class="iconfont" v-show="currentMusic.id === item.id"
                >&#xe637;</span
              >
              {{ item.name }}
            </p>
            <span class="iconfont" @click="delMusic(i)">&#xe61a; </span>
          </li>
        </ul>
      </div>
      <div class="close" @click="musicListShow = false">关闭</div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";

import { playMusic } from "@/utils/player";
import { deepClone } from "@/utils/tools";
import { addMusic } from "@/utils/player";

export default defineComponent({
  name: "PlayMini",

  props: {
    currentMusicSingerName: String,
    songStatus: Boolean,
    currentTime: Number,
    duration: Number,
    play: Function,
    playShow: Boolean,
  },

  setup(props, context) {
    const store = useStore();

    const musicListShow = ref(false);

    const currentMusic = computed(() => {
      return store.state.PlayMusic.currentMusic as MusicDetail;
    });

    const currentTimes = computed(() => {
      if (props.currentTime && props.duration) {
        return Math.floor((props.currentTime / props.duration) * 100);
      }
      return 0;
    });

    const playList = computed(() => {
      return store.state.PlayMusic.playList;
    });

    const toPlayMusic = () => {
      store.commit("PlayMusic/setPlayShow", true);
    };

    const plays = () => {
      (props as any).play();
    };

    const playMiniShowFlag = computed(() => {
      const playShow = props.playShow;
      const playListMaxIndex = store.getters["PlayMusic/playListMaxIndex"];
      return playListMaxIndex >= 0 && !playShow;
    });

    const delMusic = async (i?: number) => {
      if (typeof i === "number") {
        const playList = deepClone(store.state.PlayMusic.playList);
        const index = store.state.PlayMusic.playListIndex;
        if (index === i) {
          await addMusic();
          store.commit(
            "PlayMusic/setPlayListIndex",
            deepClone(store.state.PlayMusic.playListIndex - 1)
          );
        }
        playList.splice(i, 1);
        store.commit("PlayMusic/setPlayList", playList);
      } else {
        await store.commit("PlayMusic/setPlayList", []);
        store.commit("PlayMusic/setCurrentMusic", null);
        store.commit("PlayMusic/setCurrentMusicUrl", null);
        musicListShow.value = false;
      }
    };

    return {
      currentMusic,
      toPlayMusic,
      currentTimes,
      plays,
      playMiniShowFlag,
      musicListShow,
      playList,
      playMusic,
      delMusic,
    };
  },
});
</script>

<style scoped lang="less">
.playMini {
  .content {
    border-top: 1px solid #eee;
    position: fixed;
    width: 100%;
    height: 70px;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    .imgBox {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
      margin-left: 20px;
      border: 1px solid #888;
      box-sizing: border-box;
      &.rotate {
        animation: rotate 10s infinite linear;
        animation-play-state: paused;
        &.run {
          animation-play-state: running;
        }
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .details {
      margin-left: 10px;
      p {
        white-space: nowrap;
        width: 180px;
        text-overflow: ellipsis;
        overflow: hidden;
        &:first-child {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        &:last-child {
          font-size: 14px;
        }
      }
    }

    .list {
      display: flex;
      align-items: center;
      :deep(.van-circle) {
        width: 35px;
        height: 35px;
        .van-circle__hover {
          stroke: @theme;
        }
        .iconfont {
          font-size: 16px;
          color: #707171;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      > .iconfont {
        font-size: 35px;
        color: #777;
        margin-left: 20px;
      }
    }
  }
  .placeholder {
    height: 70px;
  }
}
.musicList {
  padding: 20px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    margin-bottom: 10px;
    div {
      font-size: 18px;
      color: #626466;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 18px;
        margin-right: 10px;
      }
      span {
        &:last-child {
          font-size: 17px;
          margin-left: 5px;
        }
      }
    }
    > .iconfont {
      font-size: 17px;
      color: #626466;
    }
  }
  .content {
    height: 280px;
    overflow: auto;
    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        font-size: 16px;
        p {
          color: #626466;
          width: 300px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          .iconfont {
            margin-right: 5px;
            color: @theme;
          }
        }
        > .iconfont {
          color: @theme;
        }
      }
    }
  }
  .close {
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    color: #626466;
    margin-top: 5px;
  }
}
</style>
