# YouTube Cover Downloader

This is a simple Microsoft Edge / Chrome extension. Open a YouTube video page, click the extension icon once, and it downloads the video's cover into a `video_cover` folder inside your browser's default Downloads folder:

```text
Downloads\video_cover\VIDEO_ID.jpg
```

For example:

```text
Downloads\video_cover\XxvANTF-19g.jpg
```

The extension builds the cover URL like this:

```text
https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg
```

## Install in Edge or Chrome

1. Open `edge://extensions/` or `chrome://extensions/`.
2. Turn on `Developer mode`.
3. Click `Load unpacked` / `加载已解压的扩展程序`.
4. Select this folder:

```text
C:\Users\xuleh\Documents\Playground\youtube-thumbnail-edge
```

## Download folder

Browser extensions cannot freely move files around the whole filesystem, but they can download into a subfolder of the browser's default Downloads folder.

This extension uses:

```text
video_cover/VIDEO_ID.jpg
```

So the browser will create `video_cover` automatically under your configured download location.
