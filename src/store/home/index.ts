import { Module } from "vuex";

interface ModuleState {
  currentSinger: Singer | null;
}

interface RootState {
  [key: string]: any;
}

const Home: Module<ModuleState, RootState> = {
  namespaced: true,
  state: {
    currentSinger: null,
  },
  getters: {},
  mutations: {
    // setMessage(state: any, payload: string) {
    //   state.home = payload;
    // },
    setCurrentSinger(state: ModuleState, payload: Singer) {
      state.currentSinger = payload;
    },
  },
  actions: {
    setCurrentSingers({ commit }, payload: Singer) {
      commit("setCurrentSinger", payload);
    },
    // setMessages(context: any, payload: string) {
    //   context.commit("setMessage", payload);
    // },
  },
};

export default Home;
