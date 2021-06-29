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
      {{ isSinger ? "歌手" : "歌单" }}
    </div>
    <img
      v-lazy="
        isSinger
          ? singerDetail && `${singerDetail.img1v1Url}?param=300y300`
          : playlist.coverImgUrl
      "
      alt=""
    />
    <div class="btm">
      <p class="name">
        {{ isSinger ? singerDetail && singerDetail.name : playlist.name }}
      </p>
      <p class="playCount" v-if="!isSinger">
        <span class="iconfont">&#xe619; </span>
        {{ filterCount(playlist.playCount) }}
      </p>
    </div>
  </div>
  <div
    class="content"
    v-if="(playlist && playlist.tracks) || (songs && songs.length)"
  >
    <div class="contentTop">
      <span class="iconfont" @click="playAll">&#xe6ca;</span>
      <span>{{ isSinger ? "热门歌曲" : "播放全部" }}</span>
      <span
        >（共{{ isSinger ? songs.length : playlist.tracks.length }}首）</span
      >
    </div>
    <ul>
      <li
        v-for="(item, i) in isSinger ? songs : playlist.tracks"
        :key="item.id"
        @click="playMusics(item)"
      >
        <span>
          {{ i + 1 }}
        </span>
        <div>
          <p>{{ item.name }}</p>
          <p>{{ getSingerName(item.ar) }}</p>
        </div>
      </li>
    </ul>
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
import { filterCount } from "@/utils/filter";
import observer from "@/plugins/bus";

import { playMusics } from "@/utils/player";

export default defineComponent({
  name: "MusicDetail",
  setup() {
    const route = useRoute();
    const store = useStore();
    const topEl = ref(null);
    const topFixedFlag = ref(false);
    const musicDetailData = reactive({
      playlist: {},
      songs: [],
    });

    const singerDetail = computed(() => {
      return store.state.Home.currentSinger as Singer;
    });

    const isSinger = computed(() => {
      const type = route.query.type;
      return type === "singer";
    });

    onMounted(async () => {
      let id = route.query.id as string;
      let getMusicList = isSinger.value
        ? musicDetailHttp.getSingerPlayListDetail
        : musicDetailHttp.getPlayListDetail;
      let result = await getMusicList({
        id,
      });
      if (isSinger.value) {
        musicDetailData.songs = result.data.songs;
      } else {
        musicDetailData.playlist = result.data.playlist;
      }

      window.addEventListener("scroll", scroll);
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", scroll);
    });

    function scroll() {
      const maxY = (topEl.value as any).offsetHeight;
      topFixedFlag.value = window.scrollY > maxY;
    }

    function getSingerName(arr: { name: string }[]) {
      return arr.map((item) => item.name).toString();
    }

    function playAll() {
      let songArr = isSinger.value
        ? musicDetailData.songs
        : (musicDetailData.playlist as any).tracks;
      // console.log(songArr, "songArr", musicDetailData, isSinger);
      store.commit("PlayMusic/setPlayListIndex", 0);
      store.dispatch("PlayMusic/setPlayLists", {
        type: "all",
        params: songArr,
      });
      observer.$emit("playListChange");
      store.commit("PlayMusic/setPlayShow", true);
    }

    return {
      ...toRefs(musicDetailData),
      filterCount,
      getSingerName,
      singerDetail,
      isSinger,
      playMusics,
      playAll,
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
  //padding-left: 10px;
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
      &:last-child {
        color: #7a7b7a;
      }
    }
  }
  ul {
    li {
      height: 60px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e3e3e3;
      padding-left: 10px;
      &:last-child {
        border-bottom: none;
      }
      span {
        width: 30px;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100vw - 10px - 30px);
        &:first-child {
          font-size: 18px;
          color: #2d2f2d;
        }
        &:last-child {
          margin-top: 5px;
          color: #7a7b7a;
        }
      }
    }
  }
}
</style>