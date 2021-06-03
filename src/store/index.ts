import { createStore, createLogger } from "vuex";

import Home from "./home";

const store = createStore({
  strict: true,
  modules: { Home },
  plugins: [createLogger()],
});

export default store;
