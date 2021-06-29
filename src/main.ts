import { createApp } from "vue";
import App from "./App.vue";
import "reset-css";
import "./style/index.less";
import "amfe-flexible";

import router from "./router/index";
import store from "./store";

import { useVant } from "@/plugins/vant";

import Scroll from "@/components/Scroll.vue";

const app = createApp(App);
app.use(router).use(store);
useVant(app);

app.component(Scroll.name, Scroll);

app.config.globalProperties.back = function () {
  router.back();
};

app.mount("#app");
