import { http } from "@/api/axios";

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
    method: "post",
    url: "api/login/status",
  });
}

// 退出登录
export function loginOut() {
  return http({
    method: "post",
    url: "api/logout",
  });
}

// 手机登录
export function telLogin(data: { phone: string; md5_password: string }) {
  return http({
    method: "post",
    url: "api/login/cellphone",
    data: {
      timerstamp: Date.now(),
      ...data,
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
