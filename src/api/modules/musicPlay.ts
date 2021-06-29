import { http } from "@/api/axios";
import { RouteParamValue } from "vue-router";

// 获取音乐url
export function getMusicUrl(params: { id: number | RouteParamValue }) {
  return http({
    method: "get",
    url: "api/song/url",
    params,
    headers: {
      loading: true,
    },
  });
}

// 获取音乐歌词 /lyric
export function getMusicLyric(params: { id: number | RouteParamValue }) {
  return http({
    method: "get",
    url: "api/lyric",
    params,
  });
}
