import { Module } from "vuex";

import { userHttp } from "@/api";
import { isLike } from "@/utils/user";
import { deepClone } from "@/utils/tools";
import { Toast } from "vant";

interface ModuleState {
  userInfo: UserInfo | null;
  cookie: string;
  token: string;
  userLikeMusicList: [] | number[];
  userPlaylist: [] | any[];
}

interface RootState {
  [key: string]: any;
}

const User: Module<ModuleState, RootState> = {
  namespaced: true,
  state: {
    userInfo: null,
    cookie: "",
    token: "",
    userLikeMusicList: [],
    userPlaylist: [],
  },
  getters: {
    // likeListId: (state: ModuleState) => {
    //   return state.userPlaylist.filter((item: any) => {
    //     if (!state.userInfo) return;
    //     return `${state.userInfo.nickname}喜欢的音乐` === item.name;
    //   })[0].id;
    // },
  },
  mutations: {
    setCookie(state: ModuleState, payload: string) {
      state.cookie = payload;
    },
    setUserInfo(state: ModuleState, payload: UserInfo) {
      state.userInfo = payload;
    },
    setToken(state: ModuleState, payload: string) {
      state.token = payload;
    },
    setUserLikeMusicList(state: ModuleState, payload: number[]) {
      state.userLikeMusicList = payload;
    },
    setUserPlayList(state: ModuleState, payload: any[]) {
      state.userPlaylist = payload;
    },
  },
  actions: {
    async checkLoginStatus({ commit }) {
      const result = await userHttp.checkLoginStatus();
      try {
        commit("setUserInfo", result.data.data.profile);
      } catch (e) {
        commit("setUserInfo", null);
      }
    },

    async loginOut({ commit }) {
      const result = await userHttp.loginOut();
      try {
        if (result.data.code) {
          commit("setUserInfo", null);
        }
      } catch (e) {
        throw e;
      }
    },

    async getUserLikeMusicList({ state, commit }) {
      if (!state.userInfo || state.userLikeMusicList.length) {
        return;
      }
      const result = await userHttp.userMusicLikeList({
        uid: state.userInfo.userId,
      });
      commit("setUserLikeMusicList", result.data.ids);
    },

    async setUserMusicLike({ state, commit, rootState }) {
      const currentMusic = rootState.PlayMusic.currentMusic as MusicDetail;
      const id = currentMusic.id;
      let likeList = deepClone(state.userLikeMusicList) as number[];
      if (isLike()) {
        const index = likeList.indexOf(id);
        likeList.splice(index, 1);
      } else {
        likeList.unshift(id);
      }
      await userHttp.userMusicLike({ id, like: !isLike() });
      Toast(isLike() ? "已从喜欢歌单移除" : "已添加到喜欢歌单");
      commit("setUserLikeMusicList", likeList);
    },

    async getUserPlayList({ state, commit }) {
      if (!state.userInfo) return;
      const result = await userHttp.userPlaylist({
        uid: state.userInfo.userId,
      });
      commit("setUserPlayList", result.data.playlist);
    },
  },
};

export default User;
