import { http } from "@/api/axios";

// 热搜列表
export function searchHot() {
  return http({
    method: "get",
    url: "api/search/hot",
    headers: {
      loading: true,
    },
  });
}

// 搜索建议
export function searchSuggest(params: { keywords: string }) {
  return http({
    method: "get",
    url: "api/search/suggest",
    params,
  });
}

// 获取音乐url
export function searchMusic(params: {
  keywords: string;
  limit: number;
  offset: number;
}) {
  return http({
    method: "get",
    url: "api/cloudsearch",
    params,
    headers: {
      loading: true,
    },
  });
}
