# YouTube 封面下载器

一个简单的 Microsoft Edge / Chrome 扩展。打开 YouTube 视频页面后，点击扩展图标一次，就会下载当前视频的封面图。

下载后的文件会保存到浏览器默认下载目录里的 `video_cover` 文件夹：

```text
Downloads\video_cover\VIDEO_ID.jpg
```

例如视频链接里有：

```text
v=XxvANTF-19g
```

下载结果就是：

```text
Downloads\video_cover\XxvANTF-19g.jpg
```

扩展会优先尝试下载最高分辨率封面：

```text
https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg
```

如果最高分辨率封面不存在，会自动回退到：

```text
https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg
```

## 支持的页面

- `youtube.com/watch?v=VIDEO_ID`
- `youtu.be/VIDEO_ID`
- `youtube.com/shorts/VIDEO_ID`
- `youtube.com/embed/VIDEO_ID`
- `youtube.com/live/VIDEO_ID`
- `m.youtube.com`
- `music.youtube.com`

## 安装方式

### Edge

1. 打开 `edge://extensions/`。
2. 开启 `开发人员模式`。
3. 点击 `加载解压缩的扩展`。
4. 选择这个项目文件夹：

```text
D:\study\codex-project\youtube-thumbnail-edge
```

### Chrome

1. 打开 `chrome://extensions/`。
2. 开启 `开发者模式`。
3. 点击 `加载已解压的扩展程序`。
4. 选择这个项目文件夹：

```text
D:\study\codex-project\youtube-thumbnail-edge
```

## 下载位置说明

浏览器扩展不能随意把文件移动到系统任意绝对路径，比如直接写入桌面。但它可以在浏览器默认下载目录下指定相对路径。

这个扩展使用的下载路径是：

```text
video_cover/VIDEO_ID.jpg
```

所以浏览器会自动在默认下载目录下创建 `video_cover` 文件夹。

如果你想让图片出现在别的位置，可以在浏览器的下载设置里修改默认下载目录。
