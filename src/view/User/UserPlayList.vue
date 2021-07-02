<template>
  <Header :title="'我的歌单'" />
  <ul class="playList">
    <li
      v-for="item in playlist"
      class="bd-btm"
      @click="
        $router.push({
          name: 'musicDetail',
          query: {
            id: item.id,
          },
        })
      "
    >
      <div class="imgBox">
        <img v-lazy="`${item.coverImgUrl}?param=60y60`" alt="" />
      </div>
      <div class="details">
        <p>{{ item.name }}</p>
        <p>
          <span>共{{ item.trackCount }}首</span>
          <span v-show="userName !== item.creator.nickname"
            >by:{{ item.creator.nickname }}</span
          >
        </p>
      </div>
    </li>
  </ul>
  <!--  <scroll :load="load" :refresh="refresh" :limit="limit" ref="scroll"> </scroll>-->
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  nextTick,
  ref,
} from "vue";
import { useStore } from "vuex";

import { userHttp } from "@/api";

export default defineComponent({
  name: "UserPlayList",

  setup() {
    const store = useStore();
    const scroll = ref(null);

    const state = reactive({
      // limit: 30,
      // offset: -30,
      playlist: [],
    });

    const userName = computed(() => {
      return store.state.User.userInfo.nickname;
    });

    const getPlayList = async () => {
      const params = {
        uid: store.state.User.userInfo.userId,
        // limit: state.limit,
        // offset: state.offset,
      };
      const result = await userHttp.userPlaylist(params);
      state.playlist = state.playlist.concat(result.data.playlist);
      return result.data.playlist;
    };
    getPlayList();

    // const reset = () => {
    //   state.offset = -30;
    // };
    //
    // const refresh = async () => {
    //   reset();
    //   return await load();
    // };
    //
    // const load = async () => {
    //   state.offset += state.limit;
    //   const playList = await getPlayList();
    //   await nextTick(() => {
    //     if (playList.length < state.limit) {
    //       (scroll.value as any).isFinished();
    //     }
    //   });
    //   return playList;
    // };

    return {
      // refresh,
      // load,
      ...toRefs(state),
      userName,
      scroll,
    };
  },
});
</script>

<style scoped lang="less">
.playList {
  li {
    overflow: hidden;
    height: 80px;
    display: flex;
    align-items: center;
    .imgBox {
      width: 60px;
      height: 60px;
      margin: 0 10px;
    }
    .details {
      p {
        width: calc(100vw - 80px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:first-child {
          color: #333;
          font-size: 18px;
          margin-bottom: 10px;
        }
        &:last-child {
          color: #999;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
