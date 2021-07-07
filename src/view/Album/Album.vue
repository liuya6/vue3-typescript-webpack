<template>
  <Header :title="`${artist.name || ''}专辑`"></Header>
  <ul class="content cl">
    <li v-for="item in list" :key="item.id" @click="getAlbum(item)">
      <div>
        <img v-lazy="`${item.picUrl}?param=110y110`" alt="" />
      </div>
      <p>{{ item.name }}</p>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

import { userHttp } from "@/api";

export default defineComponent({
  name: "Album",

  setup() {
    const route = useRoute();
    const router = useRouter();
    const id = route.query.id;
    const state = reactive({
      artist: {} as Singer | {},
      list: [] as any[],
    });

    onMounted(async () => {
      if (!id) return;
      const result = await userHttp.getSingerAlbum({ id });
      state.list = result.data.hotAlbums;
      state.artist = result.data.artist;
      console.log(state);
    });

    const getAlbum = (item: any) => {
      // console.log(item);
      // userHttp.getSingerAlbumContent({ id: item.id }).then((res) => {
      //   console.log(res);
      // });
      router.push({
        name: "musicDetail",
        query: {
          id: item.id,
          type: "album",
        },
      });
    };

    return {
      ...toRefs(state),
      getAlbum,
    };
  },
});
</script>

<style scoped lang="less">
.content {
  li {
    float: left;
    width: 110px;
    height: 140px;
    margin: 11px 0 0 11px;
    div {
      width: 110px;
      height: 110px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      line-height: 30px;
      width: 110px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
