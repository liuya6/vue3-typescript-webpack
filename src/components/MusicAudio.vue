<template>
  <audio
    v-if="musicUrl"
    :src="musicUrl"
    autoplay
    ref="playAudio"
    @canplay="ready"
    @error="error"
    @timeupdate="updateTime"
    @ended="songEnded"
    @playing="playing"
    @pause="paused"
  ></audio>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";

import observer from "@/plugins/bus";
import { isLogin } from "@/utils/user";
import { Notify } from "vant";

export default defineComponent({
  name: "MusicAudio",
  setup(props, context) {
    const store = useStore();
    const playAudio = ref(null);

    const playListIndex = computed(() => {
      return store.state.PlayMusic.playListIndex;
    });

    const playCount = computed(() => {
      return store.state.PlayMusic.playCount;
    });

    const musicUrl = computed(() => {
      if (isLogin()) {
        return (
          (store.state.PlayMusic.currentMusicUrl &&
            store.state.PlayMusic.currentMusicUrl.url) ||
          null
        );
      } else {
        const id =
          store.state.PlayMusic.currentMusic &&
          store.state.PlayMusic.currentMusic.id;
        if (!id) return "";
        return `https://music.163.com/song/media/outer/url?id=${id}`;
      }
    });

    // watch(musicUrl, () => {
    //   if (!musicUrl.value) {
    //     const playList = store.state.PlayMusic.playList;
    //     if (!playList.length) return;
    //     store.dispatch("PlayMusic/setPlayListIndexS", {
    //       musicChange: "add",
    //       source: "auto",
    //     });
    //   }
    // });

    const currentMusicChange = () => {
      const currentMusic = store.state.PlayMusic.playList[playListIndex.value];
      if (currentMusic) {
        store.dispatch("PlayMusic/setCurrentMusics", currentMusic);
      }
    };

    watch(playListIndex, () => {
      console.log(playListIndex.value, "playListIndex");
      currentMusicChange();
    });

    const ready = (e: Event) => {
      console.log("ready");
      const audio = e.target as HTMLAudioElement;
      context.emit("durationChange", audio.duration);
      context.emit("setSongStatus", true);
    };

    const playing = (e: Event) => {
      if (playCount.value > 0) store.commit("PlayMusic/setPlayCount", 0);
      if (store.state.PlayMusic.currentMusic) {
        const { name, ar } = store.state.PlayMusic.currentMusic as MusicDetail;
        const author = ar.map((item) => item.name).join(",");
        document.title = `${name}-${author}`;
      }
    };

    const paused = (e: Event) => {
      console.log("paused");
      document.title = "摇起来";
    };

    const error = (e: Event) => {
      console.log("error");
      console.log(playCount.value + 1);
      store.commit("PlayMusic/setPlayCount", playCount.value + 1);
      context.emit("musicError");
      return Notify({
        type: "danger",
        message: "资源走丢了，已切换到下一首~",
      });
    };

    const updateTime = (e: Event) => {
      const audio = e.target as HTMLAudioElement;
      context.emit("currentTimeChange", audio.currentTime);
    };

    const songEnded = () => {
      console.log("musicEnd");
      context.emit("musicEnd");
    };

    const play = () => {
      const audio = playAudio.value as HTMLAudioElement | null;
      if (audio) {
        audio.play();
      }
    };

    const pause = () => {
      const audio = playAudio.value as HTMLAudioElement | null;
      if (audio) {
        audio.pause();
      }
    };

    const setCurrentTime = (value: number) => {
      const audio = playAudio.value as HTMLAudioElement | null;
      if (audio) {
        audio.currentTime = value;
      }
    };

    observer.$on("playListChange", currentMusicChange);

    return {
      musicUrl,
      playAudio,
      ready,
      playing,
      paused,
      error,
      updateTime,
      play,
      pause,
      setCurrentTime,
      songEnded,
    };
  },
});
</script>

<style scoped lang="less"></style>
