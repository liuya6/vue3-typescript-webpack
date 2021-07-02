import store from "@/store";

const isLogin = () => {
  const userInfo = store.state.User.userInfo;
  return !!(userInfo && userInfo.nickname);
};

export { isLogin };
