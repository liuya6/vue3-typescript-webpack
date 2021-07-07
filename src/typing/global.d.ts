declare global {
  // 歌手
  interface Singer {
    accountId?: null;
    albumSize?: number;
    alg?: null;
    alias: string[];
    briefDesc?: string;
    fansCount?: null;
    followed?: boolean;
    id?: number;
    identifyTag?: null;
    img1v1Id?: number;
    img1v1Id_str?: string;
    img1v1Url: string;
    isSubed?: null;
    musicSize?: number;
    mvSize?: null;
    name: string;
    picId?: number;
    picId_str?: string;
    picUrl?: string;
    publishTime?: null;
    showPrivateMsg?: null;
    topicPerson?: number;
    trans?: string;
    transNames?: null;
    initial: string;
  }

  // 音乐详情
  interface MusicDetail {
    a: null;
    al: {
      id: number;
      name: string;
      pic: number;
      picUrl: string;
      pic_str: string;
      tns: any[];
    };
    alia: string[];
    ar: { alias: any[]; id: number; name: string; tns: any[] }[];
    cd: string;
    cf: string;
    copyright: number;
    cp: number;
    crbt: null;
    djId: number;
    dt: number;
    fee: number;
    ftype: number;
    h: object;
    id: number;
    l: object;
    m: object;
    mark: number;
    mst: number;
    mv: number;
    name: string;
    no: number;
    noCopyrightRcmd: null;
    originCoverType: number;
    originSongSimpleData: null;
    pop: number;
    privilege: {
      chargeInfoList: {
        rate: number;
        chargeUrl: null;
        chargeMessage: null;
        chargeType: number;
      }[];
      cp: number;
      cs: boolean;
      dl: number;
      downloadMaxbr: number;
      fee: number;
      fl: number;
      flag: number;
      freeTrialPrivilege: { resConsumable: boolean; userConsumable: boolean };
      id: number;
      maxbr: number;
      payed: number;
      pl: number;
      playMaxbr: number;
      preSell: boolean;
      rscl: null;
      sp: number;
      st: number;
      subp: number;
      toast: boolean;
    };
    pst: number;
    publishTime: number;
    resourceState: boolean;
    rt: string;
    rtUrl: null;
    rtUrls: any[];
    rtype: number;
    rurl: null;
    s_id: number;
    single: number;
    st: number;
    t: number;
    v: number;
    playable?: boolean;
    reason?: string;
  }

  // 音乐url
  interface MusicSongUrl {
    br: number;
    canExtend: boolean;
    code: number;
    encodeType: null;
    expi: number;
    fee: number;
    flag: number;
    freeTimeTrialPrivilege: {
      resConsumable: boolean;
      userConsumable: boolean;
      type: number;
      remainTime: number;
    };
    freeTrialInfo: null;
    freeTrialPrivilege: { resConsumable: boolean; userConsumable: boolean };
    gain: number;
    id: number;
    level: null;
    md5: string;
    payed: number;
    size: number;
    type: string;
    uf: null;
    url: string;
    urlSource: number;
  }

  // 音乐歌词
  interface MusicLyric {
    time: number;
    txt: string;
  }

  // 用户信息
  interface UserInfo {
    accountStatus: number;
    accountType: number;
    anchor: boolean;
    authStatus: number;
    authenticated: boolean;
    authenticationTypes: number;
    authority: number;
    avatarDetail: null;
    avatarImgId: number;
    avatarUrl: string;
    backgroundImgId: number;
    backgroundUrl: string;
    birthday: number;
    city: number;
    createTime: number;
    defaultAvatar: boolean;
    description: null;
    detailDescription: null;
    djStatus: number;
    expertTags: null;
    experts: null;
    followed: boolean;
    gender: number;
    lastLoginIP: string;
    lastLoginTime: number;
    locationStatus: number;
    mutual: boolean;
    nickname: string;
    province: number;
    remarkName: null;
    shortUserName: string;
    signature: string;
    userId: number;
    userName: string;
    userType: number;
    vipType: number;
    viptypeVersion: number;
  }
}

export {};
