import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../view/Home/Home.vue"),
      meta: {
        index: 1,
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
      meta: {
        index: 2,
      },
    },
    {
      path: "/search",
      name: "musicSearch",
      component: () => import("../view/MusicSearch/MusicSearch.vue"),
      meta: {
        index: 2,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../view/User/Login.vue"),
      meta: {
        index: 2,
      },
    },
    {
      path: "/list",
      name: "playList",
      component: () => import("../view/User/UserPlayList.vue"),
      meta: {
        index: 2,
      },
    },
    {
      path: "/album",
      name: "album",
      component: () => import("../view/Album/Album.vue"),
    },
  ],
});

export default router;
