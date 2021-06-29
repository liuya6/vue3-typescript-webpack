<template>
  <audio
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
import { defineComponent, computed, ref, watch } from "vue";
import { useStore } from "vuex";

import observer from "@/plugins/bus";

export default defineComponent({
  name: "MusicAudio",
  setup(props, context) {
    const store = useStore();
    const playAudio = ref(null);

    const playListIndex = computed(() => {
      return store.state.PlayMusic.playListIndex;
    });

    const musicUrl = computed(() => {
      const id =
        store.state.PlayMusic.currentMusic &&
        store.state.PlayMusic.currentMusic.id;
      return `https://music.163.com/song/media/outer/url?id=${id}`;
      // return store.state.PlayMusic.currentMusicUrl.url;
    });

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
      console.log("playing");
      observer.$emit("playing");
    };

    const paused = (e: Event) => {
      console.log("paused");
      observer.$emit("paused");
    };

    const error = (e: Event) => {
      console.log("error");
      context.emit("musicError");
      // context.emit("setSongStatus", false);
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
