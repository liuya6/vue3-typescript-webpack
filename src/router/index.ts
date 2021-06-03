import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../view/Home/Home.vue"),
      children: [
        {
          path: "/",
          name: "recommend",
          component: () => import("../view/Home/components/Recommend.vue"),
        },
        {
          path: "/rank",
          name: "ranking",
          component: () => import("../view/Home/components/Ranking.vue"),
        },
        {
          path: "/singer",
          name: "singer",
          component: () => import("../view/Home/components/Singer.vue"),
        },
      ],
    },
    // {
    //   path: "/",
    //   redirect: "/home",
    // },
  ],
});

export default router;
