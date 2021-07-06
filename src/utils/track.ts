import { isLogin } from "@/utils/user";
import store from "@/store";

export function isTrackPlayable(track: MusicDetail) {
  let result = {
    playable: true,
    reason: "",
  };
  // cloud storage judgement logic
  if (isLogin() && track?.privilege?.cs) {
    return result;
  }
  if (track.fee === 1 || track.privilege?.fee === 1) {
    if (isLogin() && store.state.User.userInfo.vipType === 11) {
      result.playable = true;
    } else {
      result.playable = false;
      result.reason = "VIP Only";
    }
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false;
    result.reason = "付费专辑";
  } else if (
    track.noCopyrightRcmd !== null &&
    track.noCopyrightRcmd !== undefined
  ) {
    result.playable = false;
    result.reason = "无版权";
  } else if (track.privilege?.st < 0 && isLogin()) {
    result.playable = false;
    result.reason = "已下架";
  }
  return result;
}

export function mapTrackPlayableStatus(
  tracks: MusicDetail[],
  privileges?: any[]
) {
  if (tracks?.length === undefined) return tracks;
  return tracks.map((t: MusicDetail) => {
    if (privileges) {
      const privilege = privileges.find((item: any) => item.id === t.id) || {};
      if (t.privilege) {
        Object.assign(t.privilege, privilege);
      } else {
        t.privilege = privilege;
      }
    }
    let result = isTrackPlayable(t);
    t.playable = result.playable;
    t.reason = result.reason;
    return t;
  });
}
