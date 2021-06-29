import store from "@/store";
import { deepClone } from "@/utils/tools";

const playMusic = (item: MusicDetail) => {
  store.dispatch("PlayMusic/setCurrentMusics", item);
  let playList = deepClone(store.state.PlayMusic.playList);
  if (playList.length) {
    new Promise((resolve) => {
      const hasMus = playList.filter(
        (playListItem: MusicDetail) => playListItem.id === item.id
      );
      if (!hasMus.length) {
        const index = store.state.PlayMusic.playListIndex;
        playList.splice(index + 1, 0, item);
      }
      store.commit("PlayMusic/setPlayList", playList);
      resolve(null);
    }).then(
      playList.forEach((playListItem: MusicDetail, i: number) => {
        if (item.id === playListItem.id) {
          store.commit("PlayMusic/setPlayListIndex", i);
        }
      })
    );
  } else {
    playList.push(item);
    store.commit("PlayMusic/setPlayList", playList);
    console.log(playList, "playList");
  }
};

const playMusics = (item: MusicDetail) => {
  playMusic(item);
  store.commit("PlayMusic/setPlayShow", true);
};

const addMusic = () => {
  store.dispatch("PlayMusic/setPlayListIndexS", {
    musicChange: "add",
    source: "manual",
  });
};

const reduceMusic = () => {
  store.dispatch("PlayMusic/setPlayListIndexS", {
    musicChange: "reduce",
    source: "manual",
  });
};

export { playMusic, playMusics, addMusic, reduceMusic };
