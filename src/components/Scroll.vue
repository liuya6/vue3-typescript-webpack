<template>
  <van-pull-refresh
    v-model="pullLoading"
    success-text="刷新成功"
    @refresh="onRefresh"
  >
    <van-list
      v-model:loading="listLoading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      ref="vanList"
    >
      <slot />
    </van-list>
  </van-pull-refresh>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";

export default defineComponent({
  name: "Scroll",

  props: {
    refresh: Function,
    load: Function,
    limit: Number,
  },

  setup(props) {
    const state = reactive({
      pullLoading: false,
      listLoading: false,
      finished: false,
    });

    const vanList = ref(null);

    const onRefresh = async () => {
      if (!props.refresh) return;
      const result = await props.refresh();
      state.pullLoading = false;
      (vanList.value as any).check();
      console.log(result, "onRefresh");
    };

    const onLoad = async () => {
      if (!props.load) return;
      const result: any = await props.load();
      state.listLoading = false;
      state.finished = result.length < (props.limit as number);
      // console.log(props.limit, "limit", state.finished, "state.finished");
      // console.log(result, "onLoad");
    };

    const isFinished = () => {
      state.finished = true;
    };

    const resetScroll = () => {
      state.finished = false;
    };

    return {
      ...toRefs(state),
      onRefresh,
      onLoad,
      resetScroll,
      vanList,
      isFinished,
    };
  },
});
</script>

<style scoped></style>
