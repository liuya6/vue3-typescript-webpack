const Home = {
  state: {
    message: "home",
  },
  getters: {},
  mutations: {
    setMessage(state: any, payload: string) {
      state.home = payload;
    },
  },
  actions: {
    setMessages(context: any, payload: string) {
      context.commit("setMessage", payload);
    },
  },
};

export default Home;
