import { createApp } from "vue";
import App from "./App.vue";
import "reset-css";
import "./style/index.less";
// import "./utils/rem";
import "amfe-flexible";

import router from "./router/index";
import store from "./store";

import { useVant } from "@/plugins/vant";

// import { useRouter } from "vue-router";

const app = createApp(App);
app.use(router).use(store);
useVant(app);
// app.config.globalProperties.back = function() {
//   const router = useRouter();
//   console.log(router);
//   router.back();
// };

app.mount("#app");
