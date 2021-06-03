import { Swipe, SwipeItem, Lazyload } from "vant";
import { App } from "vue";

export function useVant(app: App) {
  app.use(Swipe).use(SwipeItem).use(Lazyload);
}
