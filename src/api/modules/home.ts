import { http } from "@/api/axios";

// 首页轮播
export function getHomePage() {
  return http({
    method: "get",
    url: "api/homepage/block/page",
    headers: {
      loading: true,
    },
  });
}

// 首页推荐歌单
export function getMusicRecommend() {
  return http({
    method: "get",
    url: "api/top/playlist/highquality",
    // headers: {
    //   loading: true,
    // },
  });
}

// 排行
export function getRanking() {
  return http({
    method: "get",
    url: "api/toplist/detail",
    headers: {
      loading: true,
    },
  });
}

// 歌手
export function getSinger() {
  return http({
    method: "get",
    url: "api/top/artists",
    params: {
      limit: 100,
    },
    headers: {
      loading: true,
    },
  });
}
