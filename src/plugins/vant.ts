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
    .use(List);
}
