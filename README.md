## 一款移动端音乐app

使用webpack搭建的vue3项目ts编写<br>
目的:练习vue3 + ts

### 项目启动
```
 git clone https://github.com/liuya6/vue3-typescript-webpack.git
```
```
 cd vue3-typescript-webpack
```
```
 yarn
```
```
 yarn dev
```

### 主要功能
- 登录同步网易云歌单，同步每日推荐
- 3种播放模式 循环 随机 列表
- 上一首下一首切换歌曲
- 添加指定歌曲到下一首播放
- 歌曲歌词滚动
- 结合NeteaseCloudMusicApi和UnblockNeteaseMusic获取歌曲资源，在【网易云，QQ，酷我，咪咕】这4个源中去寻找


###### 接口使用
https://github.com/Binaryify/NeteaseCloudMusicApi,
https://github.com/nondanee/UnblockNeteaseMusic

###### 线上地址
https://vue3-typescript-webpack.vercel.app/
