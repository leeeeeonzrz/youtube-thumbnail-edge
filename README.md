# YouTube 封面下载器

一个简单的 Microsoft Edge / Chrome 扩展。打开 YouTube 视频页面后，点击扩展图标一次，就会下载当前视频的封面图。

扩展不会爬取 YouTube 页面，也不会额外请求视频详情接口。文件名来自当前已经打开的 YouTube 页面标题；扩展点击时只读取当前标签页里已有的标题信息。

下载后的文件会保存到浏览器默认下载目录里的 `video_cover` 文件夹：

```text
Downloads\video_cover\视频标题.jpg
```

例如当前标签页标题是：

```text
Example Video Title - YouTube
```

下载结果就是：

```text
Downloads\video_cover\Example Video Title.jpg
```

如果页面标题读取失败，扩展会退回使用视频 ID 作为文件名：

```text
Downloads\video_cover\VIDEO_ID.jpg
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
video_cover/视频标题.jpg
```

所以浏览器会自动在默认下载目录下创建 `video_cover` 文件夹。

如果你想让图片出现在别的位置，可以在浏览器的下载设置里修改默认下载目录。

如果 Chrome 开启了“下载前询问每个文件的保存位置”，浏览器会优先让用户手动选择保存位置。
