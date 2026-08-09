# 恋爱饭搭子人格测试 GitHub Pages 部署包

这是最终的分目录部署版本。分享页已统一裁切为 375×812。

## 文件结构

- `index.html`：网站首页。
- `quiz1.html`–`quiz6.html`：问答页面。
- `result1.html`–`result6.html`：结果页面。
- `share1.html`–`share6.html`：分享页面。
- `css/`：页面样式文件。
- `js/`：背景音乐、答题记录与结果计算逻辑。
- `assets/images/`：PNG 图片。
- `assets/svg/`：封面、问答、结果与分享 SVG。
- `docs/`：部署说明。
- `.nojekyll`：避免 GitHub Pages 忽略静态资源。

## 必须上传的内容

请上传本文件夹里面的全部内容，不要只上传 HTML，也不要上传 ZIP 代替原文件。

仓库根目录必须直接存在 `index.html`，并同时存在 `css`、`js`、`assets` 文件夹。

## GitHub 网页分批上传

1. 第一批：上传 `index.html`、全部 `quiz*.html`、`result*.html`、`share*.html`、`README.md` 和 `.nojekyll`。
2. 第二批：上传完整的 `css`、`js` 和 `docs` 文件夹。
3. 第三批：上传 `assets/images` 文件夹。
4. 第四批：上传 `assets/svg` 中的 `cover.svg`、`quiz1.svg`–`quiz6.svg`。
5. 第五批：上传 `assets/svg` 中的 `result1.svg`–`result6.svg`，建议一次上传一个或两个。
6. 第六批：上传 `assets/svg` 中的 `share1.svg`–`share6.svg`，建议一次上传两个。

所有单个文件均小于 GitHub 网页上传的 25 MiB 限制。

## 开启 GitHub Pages

进入仓库的 `Settings → Pages`，在 `Build and deployment` 中选择：

- Source：`Deploy from a branch`
- Branch：`main`
- Folder：`/ (root)`

保存并等待部署完成。更新文件后使用 `Command + Shift + R` 强制刷新浏览器缓存。

