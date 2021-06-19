import { http } from "@/api/axios";

export function getHomePage() {
  return http({
    method: "get",
    url: "api/homepage/block/page",
  });
}

export function getMusicRecommend() {
  return http({
    method: "get",
    url: "api/top/playlist/highquality",
  });
}

export function getRanking() {
  return http({
    method: "get",
    url: "api/toplist/detail",
  });
}

export function getSinger() {
  return http({
    method: "get",
    url: "api/top/artists",
    params: {
      limit: 100,
    },
  });
}
