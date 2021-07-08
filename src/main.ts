import { createApp } from "vue";
import App from "./App.vue";
import "reset-css";
import "./style/index.less";
import "amfe-flexible";

import router from "./router/index";
import store from "./store";

import { useVant } from "@/plugins/vant";

import Scroll from "@/components/Scroll.vue";
import Header from "@/components/Header.vue";
import Qrcode from "@/components/Qrcode.vue";
import MusicList from "@/components/MusicList.vue";

const app = createApp(App);
app.use(router).use(store);
useVant(app);

app.component(Scroll.name, Scroll);
app.component(Header.name, Header);
app.component(Qrcode.name, Qrcode);
app.component(MusicList.name, MusicList);

app.config.globalProperties.back = function () {
  router.back();
};

app.mount("#app");
