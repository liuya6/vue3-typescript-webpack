import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";

import Home from "./home";
import PlayMusic from "./play";
import User from "./user";

const store = createStore({
  strict: true,
  modules: { Home, PlayMusic, User },
  plugins: [
    createLogger(),
    createPersistedState({ storage: window.sessionStorage }),
  ],
});

export default store;
