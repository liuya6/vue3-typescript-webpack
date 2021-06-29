<template>
  <div class="searchKey">
    <dl class="hot">
      <dt>热门搜索</dt>
      <dd
        v-for="(item, i) in searchHot"
        :key="i"
        @click="toSearchAny(null, item.first)"
      >
        {{ item.first }}
      </dd>
    </dl>
    <dl class="history" v-show="history.length">
      <dt>搜索历史</dt>
      <dd class="bd-btm" v-for="(item, i) in history" :key="i">
        <div @click="toSearchAny(null, item)">
          <span class="iconfont">&#xe64b;</span>
          <span>{{ item }}</span>
        </div>
        <span class="iconfont" @click.stop="clearHistory(i)">&#xe61a;</span>
      </dd>
    </dl>
    <p class="clear" v-show="history.length">
      <span @click="clearHistory">清除所有记录</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";

import { musicSearch } from "@/api";
import { deepClone } from "@/utils/tools";
import observer from "@/plugins/bus";

export default defineComponent({
  name: "SearchKey",

  props: {
    toSearchAny: Function,
  },

  setup() {
    const state = reactive({
      searchHot: [],
      history: [],
    });

    onMounted(async () => {
      const result = await musicSearch.searchHot();
      state.searchHot = result.data.result.hots;
      if (window.localStorage.getItem("history")) {
        state.history = JSON.parse(
          window.localStorage.getItem("history") as string
        );
      }
      observer.$on("historyChange", (arr: string[]) => {
        console.log("arr->", arr);
        (state.history as string[]) = arr;
      });
    });

    const clearHistory = (i?: number) => {
      if (typeof i === "number") {
        const his = deepClone(state.history);
        his.splice(i, 1);
        state.history.splice(i, 1);
        window.localStorage.setItem("history", JSON.stringify(his));
      } else {
        state.history = [];
        window.localStorage.setItem("history", JSON.stringify([]));
      }
    };

    return {
      ...toRefs(state),
      clearHistory,
    };
  },
});
</script>

<style scoped lang="less">
.searchKey {
  padding: 20px 10px 10px 10px;
  .hot {
    overflow: hidden;
    dt {
      margin-bottom: 15px;
      color: #848484;
    }
    dd {
      float: left;
      padding: 5px 5px;
      border: 1px solid #ccc;
      border-radius: 3px;
      margin: 0 10px 10px 0;
      color: #555;
    }
  }
  .history {
    padding-top: 20px;
    dt {
      margin-bottom: 15px;
      color: #848484;
    }
    dd {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      color: #666;
      div {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: calc(100vw - 50px);
        .iconfont {
          margin-right: 5px;
        }
      }
    }
  }
  .clear {
    text-align: center;
    margin-top: 20px;
    color: #666666;
  }
}
</style>
