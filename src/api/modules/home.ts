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
