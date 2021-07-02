<template>
  <div class="banner">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in banners">
        <img :src="`${item.pic}?param=357y150`" alt="" />
      </van-swipe-item>
    </van-swipe>
  </div>
  <div class="content">
    <h1>推荐歌单</h1>
    <ul>
      <li
        v-for="item in playlists"
        :key="item.id"
        @click="
          $router.push({
            name: 'musicDetail',
            query: {
              id: item.id,
            },
          })
        "
      >
        <div>
          <img v-lazy="`${item.coverImgUrl}?param=200y200`" alt="" />
          <p>
            <span class="iconfont">&#xe619;</span
            >{{ filterCount(item.playCount) }}
          </p>
        </div>
        <p>{{ item.name }}</p>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { homeHttp } from "@/api";
import { onMounted, reactive, toRefs, defineComponent } from "vue";
import { filterCount } from "@/utils/filter";
export default defineComponent({
  name: "Recommend",
  setup() {
    let homeData = reactive({
      banners: [],
      playlists: [],
    });

    onMounted(async () => {
      const res = await homeHttp.getHomePage();
      const recommendData = await homeHttp.getMusicRecommend();
      homeData.banners = res.data.data["blocks"][0]["extInfo"]["banners"];
      homeData.playlists = recommendData.data["playlists"];
      // console.log(homeData);
    });

    return {
      ...toRefs(homeData),
      filterCount,
    };
  },
});
</script>

<style scoped lang="less">
.banner {
  background-image: linear-gradient(#c44f41 85%, transparent 0%);
  display: flex;
  justify-content: center;
  .van-swipe {
    height: 150px;
    width: 95%;
    border-radius: 5px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.content {
  overflow: hidden;
  h1 {
    font-size: 16px;
    margin: 10px 0 20px 10px;
  }
  ul {
    overflow: hidden;
    li {
      float: left;
      width: 115px;
      margin-left: 7.5px;
      font-size: 12px;
      .iconfont {
        font-size: 12px;
      }
      div {
        width: 100%;
        height: 115px;
        background-color: #888;
        border-radius: 5px;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }
        p {
          position: absolute;
          right: 5px;
          top: 5px;
          color: #efeff0;
        }
      }
      > p {
        color: #4c4c4c;
        margin: 10px 0;
        font-size: 12px;
        min-height: 38px;
      }
    }
  }
}
</style>
