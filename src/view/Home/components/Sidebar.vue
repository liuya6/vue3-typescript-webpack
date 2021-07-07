<template>
  <van-popup v-model:show="showFlag" position="left">
    <div class="sContent">
      <div class="bd-btm" @click="toLogin">
        <p v-if="isLogins">
          <img :src="userInfo.avatarUrl" alt="" />
          <span>{{ userInfo.nickname }}</span>
        </p>
        <p v-else>请登录</p>
      </div>
      <div
        v-show="isLogins"
        class="bd-btm"
        @click="
          $router.push({
            name: 'playList',
          })
        "
      >
        我的歌单
      </div>
      <div
        v-show="isLogins"
        class="bd-btm"
        @click="
          $router.push({
            name: 'musicDetail',
            query: {
              type: 'recommend',
            },
          })
        "
      >
        今日推荐
      </div>
      <div
        class="bd-btm"
        @click="
          $router.push({
            name: 'album',
            query: {
              id: 6452,
            },
          })
        "
      >
        杰伦永远的神~
      </div>
      <div v-show="isLogins" @click="loginOut">退出账号</div>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Dialog } from "vant";

import { isLogin } from "@/utils/user";

export default defineComponent({
  name: "Sidebar",

  setup() {
    const router = useRouter();
    const store = useStore();

    let showFlag = ref(false);

    const show = () => {
      showFlag.value = true;
    };

    const hidden = () => {
      showFlag.value = false;
    };

    const isLogins = computed(() => {
      return isLogin();
    });

    const toLogin = () => {
      if (!isLogins.value) {
        router.push({
          name: "login",
        });
      }
    };

    const userInfo = computed(() => {
      return store.state.User.userInfo;
    });

    const loginOut = () => {
      Dialog.confirm({
        title: "退出",
        message: "确定退出账号吗？",
      }).then(() => {
        store.dispatch("User/loginOut");
      });
    };

    return {
      showFlag,
      show,
      hidden,
      toLogin,
      isLogins,
      userInfo,
      loginOut,
    };
  },
});
</script>

<style scoped lang="less">
.sContent {
  width: 200px;
  min-height: 100vh;
  div {
    line-height: 44px;
    padding-left: 10px;
    p {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      span {
        margin-left: 5px;
      }
    }
  }
}
</style>
