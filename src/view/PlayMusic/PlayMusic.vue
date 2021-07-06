<template>
  <transition name="slide" mode="out-in">
    <div class="playMusic" v-show="playShow">
      <div class="background">
        <div class="filter"></div>
        <img
          :src="`${currentMusic && currentMusic.al.picUrl}?param=100y100`"
          alt=""
        />
      </div>
      <div class="top">
        <span class="iconfont" @click="playClose">&#xe682;</span>
        <div>
          <p>{{ currentMusic && currentMusic.name }}</p>
          <p>{{ currentMusicSingerName }}</p>
        </div>
      </div>
      <div class="content" @click="showLyric = !showLyric">
        <MusicLyric v-if="showLyric" :currentTime="song && song.currentTime" />
        <div v-else class="outFrame">
          <div
            class="rotate"
            :class="{
              run: song && song.songStatus,
            }"
          >
            <img
              :src="`${currentMusic && currentMusic.al.picUrl}?param=300y300`"
              alt=""
            />
          </div>
        </div>
      </div>
      <Song ref="song" />
    </div>
  </transition>
  <PlayMini
    :currentMusicSingerName="currentMusicSingerName"
    :songStatus="song && song.songStatus"
    :currentTime="song && song.currentTime"
    :duration="song && song.duration"
    :play="song && song.play"
    :playShow="playShow"
  />
</template>

<script lang="ts">
import { defineComponent, computed, watchEffect, ref, watch } from "vue";
import { useStore } from "vuex";

import { musicPlayHttp } from "@/api";
import { httpCancel } from "@/api/axios";
import Lyric from "@/utils/lyric";
import { isLogin } from "@/utils/user";

import Song from "./components/Song.vue";
import PlayMini from "./components/PlayMini.vue";
import MusicLyric from "./components/MusicLyric.vue";

export default defineComponent({
  name: "PlayMusic",

  components: {
    Song,
    PlayMini,
    MusicLyric,
  },

  setup() {
    const store = useStore();
    const song = ref(null);
    const showLyric = ref(false);

    const playShow = computed(() => {
      return store.state.PlayMusic.playShow;
    });

    const currentMusic = computed(() => {
      return store.state.PlayMusic.currentMusic as MusicDetail;
    });

    const currentMusicSingerName = computed(() => {
      // console.log(currentMusic, "currentMusic");
      return (
        currentMusic.value &&
        currentMusic.value.ar.map((item: any) => item.name).toString()
      );
    });

    const getMusic = async (id: number) => {
      if (isLogin()) {
        httpCancel.abort("api/song/url");
        const musicUrlRes = await musicPlayHttp.getMusicUrl({ id });
        store.commit("PlayMusic/setCurrentMusicUrl", musicUrlRes.data.data[0]);
      }
      if (!id) return;
      httpCancel.abort("api/lyric");
      musicPlayHttp.getMusicLyric({ id }).then((musicLyricRes) => {
        try {
          if (store.state.PlayMusic.NoLyric) {
            store.commit("PlayMusic/setNoLyric", false);
          }
          const ly: {
            lines: { time: number; txt: string }[];
          } = new Lyric(musicLyricRes.data.lrc.lyric);
          store.commit("PlayMusic/setCurrentMusicLyric", ly.lines);
        } catch (e) {
          store.commit("PlayMusic/setNoLyric", true);
        }
      });
    };

    const currentMusicId = computed(() => {
      return store.getters["PlayMusic/currentMusicId"];
    });

    watch(currentMusicId, () => {
      if (currentMusicId) {
        getMusic(currentMusicId.value);
      }
    });

    watch(
      currentMusic,
      () => {
        store.commit("PlayMusic/setCurrentMusicLyric", []);
      },
      { deep: true }
    );

    const playClose = () => {
      store.commit("PlayMusic/setPlayShow", false);
    };

    return {
      currentMusic,
      currentMusicSingerName,
      playShow,
      playClose,
      song,
      showLyric,
    };
  },
});
</script>

<style scoped lang="less">
.playMusic {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  background-color: #f2f3f4;
  overflow: hidden;
  .background {
    position: absolute;
    width: 300%;
    height: 300%;
    left: -50%;
    top: -50%;
    opacity: 0.6;
    filter: blur(20px);
    img {
      width: 100%;
      height: 100%;
    }
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0.6;
    }
  }
  .top {
    position: absolute;
    width: 100%;
    z-index: 1;
    height: 60px;
    display: flex;
    align-items: center;
    color: #fff;
    .iconfont {
      margin-left: 20px;
      font-size: 20px;
    }
    div {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      text-align: center;
      p {
        white-space: nowrap;
        width: 260px;
        text-overflow: ellipsis;
        overflow: hidden;
        &:first-child {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        &:last-child {
          font-size: 12px;
        }
      }
    }
  }

  .content {
    position: absolute;
    top: 60px;
    width: 100%;
    height: calc(100vh - 60px - 150px);
    .outFrame,
    .outFrame > div {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
    .outFrame {
      width: 300px;
      height: 300px;
      background: rgba(137, 132, 129, 0.9);
      border-radius: 50%;
      div {
        width: 280px;
        height: 280px;
        border-radius: 50%;
        overflow: hidden;
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
    }
  }
}

.slide-enter-active {
  animation: translateEnter 0.5s ease;
}

.slide-leave-active {
  animation: translateLeave 0.5s ease;
}

@keyframes translateEnter {
  0% {
    transform: translate3d(0, 100%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes translateLeave {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
