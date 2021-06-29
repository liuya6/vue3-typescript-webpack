import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../view/Home/Home.vue"),
      meta: {
        zIndex: 1,
        keepAlive: true,
      },
      children: [
        {
          path: "/",
          name: "recommend",
          component: () => import("../view/Home/components/Recommend.vue"),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "/rank",
          name: "ranking",
          component: () => import("../view/Home/components/Ranking.vue"),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: "/singer",
          name: "singer",
          component: () => import("../view/Home/components/Singer.vue"),
          meta: {
            keepAlive: true,
          },
        },
      ],
    },
    {
      path: "/detail",
      name: "musicDetail",
      component: () => import("../view/MusicDetail/MusicDetail.vue"),
    },
    {
      path: "/search",
      name: "musicSearch",
      component: () => import("../view/MusicSearch/MusicSearch.vue"),
    },
    // {
    //   path: "/",
    //   redirect: "/home",
    // },
  ],
});

export default router;
