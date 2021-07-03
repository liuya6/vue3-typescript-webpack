import store from "@/store";

const isLogin = () => {
  const userInfo = store.state.User.userInfo as UserInfo;
  return !!(userInfo && userInfo.userId);
};

const isLike = () => {
  const currentMusic = store.state.PlayMusic.currentMusic as MusicDetail;
  if (!isLogin() || !currentMusic) return false;
  const userLikeMusicList = store.state.User.userLikeMusicList as number[];
  return userLikeMusicList.includes(currentMusic.id);
};

export { isLogin, isLike };
