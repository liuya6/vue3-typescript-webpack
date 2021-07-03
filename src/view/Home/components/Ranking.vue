<template>
  <dl
    v-for="item in list"
    :key="item.id"
    :class="{
      notTrack: !item.tracks.length,
    }"
    @click="
      $router.push({
        name: 'musicDetail',
        query: {
          id: item.id,
        },
      })
    "
  >
    <dt>
      <img :src="`${item.coverImgUrl}?param=100y100`" alt="" />
    </dt>
    <dd v-for="(child, i) in item.tracks" :key="child.id">
      {{ `${i + 1}. ${child.first}-${child.second}` }}
    </dd>
  </dl>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
import { homeHttp } from "@/api";

export default defineComponent({
  name: "Ranking",
  setup() {
    let rankData = reactive({
      list: [],
    });

    onMounted(async () => {
      const res = await homeHttp.getRanking();
      rankData.list = res.data.list;
    });

    return {
      ...toRefs(rankData),
    };
  },
});
</script>

<style scoped lang="less">
dl {
  margin: 0 10px;
  padding: 5px 0;
  overflow: hidden;
  border-bottom: 1px solid #e1e2e2;
  font-size: 20px;
  &.notTrack {
    float: left;
    margin: 0 12px;
    > dt {
      margin: 0;
    }
  }
  &:last-child {
    border-bottom: none;
  }
  dt {
    float: left;
    width: 100px;
    height: 100px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  dd {
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
    color: #2b2b33;
    line-height: 33px;
    text-overflow: ellipsis;
  }
}
</style>
