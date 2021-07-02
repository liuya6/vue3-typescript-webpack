import { Module } from "vuex";

import { userHttp } from "@/api";

interface ModuleState {
  userInfo: UserInfo | null;
  cookie: string;
  token: string;
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
  },
  getters: {},
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
  },
};

export default User;
