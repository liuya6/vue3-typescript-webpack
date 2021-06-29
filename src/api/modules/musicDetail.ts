import { http } from "@/api/axios";
import { RouteParamValue } from "vue-router";

// 获取歌单全部音乐
export function getPlayListDetail(params: { id: string | RouteParamValue[] }) {
  return http({
    method: "get",
    url: "api/playlist/detail",
    params,
    headers: {
      loading: true,
    },
  });
}

// 获取歌曲详情 /song/detail ids=1,2
export function getMusicDetail(params: { ids: string }) {
  return http({
    method: "get",
    url: "api/song/detail",
    params,
  });
}

// 获取歌手全部音乐
export function getSingerPlayListDetail(params: {
  id: string | RouteParamValue[];
}) {
  return http({
    method: "get",
    url: "api/artist/top/song",
    params,
    headers: {
      loading: true,
    },
  });
}
