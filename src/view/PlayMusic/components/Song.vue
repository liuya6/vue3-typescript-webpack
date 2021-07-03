<template>
  <div class="song">
    <div class="songSlider">
      <span>{{ format(currentTime) }}</span>
      <van-slider
        v-model="currentTime"
        @change="onChange"
        :max="duration"
        @drag-start="dragStart"
        @drag-end="dragEnd"
      >
        <template #button>
          <div class="songSliderButton"></div>
        </template>
      </van-slider>
      <span>{{ format(duration) }}</span>
    </div>
    <p>
      <span class="iconfont" @click="changePlay">{{
        playType === 0 ? "&#xe60a;" : playType === 1 ? "&#xe6a0;" : "&#xe6a1;"
      }}</span>
      <span class="iconfont" @click="reduceMusic">&#xe78a;</span>
      <span class="iconfont play" @click="play">{{
        songStatus ? "&#xe60f;" : "&#xe6ca;"
      }}</span>
      <span class="iconfont" @click="addMusic">&#xe7a5;</span>
      <span class="iconfont" @click="like" :class="isLike() && 'like'">{{
        isLike() ? "&#xe622;" : "&#xe79e;"
      }}</span>
    </p>
    <MusicAudio
      @currentTimeChange="currentTimeChanges"
      @durationChange="durationChanges"
      @setSongStatus="getSongStatus"
      @musicEnd="musicEnds"
      @musicError="musicEnds"
      ref="musicAudio"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import MusicAudio from "@/components/MusicAudio.vue";
import { addMusic, reduceMusic } from "@/utils/player";
import { isLogin, isLike } from "@/utils/user";
import { Toast } from "vant";

export default defineComponent({
  name: "Song",
  components: {
    MusicAudio,
  },

  setup() {
    const store = useStore();

    const router = useRouter();

    const duration = ref(0);
    const currentTime = ref(0);
    const songStatus = ref(false);
    const musicAudio = ref(null);
    const isMove = ref(false);

    const playType = computed(() => {
      return store.state.PlayMusic.playType;
    });
    // const el = getCurrentInstance();

    const onChange = (value: number) => {
      (musicAudio.value as any).setCurrentTime(value);
      (musicAudio.value as any).play();
      currentTime.value = value;
    };

    const durationChanges = (value: number) => {
      duration.value = value;
    };

    const currentTimeChanges = (value: number) => {
      if (!isMove.value) {
        currentTime.value = value;
      }
    };

    const format = (interval: number) => {
      interval = interval | 0;
      let minute: number | string = (interval / 60) | 0;
      let second: number | string = interval % 60;
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    };

    const getSongStatus = (value: boolean) => {
      songStatus.value = value;
    };

    const play = () => {
      songStatus.value = !songStatus.value;
      if (songStatus.value) {
        (musicAudio.value as any).play();
      } else {
        (musicAudio.value as any).pause();
      }
    };

    const dragStart = () => {
      isMove.value = true;
    };

    const dragEnd = () => {
      isMove.value = false;
    };

    const changePlay = () => {
      let num = playType.value;
      if (num >= 2) {
        num = -1;
      }
      store.commit("PlayMusic/setPlayType", ++num);
    };

    const musicEnds = () => {
      //音乐结束
      songStatus.value = false;
      store.dispatch("PlayMusic/setPlayListIndexS", {
        musicChange: "add",
        source: "auto",
      });
    };

    const like = () => {
      if (!isLogin()) {
        store.commit("PlayMusic/setPlayShow", false);
        Toast("请先登录~");
        return router.push({ name: "login" });
      }
      store.dispatch("User/setUserMusicLike");
    };

    return {
      duration,
      currentTime,
      songStatus,
      format,
      onChange,
      durationChanges,
      currentTimeChanges,
      play,
      getSongStatus,
      musicAudio,
      dragStart,
      dragEnd,
      changePlay,
      playType,
      musicEnds,
      addMusic,
      reduceMusic,
      like,
      isLike,
    };
  },
});
</script>

<style scoped lang="less">
.song {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 50px;
  .songSlider {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    > span {
      font-size: 10px;
      color: #fff;
      display: inline-block;
      width: 30px;
      text-align: center;
    }
    /deep/ .van-slider {
      width: 260px;
      margin: 0 15px;
      .van-slider__bar {
        background-color: @theme;
      }
    }
    .songSliderButton {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #fff;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 5px;
        height: 5px;
        background-color: @theme;
        border-radius: 50%;
      }
    }
  }
  > p {
    display: flex;
    align-items: center;
    height: 55px;
    justify-content: space-around;
    padding: 0 15px;

    .iconfont {
      font-size: 30px;
      color: #fff;
      &.like {
        color: @theme;
      }
      &.play {
        font-size: 50px;
      }
    }
  }
}
</style>
