<template>
  <div class="wrapper">
    <div>
      <dl v-for="(item, i) in singerList" :key="item.id">
        <dt class="title" :type="i">{{ i }}</dt>
        <dd v-for="child in item">
          <div>
            <img v-lazy="child.img1v1Url" alt="" />
          </div>
          <p>{{ child.name }}</p>
        </dd>
      </dl>
    </div>
  </div>
  <div class="rightNav">
    <ul>
      <li v-for="(item, i) in singerList" :key="item.id" @click="navScroll(i)">
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
  ref,
} from "vue";
import numPinyin from "@/utils/pinyin";
import { singer } from "../type";
import { homeHttp } from "@/api/index";
const pinyin = require("pinyin");

interface SingerList {
  [key: string]: singer[];
}

export default defineComponent({
  name: "Singer",

  setup() {
    let singerData: { singerList: SingerList | {} } = reactive({
      singerList: {},
    });

    let scrollArr: { type: string; top: number }[] = [];

    onMounted(async () => {
      const res = await homeHttp.getSinger();
      let artists: singer[] = res.data.artists;
      let numPinyinList = Object.keys(numPinyin);
      artists.map((item: singer) => {
        let py = pinyin(item.name[0], {
          style: pinyin.STYLE_FIRST_LETTER,
        })[0][0];
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

    function setList(list: singer[]): SingerList {
      let obj: SingerList = {};
      let arr: string[] = [];
      list.forEach((item: singer) => {
        arr.indexOf(item.initial) < 0 && arr.push(item.initial);
      });
      arr.sort().forEach((item) => {
        obj[item] = [];
      });
      list.forEach((item: singer) => {
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

      // scrollToView();
      // window.addEventListener("scroll", function () {
      //   console.log(111);
      // });
      // window.scrollTo(0, 1000);
    }

    function navScroll(type: string) {
      let top: number = 0;
      scrollArr.forEach((item) => {
        if (item.type === type) {
          top = item.top;
        }
      });
      window.scrollTo(0, top);
    }

    return {
      ...toRefs(singerData),
      navScroll,
    };
  },
});
</script>

<style scoped lang="less">
.wrapper {
  height: calc(100vh - 88px);
  position: relative;
  z-index: 0;
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
      border-bottom: 1px solid #ccc;
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
  right: 5px;
  top: 50%;
  transform: translate(0, -45%);
  ul {
    li {
      line-height: 20px;
      text-align: center;
      font-size: 13px;
    }
  }
}
</style>
