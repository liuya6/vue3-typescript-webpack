<template>
  <div class="musicHeader">
    <div
      :class="{
        top: true,
        fixed: topFixedFlag,
      }"
      @click="$router.back()"
      ref="topEl"
    >
      <span class="iconfont">&#xe659; </span>
      {{ musicListData.title }}
    </div>
    <img v-lazy="musicListData.bg" alt="" />
    <div class="btm">
      <p class="name">
        {{ musicListData.tip }}
      </p>
      <p class="playCount" v-if="!isSinger && !isRecommend && !isAlbum">
        <span class="iconfont">&#xe619; </span>
        {{ filterCount(playlist.playCount) }}
      </p>
    </div>
  </div>
  <div class="content" v-if="musicListData.list && musicListData.list.length">
    <div class="contentTop">
      <span class="iconfont" @click="playAll">&#xe6ca;</span>
      <span>{{ isSinger ? "热门歌曲" : "播放全部" }}</span>
      <span class="length">（共{{ musicListData.list.length }}首）</span>
      <span class="addAll" @click="addAll">全部添加到播放列表</span>
    </div>
    <MusicList :musicList="musicListData.list" :showPlay="true" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
  computed,
  ref,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { musicDetailHttp } from "@/api";
import { userHttp } from "@/api";

import { filterCount } from "@/utils/filter";
import { mapTrackPlayableStatus } from "@/utils/track";
import observer from "@/plugins/bus";
import { deepClone } from "@/utils/tools";
import { Notify } from "vant";

interface MusicListData {
  title: string;
  tip: string;
  bg: string;
  list: MusicDetail[] | [];
}

export default defineComponent({
  name: "MusicDetail",
  setup() {
    const route = useRoute();
    const store = useStore();
    const topEl = ref(null);
    const topFixedFlag = ref(false);
    const type = computed(() => {
      return route.query.type;
    });
    const musicDetailData = reactive({
      playlist: {} as any,
      songs: [] as MusicDetail[] | [],
      recommend: [] as MusicDetail[] | [],
      album: {} as any,
    });

    const singerDetail = computed(() => {
      return store.state.Home.currentSinger as Singer;
    });

    const isSinger = computed(() => {
      return type.value === "singer";
    });

    const isRecommend = computed(() => {
      return type.value === "recommend";
    });

    const isAlbum = computed(() => {
      return type.value === "album";
    });

    onMounted(async () => {
      await getList();
      window.addEventListener("scroll", scroll);
    });

    const getList = async () => {
      let id = route.query.id as string;
      let getMusicList = isSinger.value
        ? musicDetailHttp.getSingerPlayListDetail
        : isRecommend.value
        ? userHttp.getRecommendMusic
        : isAlbum.value
        ? userHttp.getSingerAlbumContent
        : musicDetailHttp.getPlayListDetail;
      let result = await getMusicList({
        id,
      });
      if (isSinger.value) {
        musicDetailData.songs = mapTrackPlayableStatus(result.data.songs);
      } else if (isRecommend.value) {
        musicDetailData.recommend = mapTrackPlayableStatus(
          result.data.data.dailySongs
        );
      } else if (isAlbum.value) {
        let songs = mapTrackPlayableStatus(result.data.songs);
        musicDetailData.album.album = result.data.album;
        musicDetailData.album.songs = songs;
      } else {
        let playlist = result.data.playlist;
        let tracks = playlist.tracks;
        playlist.tracks = mapTrackPlayableStatus(
          tracks,
          result.data.privileges
        );
        const trackIds = playlist.trackIds as any[];
        const tracksLength = playlist.tracks.length;
        const trackIdsLength = trackIds.length;
        if (trackIdsLength > tracksLength) {
          const ids = trackIds.map((item: any) => item.id).join(",");
          musicDetailHttp.getMusicDetail({ ids }).then((res) => {
            playlist.tracks = mapTrackPlayableStatus(
              res.data.songs,
              res.data.privileges
            );
            musicListData.value = getMusicListData();
          });
        }
        musicDetailData.playlist = playlist;
      }
      // console.log(musicDetailData);
      musicListData.value = getMusicListData();
    };

    onUnmounted(() => {
      window.removeEventListener("scroll", scroll);
    });

    function scroll() {
      const maxY = (topEl.value as any).offsetHeight;
      topFixedFlag.value = window.scrollY > maxY;
    }

    function playAll() {
      let songArr = (musicListData.value as MusicListData).list;
      store.commit("PlayMusic/setPlayListIndex", 0);
      store.dispatch("PlayMusic/setPlayLists", {
        type: "all",
        params: songArr,
      });
      observer.$emit("playListChange");
      store.commit("PlayMusic/setPlayShow", true);
    }

    const addAll = () => {
      let playList = deepClone(store.state.PlayMusic.playList);
      if (playList.length) {
        let songArr = (musicListData.value as MusicListData).list;
        let filterList = songArr.filter(
          (item: MusicDetail) =>
            !playList.map((child: MusicDetail) => child.id).includes(item.id)
        );
        if (filterList.length) {
          playList = playList.concat(filterList);
          store
            .dispatch("PlayMusic/setPlayLists", {
              type: "all",
              params: playList,
            })
            .then(() => {
              return Notify({
                type: "success",
                message: "添加成功~",
              });
            });
        } else {
          return Notify({
            type: "danger",
            message: "播放列表已经有这些歌了~",
          });
        }
      } else {
        playAll();
      }
    };

    const musicListData = ref({});

    const getMusicListData = () => {
      let data: MusicListData = {
        title: "",
        tip: "",
        bg: "",
        list: [],
      };
      if (isSinger.value) {
        data.title = "歌手";
        data.tip = singerDetail.value.name;
        data.bg = `${singerDetail.value.img1v1Url}?param=375y300`;
        data.list = musicDetailData.songs;
      } else if (isRecommend.value) {
        const date = new Date();
        data.title = "每日歌单";
        data.tip = `${date.getMonth() + 1}/${date.getDate()}`;
        if (
          musicDetailData.recommend.length &&
          musicDetailData.recommend[0]["al"]
        ) {
          data.bg = `${musicDetailData.recommend[0].al.picUrl}?param=375y300`;
        }
        data.list = musicDetailData.recommend;
      } else if (isAlbum.value) {
        data.title = "专辑";
        data.tip = musicDetailData.album.album.name;
        data.bg = `${musicDetailData.album.album.picUrl}?param=375y300`;
        data.list = musicDetailData.album.songs;
      } else {
        data.title = "歌单";
        data.tip = musicDetailData.playlist.name;
        data.bg = `${musicDetailData.playlist.coverImgUrl}?param=375y300`;
        data.list = musicDetailData.playlist.tracks;
      }
      return data;
    };

    return {
      ...toRefs(musicDetailData),
      filterCount,
      singerDetail,
      isSinger,
      isRecommend,
      isAlbum,
      musicListData,
      playAll,
      addAll,
      topEl,
      topFixedFlag,
    };
  },
});
</script>

<style scoped lang="less">
.musicHeader {
  height: 300px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .top {
    width: 100%;
    font-size: 18px;
    line-height: 44px;
    padding-left: 10px;
    position: absolute;
    color: #fff;
    background-color: transparent;
    transition: 0.5s;
    .iconfont {
      color: #fff;
      margin-right: 5px;
    }
    &.fixed {
      position: fixed;
      z-index: 1;
      background-color: @theme;
      width: 100%;
    }
  }
  .btm {
    position: absolute;
    bottom: 0;
    color: #fff;
    padding: 5px 0 15px 5px;
    .name {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 5px 5px;
    }
    .playCount {
      font-size: 13px;
      margin-left: 5px;
    }
  }
}
.content {
  background-color: #f2f3f4;
  border-radius: 10px 10px 0 0;
  position: relative;
  top: -10px;
  margin-bottom: -10px;
  min-height: calc(100vh - 300px);
  .contentTop {
    line-height: 44px;
    color: #363838;
    font-size: 16px;
    border-bottom: 1px solid #e3e3e3;
    padding-left: 10px;
    .iconfont {
      font-size: 18px;
      display: inline-block;
      width: 30px;
    }
    span {
      &.length {
        color: #7a7b7a;
      }
      &.addAll {
        float: right;
        font-size: 13px;
        margin-right: 10px;
        color: #666;
      }
    }
  }
}
</style>
