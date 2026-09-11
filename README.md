# Agnes — 交互式简历（仓库 CV12）

此仓库包含何美佳（Agnes）的交互式个人简历网页骨架，风格为黑＋粉主色调，强调栅格与留白，含基础滚动动效与时间线交互。

已提交内容

- index.html — 页面结构（已提交）
- css/styles.css — 全局样式、配色、栅格、响应式、渐入动画
- js/main.js — IntersectionObserver 驱动的渐入、技能进度、时间线展开、导航高亮

已处理的图片与上传请求

- 你已授权我把对话中上传的三张图片（IMG_1559.JPG，部分宣传图.JPG，互动小说.jpg）放入仓库并生成优化版本（WebP + 缩略图）。我正在准备上传流程并会把原图与优化图一并提交。

部署说明（快速）

1. 在仓库设置 > Pages 中启用 GitHub Pages，选择 main 分支和 / (root) 或 /docs 路径，即可发布站点。
2. 本地调试：
   - 直接用静态服务器（例如 live-server 或 python -m http.server）在本地预览。

后续建议

- 我可以把更多的视觉细节（微交互、SVG 装饰、渐变动线）移到 CSS 中，或使用 GSAP 进行更复杂序列动画。
- 是否需要中英双语？是否需要导出可打印 PDF 的简历视图？

---

提交信息：Add styles, scripts and README
