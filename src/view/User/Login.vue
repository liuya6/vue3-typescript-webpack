<template>
  <Header :title="'登录'" />
  <van-tabs v-model:active="active">
    <van-tab title="手机号登录">
      <div class="telLogin">
        <van-form @submit="onSubmit">
          <van-field
            v-model="tel"
            type="tel"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ pattern: phonePattern, message: '请填写手机号' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ pattern: passwordPattern, message: '请填写密码' }]"
          />
          <div style="margin: 16px">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
        <p class="qrText">使用网易云账号登录</p>
      </div>
    </van-tab>
    <van-tab title="二维码登录">
      <div class="qr" v-if="qrUrl">
        <Qrcode :text="qrUrl" width="150" height="150" />
      </div>
      <p class="qrText">{{ qrStatusText }}</p>
      <p class="qrText">长按保存图片到相册，使用网易云音乐扫码登录</p>
    </van-tab>
  </van-tabs>
</template>

<script lang="ts">
import { Toast } from "vant";

interface telLogin {
  phone: string;
  password: string;
}

import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onUnmounted,
  computed,
} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import md5 from "js-md5";

import { userHttp } from "@/api";

export default defineComponent({
  name: "Login",

  setup() {
    const active = ref(0);
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      unikey: "",
      qrUrl: "",
      qrStatus: 0,
    });

    const phonePattern = /1\d{10}/;
    const passwordPattern = /\S\d{6,}$/;
    const phone = reactive({
      tel: "",
      password: "",
    });
    const onSubmit = async (value: telLogin) => {
      const pwd = md5(value.password).toString();
      const params = {
        phone: value.phone,
        md5_password: pwd,
      };
      const result = await userHttp.telLogin(params);
      if (result.data.code !== 200) {
        return Toast.fail(result.data.message);
      }
      store.commit("User/setCookie", result.data.cookie);
      store.commit("User/setUserInfo", result.data.profile);
      store.commit("User/setToken", result.data.token);
      await router.push("/");
    };

    let timer: any = null;
    const getQr = async () => {
      const result = await userHttp.getQrKey();
      state.unikey = result.data.data.unikey;
      const qr = await userHttp.getQrUrl({ key: state.unikey });
      state.qrUrl = qr.data.data.qrurl;
      if (!timer) {
        timer = setInterval(() => {
          checkQrStatus();
        }, 3000);
      }
      // console.log(state.qrUrl, "qrUrl");
    };

    getQr();

    const checkQrStatus = async () => {
      if (active.value === 0) return;
      const result = await userHttp.checkQrStatus({ key: state.unikey });
      if (result.data.cookie) {
        store.commit("User/setCookie", result.data.cookie);
      }
      state.qrStatus = result.data.code;
    };

    const qrStatusText = computed(() => {
      switch (state.qrStatus) {
        case 0:
          return "";
        case 800:
          return "二维码已失效";
        case 801:
          return "等待扫码中";
        case 802:
          return "等待授权中";
        case 803:
          clearTimer();
          store.dispatch("User/checkLoginStatus").then(() => {
            router.push("/");
          });
          return "授权成功";
      }
    });

    // onMounted(async () => {
    //
    // });
    onUnmounted(() => {
      clearTimer();
    });

    const clearTimer = () => {
      clearInterval(timer);
      timer = null;
    };

    return {
      active,
      ...toRefs(phone),
      ...toRefs(state),
      onSubmit,
      phonePattern,
      passwordPattern,
      qrStatusText,
    };
  },
});
</script>

<style scoped lang="less">
.telLogin {
  padding-top: 20px;
}
.qr {
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
.qrText {
  text-align: center;
  margin-top: 10px;
  color: #666;
}
</style>
