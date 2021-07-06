<template>
  <div class="top">
    <div class="placeholder"></div>
    <div class="topContent">
      <span class="iconfont" @click="goBack">&#xe659;</span>
      <p>
        <input
          type="text"
          placeholder="搜索歌曲，歌手"
          v-model="search"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </p>
      <span class="iconfont" v-show="search" @click="search = ''"
        >&#xe61a;</span
      >
    </div>
  </div>
  <div class="content">
    <div class="searchSuggest" v-show="suggestShow">
      <h3 class="bd-btm" @click="toSearchAny">搜索"{{ search }}"</h3>
      <dl v-for="(item, i) in suggestList" :key="i">
        <dt v-show="item.length" class="bd-btm">{{ getZn(i) }}：</dt>
        <dd
          class="bd-btm"
          v-for="(child, j) in item"
          :key="j"
          @click="toSearchAny(i, child)"
        >
          <span class="iconfont">&#xe653;</span>
          {{ child.name }}
        </dd>
      </dl>
    </div>
    <Scroll
      v-show="musicList.length"
      :load="load"
      :refresh="refresh"
      :limit="limit"
      ref="scroll"
    >
      <MusicList :musicList="musicList" />
    </Scroll>
    <SearchKey
      v-show="!musicList.length"
      :searchHot="searchHot"
      :toSearchAny="toSearchAny"
    />
  </div>
</template>

<script lang="ts">
const zn: {
  [key: string]: string;
} = {
  artists: "歌手",
  playlists: "歌单",
  songs: "歌曲",
};

import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  watch,
  ref,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { musicSearchHttp } from "@/api";
import { throttle } from "@/utils/tools";
import { playMusics } from "@/utils/player";
import observer from "@/plugins/bus";

import SearchKey from "./components/SearchKey.vue";

export default defineComponent({
  name: "MusicSearch",

  components: {
    SearchKey,
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const scroll = ref(null);
    const state = reactive({
      oldSearch: "",
      search: "",
      notRequestSuggest: false,
      showSuggest: true,
      isFocus: false,
      suggestList: {
        songs: [], // 歌曲
        playlists: [], // 歌单
        artists: [], // 艺术家
      },
      searchHot: [],
      musicList: [],
      limit: 30,
      offset: -30,
    });

    const suggestShow = computed(() => {
      return state.search && state.showSuggest;
    });

    const searchValue = computed(() => {
      return state.search;
    });

    watch(searchValue, () => {
      if (searchValue.value) {
        getSearchSuggest();
      } else {
        state.suggestList = { songs: [], playlists: [], artists: [] };
      }
    });

    const getSearchSuggest = (function () {
      const fn = async () => {
        if (!searchValue.value || state.notRequestSuggest || !state.isFocus)
          return;
        const result = await musicSearchHttp.searchSuggest({
          keywords: searchValue.value,
        });
        state.suggestList.songs = result.data.result.songs || [];
        state.suggestList.playlists = result.data.result.playlists || [];
        state.suggestList.artists = result.data.result.artists || [];
        if (!state.showSuggest) state.showSuggest = true;
      };
      return throttle(fn);
    })();

    const getZn = (value: string) => {
      return zn[value];
    };

    const refresh = async () => {
      reset();
      return await load();
    };

    const load = async () => {
      state.offset += state.limit;
      const params = {
        limit: state.limit,
        offset: state.offset,
        keywords: state.oldSearch,
      };
      const result = await musicSearchHttp.searchMusic(params);
      const songs = result.data.result.songs;
      state.notRequestSuggest = false;
      state.musicList = state.musicList.concat(songs);
      await nextTick(() => {
        if (songs.length < state.limit) {
          (scroll.value as any).isFinished();
        }
      });
      return result.data.result.songs;
    };

    const toSearchAny = (type?: string, value?: MusicDetail | string) => {
      state.notRequestSuggest = true;
      if (typeof value === "string") state.search = value;
      reset();
      switch (type) {
        case "songs":
          if (typeof value === "object") {
            state.search = state.oldSearch = value?.name;
          }
          load();
          break;
        case "playlists":
          if (typeof value === "object") {
            router.push({
              name: "musicDetail",
              query: {
                id: value?.id,
              },
            });
          }
          break;
        case "artists":
          if (typeof value === "object") {
            store.dispatch("Home/setCurrentSingers", value);
            router.push({
              name: "musicDetail",
              query: {
                id: value?.id,
                type: "singer",
              },
            });
          }
          break;
        default:
          load();
          break;
      }
      let arr = JSON.parse(window.localStorage.getItem("history") as any) || [];
      if (arr.includes(searchValue.value)) {
        let i = arr.indexOf(searchValue.value);
        arr.splice(i, 1);
      }
      arr.unshift(searchValue.value);
      observer.$emit("historyChange", arr);
      window.localStorage.setItem("history", JSON.stringify(arr));
    };

    const reset = () => {
      console.log("reset");
      state.showSuggest = false;
      state.musicList = [];
      state.offset = -30;
      state.oldSearch = state.search;
      if (scroll.value) {
        (scroll.value as any).resetScroll();
      }
    };

    const goBack = () => {
      if (state.musicList.length) {
        state.musicList = [];
        state.search = "";
      } else {
        router.back();
      }
    };

    return {
      ...toRefs(state),
      load,
      refresh,
      suggestShow,
      getZn,
      toSearchAny,
      scroll,
      playMusics,
      goBack,
    };
  },
});
</script>

<style scoped lang="less">
.top {
  .placeholder {
    height: 44px;
  }
  .topContent {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    height: 44px;
    display: flex;
    align-items: center;
    background-color: @theme;
    p {
      width: 295px;
      input {
        width: 285px;
        border: none;
        background-color: transparent;
        padding-left: 10px;
        color: #fff;
        &::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
    .iconfont {
      width: 40px;
      font-size: 20px;
      color: #fff;
      text-align: center;
    }
  }
}
.content {
  .searchSuggest {
    position: fixed;
    top: 44px;
    z-index: 1;
    width: 100%;
    height: calc(100vh - 44px - 70px);
    overflow: auto;
    background-color: #fff;
    h3 {
      line-height: 44px;
      padding-left: 20px;
      color: #507daf;
    }
    dl {
      dt,
      dd {
        line-height: 44px;
        padding-left: 20px;
      }
      dd {
        width: 350px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .iconfont {
          margin-right: 5px;
        }
      }
    }
  }
  .musicList {
    li {
      height: 60px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e3e3e3;
      padding-left: 10px;
      > span {
        width: 30px;
        font-size: 12px;
      }
      &:last-child {
        border-bottom: none;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100vw - 10px - 30px);
        &:first-child {
          font-size: 18px;
          color: #2d2f2d;
          //margin-top: 10px;
        }
        &:last-child {
          margin-top: 5px;
          color: #7a7b7a;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
