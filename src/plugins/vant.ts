import {
  Swipe,
  SwipeItem,
  Lazyload,
  Toast,
  Slider,
  Circle,
  Popup,
  PullRefresh,
  List,
  Tab,
  Tabs,
  Field,
  Form,
  Button,
  Notify,
} from "vant";
import { App } from "vue";

export function useVant(app: App) {
  app
    .use(Swipe)
    .use(SwipeItem)
    .use(Lazyload)
    .use(Toast)
    .use(Slider)
    .use(Circle)
    .use(Popup)
    .use(PullRefresh)
    .use(List)
    .use(Tabs)
    .use(Tab)
    .use(Field)
    .use(Form)
    .use(Button)
    .use(Notify);
}
