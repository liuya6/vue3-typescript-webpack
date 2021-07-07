import { Module } from "vuex";

import { deepClone, randomIndex } from "@/utils/tools";
import { isLogin } from "@/utils/user";

interface ModuleState {
  currentMusic: MusicDetail | null;
  currentMusicLyric: MusicLyric[] | [];
  playShow: boolean;
  currentMusicUrl: MusicSongUrl | null;
  playType: number;
  playList: MusicDetail[] | [];
  playListIndex: number;
  NoLyric: boolean;
  playCount: number;
}

interface RootState {
  [key: string]: any;
}

const PlayMusic: Module<ModuleState, RootState> = {
  namespaced: true,
  state: {
    currentMusic: null, // 当前播放音乐信息
    currentMusicLyric: [], // 当前播放音乐歌词信息
    playShow: false, // 播放弹窗
    currentMusicUrl: null, //当前音乐url
    playType: 0, // 播放模式
    playList: [], // 播放列表
    playListIndex: 0, // 当前音乐列表播放的歌曲index
    NoLyric: false, // 判断是否有歌词（纯音乐）
    playCount: 0, // 用来判断是否继续播放下一首
  },
  getters: {
    currentMusicId: (state: ModuleState) => {
      return state.currentMusic?.id;
    },
    playListMaxIndex: (state: ModuleState) => {
      return state.playList.length - 1;
    },
  },
  mutations: {
    setCurrentMusic(state: ModuleState, payload: MusicDetail) {
      state.currentMusic = payload;
    },
    setCurrentMusicLyric(
      state: ModuleState,
      payload: { time: number; txt: string }[]
    ) {
      state.currentMusicLyric = payload;
    },
    setPlayShow(state: ModuleState, payload: boolean) {
      state.playShow = payload;
    },
    setCurrentMusicUrl(state: ModuleState, payload: MusicSongUrl) {
      state.currentMusicUrl = payload;
    },
    setPlayType(state: ModuleState, payload: number) {
      state.playType = payload;
    },
    setPlayList(state: ModuleState, payload: MusicDetail[]) {
      state.playList = payload;
    },
    setPlayListIndex(state: ModuleState, payload: number) {
      state.playListIndex = payload;
    },
    setNoLyric(state: ModuleState, payload: boolean) {
      state.NoLyric = payload;
    },
    setPlayCount(state: ModuleState, payload: number) {
      state.playCount = payload;
    },
  },
  actions: {
    setCurrentMusics({ commit }, payload: MusicDetail) {
      commit("setCurrentMusic", payload);
    },
    setPlayLists(
      { commit, state },
      payload: {
        type: "all" | "push" | "del";
        params: MusicDetail[] | MusicDetail;
      }
    ) {
      let type = payload.type;
      let result = payload.params;
      let playList = deepClone(state.playList);
      if (!isLogin()) {
        playList = playList.filter((item: MusicDetail) => item.playable);
      }
      switch (type) {
        case "all":
          break;
        case "push":
          playList.push(result);
          result = playList;
          break;
        case "del":
          let id = (result as MusicDetail).id;
          playList.filter((item: MusicDetail) => item.id !== id);
          result = playList;
          break;
        default:
          break;
      }
      commit("setPlayList", result);
    },

    setPlayListIndexS(
      { commit, state, getters },
      payload: {
        musicChange: "add" | "reduce";
        source: "auto" | "manual";
      }
    ) {
      let playIndex = deepClone(state.playListIndex);
      const playListMaxIndex = getters.playListMaxIndex;
      if (playListMaxIndex < 1) return;
      const playType = state.playType;

      switch (playType) {
        case 0:
          loopPlay();
          break;
        case 1:
          playIndex = randomIndex(playIndex, playListMaxIndex);
          break;
        case 2:
          if (payload.source === "auto") {
            if (playIndex < playListMaxIndex) {
              playIndex += 1;
            }
          } else {
            loopPlay();
          }
          break;
      }
      function loopPlay() {
        if (playIndex >= playListMaxIndex && payload.musicChange === "add") {
          playIndex = -1;
        }
        if (playIndex === 0 && payload.musicChange === "reduce") {
          playIndex = playListMaxIndex + 1;
        }
        playIndex =
          payload.musicChange === "add" ? playIndex + 1 : playIndex - 1;
      }
      commit("setPlayListIndex", playIndex);
    },
  },
};

export default PlayMusic;
