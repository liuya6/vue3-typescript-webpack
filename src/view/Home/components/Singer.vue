<template>
  <div class="wrapper">
    <div>
      <dl v-for="(item, i) in singerList" :key="item.id">
        <dt class="title" :type="i">
          {{ i }}
        </dt>
        <dd
          v-for="child in item"
          :key="child.id"
          class="bd-btm"
          @click="getSingerMusic(child)"
        >
          <div>
            <img v-lazy="`${child.img1v1Url}?param=80y80`" alt="" />
          </div>
          <p>{{ child.name }}</p>
        </dd>
      </dl>
    </div>
  </div>
  <div class="rightNav">
    <ul>
      <li
        v-for="(item, i) in singerList"
        :class="{ on: titleType === i }"
        :key="item.id"
        @touchstart.prevent="touchstart(i)"
        @touchmove.prevent="navScroll"
      >
        {{ i }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  nextTick,
  onDeactivated,
  onActivated,
} from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { numPinyin, getPinyin } from "@/utils/pinyin";
import { homeHttp } from "@/api";

interface SingerList {
  [key: string]: Singer[];
}

export default defineComponent({
  name: "Singer",

  setup() {
    const router = useRouter();
    const store = useStore();
    const singerData: { singerList: SingerList | {}; titleType: string } =
      reactive({
        singerList: {},
        titleType: "A",
      });

    let scrollArr: { type: string; top: number }[] = [];

    onMounted(async () => {
      const res = await homeHttp.getSinger();
      let artists: Singer[] = res.data.artists;
      let numPinyinList = Object.keys(numPinyin);
      artists.map((item: Singer) => {
        let py = getPinyin.chineseToPinYin(item.name[0]).charAt(0);
        if (numPinyinList.indexOf(py) >= 0) {
          item.initial = numPinyin[py];
        } else {
          item.initial = py.toUpperCase();
        }
      });
      singerData.singerList = setList(artists);
      await nextTick(() => {
        getScrollTop();
      });
    });

    onActivated(() => {
      nextTick(() => {
        window.addEventListener("scroll", windowScroll);
      });
    });

    onDeactivated(() => {
      window.removeEventListener("scroll", windowScroll);
    });

    function setList(list: Singer[]): SingerList {
      let obj: SingerList = {};
      let arr: string[] = [];
      list.forEach((item: Singer) => {
        arr.indexOf(item.initial) < 0 && arr.push(item.initial);
      });
      arr.sort().forEach((item) => {
        obj[item] = [];
      });
      list.forEach((item: Singer) => {
        if (obj.hasOwnProperty(item.initial)) {
          obj[item.initial].push(item);
        }
      });
      return obj;
    }

    function getScrollTop() {
      let initialTop = 0;
      let titleList = document.querySelectorAll(".title");
      titleList.forEach((item, i) => {
        let type = item.getAttribute("type") as string;
        let scrollDetail = item.getBoundingClientRect();
        if (i === 0) {
          initialTop = scrollDetail.top;
        }
        let scrollTopItem = {
          type: type,
          top: scrollDetail.top - initialTop,
        };
        scrollArr.push(scrollTopItem);
      });
    }

    function windowScroll() {
      let typeArr: string[] = [];
      scrollArr.forEach((item) => {
        if (window.scrollY >= item.top - 1) {
          typeArr.push(item.type);
        }
      });
      singerData.titleType = typeArr.pop() as string;
    }

    let liHeight = 0;
    let startY = 0;
    let endY = 0;
    let startCount = 0;
    let top: number = 0;

    function touchstart(key: string, e: TouchEvent) {
      e = window.event as TouchEvent;
      let clientRect = e["touches"][0];
      startY = clientRect.clientY;
      let li = e.target as HTMLDataElement;
      liHeight = li.offsetHeight;
      scrollArr.forEach((item, index) => {
        if (item.type === key) {
          startCount = index;
          top = item.top;
        }
      });
      window.scrollTo(0, top);
    }

    function navScroll(e: TouchEvent) {
      let clientRect = e["touches"][0];
      endY = clientRect.clientY;
      let moveCount = (endY - startY) / liHeight;
      let resultCount = Math.floor(startCount + moveCount);
      scrollArr.forEach((item, index) => {
        if (index === resultCount) {
          top = item.top;
        }
      });
      window.scrollTo(0, top);
    }

    function getSingerMusic(params: Singer) {
      store.dispatch("Home/setCurrentSingers", params);
      router.push({
        name: "musicDetail",
        query: {
          id: params.id,
          type: "singer",
        },
      });
    }

    return {
      ...toRefs(singerData),
      touchstart,
      navScroll,
      getSingerMusic,
    };
  },
});
</script>

<style scoped lang="less">
.wrapper {
  transform: translate3d(0, 0, 0);
  dl {
    dt {
      line-height: 20px;
      font-size: 14px;
      background-color: #d9dadb;
      color: #fff;
      padding-left: 10px;
    }
    dd {
      height: 80px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      //border-bottom: 1px solid #ccc;
      margin: 0 5px;
      &:last-child {
        border-bottom: none;
      }
      //justify-content: center;
      div {
        width: 60px;
        height: 60px;
        border-radius: 6px;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      p {
        font-size: 20px;
        padding-left: 20px;
      }
    }
  }
}
.rightNav {
  position: fixed;
  width: 20px;
  right: 0;
  top: 50%;
  transform: translate(0, -45%);
  z-index: 2;
  ul {
    position: relative;
    z-index: 2;
    li {
      line-height: 20px;
      text-align: center;
      font-size: 13px;
      &.on {
        color: @theme;
      }
    }
  }
}
</style>
