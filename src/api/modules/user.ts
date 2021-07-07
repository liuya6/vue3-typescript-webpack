import { http } from "@/api/axios";
import { LocationQueryValue } from "vue-router";

// 获取二维码的key
export function getQrKey() {
  return http({
    method: "post",
    url: "api/login/qr/key",
  });
}

// 获取二维码图片
export function getQrUrl(data: { key: string }) {
  return http({
    method: "post",
    url: `api/login/qr/create?key=${data.key}&timerstamp=${Date.now()}`,
  });
}

// 二维码扫描状态接口
// 说明: 轮询此接口可获取二维码扫码状态,800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功(803状态码下会返回cookies)
export function checkQrStatus(data: { key: string }) {
  return http({
    method: "post",
    url: `api/login/qr/check?key=${data.key}&timerstamp=${Date.now()}`,
  });
}

// 检查登录状态
export function checkLoginStatus() {
  return http({
    method: "get",
    url: "api/login/status",
    params: {
      timerstamp: Date.now(),
    },
  });
}

// 退出登录
export function loginOut() {
  return http({
    method: "get",
    url: "api/logout",
    params: {
      timerstamp: Date.now(),
    },
  });
}

// 手机登录
export function telLogin(params: { phone: string; md5_password: string }) {
  return http({
    method: "get",
    url: "api/login/cellphone",
    params: {
      timerstamp: Date.now(),
      ...params,
    },
    headers: {
      loading: true,
    },
  });
}

// 用户歌单 /user/playlist
export function userPlaylist(data: { uid: number }) {
  return http({
    method: "post",
    url: "api/user/playlist",
    data: {
      timerstamp: Date.now(),
      ...data,
    },
    headers: {
      loading: true,
    },
  });
}

// 音乐喜欢
export function userMusicLike(params: { id: number; like: boolean }) {
  return http({
    method: "get",
    url: "api/like",
    params: {
      timerstamp: Date.now(),
      ...params,
    },
    headers: {
      loading: true,
    },
  });
}

// 对歌单添加或删除歌曲 op pid歌单id tracks 歌曲id可用逗号分开
export function playlistTracks(data: {
  op: "add" | "del";
  pid: number;
  tracks: string;
}) {
  return http({
    method: "post",
    url: "api/playlist/tracks",
    data: {
      timerstamp: Date.now(),
      ...data,
    },
  });
}

// 音乐喜欢列表
export function userMusicLikeList(data: { uid: number }) {
  return http({
    method: "post",
    url: "api/likelist",
    data: {
      timerstamp: Date.now(),
      ...data,
    },
  });
}

// 获取每日推荐歌曲 需登录
export function getRecommendMusic() {
  return http({
    method: "post",
    url: "api/recommend/songs",
    headers: {
      loading: true,
    },
  });
}

// 获取歌手专辑
export function getSingerAlbum(data: { id: string | LocationQueryValue[] }) {
  return http({
    method: "post",
    url: "api/artist/album",
    data: {
      limit: 50,
      ...data,
    },
    headers: {
      loading: true,
    },
  });
}

// 获取专辑内容 /album
export function getSingerAlbumContent(params: {
  id: string | LocationQueryValue[];
}) {
  return http({
    method: "get",
    url: "api/album",
    params: {
      timerstamp: Date.now(),
      ...params,
    },
    headers: {
      loading: true,
    },
  });
}
