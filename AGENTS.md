# AGENTS.md - 开发指南

## 项目概述
这是一个关于圣诞节传统和文化分析的中文静态网站。使用原生 HTML、CSS 和 JavaScript 构建 - 无构建工具或框架。

## 构建/检查/测试命令
本项目仅使用静态文件 - 无构建过程、package.json 或测试框架。

**本地开发：**
- 直接在浏览器中打开 `index.html` 或使用静态服务器
- Python: `python -m http.server 8000`
- Node.js: `npx serve .`

**验证：**
- HTML: 使用 W3C 验证器或 `npx html-validator index.html`
- CSS: 如需要使用 stylelint（项目使用自定义 CSS）
- JavaScript: 基础检查 `npx eslint js/main.js`

## 代码风格指南

### HTML 结构
- 使用语义化 HTML5 标签（`<header>`、`<main>`、`<section>`、`<footer>`）
- 包含适当的可访问性属性（`aria-*`、`role`、`alt`）
- 保持正确的标题层级（`h1` → `h2` → `h3`）
- 使用 `defer` 属性链接脚本

### CSS 架构
- 在 `:root` 中定义 CSS 自定义属性用于主题
- 类 BEM 命名的组件（`.card`、`.card-title`、`.card-desc`）
- 移动优先的响应式设计和媒体查询
- CSS Grid 和 Flexbox 布局
- 性能优化：`will-change`、`transform: translateZ(0)`

### JavaScript 模式
- ES6+ 类架构
- 性能：使用 `requestAnimationFrame` 处理动画
- 使用 try-catch 块进行错误处理
- 调整大小事件的防抖处理
- Intersection Observer 处理滚动动画
- 组件销毁时的内存清理
- 特性检测和优雅降级

### 命名规范
- CSS: 短横线命名（`.card-list`、`.timeline-item`）
- JavaScript: 类使用 PascalCase，属性使用 camelCase
- 使用描述性语义化名称
- 中文内容使用 UTF-8 编码

### 性能指南
- 延迟加载非关键功能
- 优先使用 CSS 变换而非位置变化
- 实现减少运动支持（`prefers-reduced-motion`）
- 适当使用 GPU 加速动画
- 清理事件监听器和计时器内存

### 文件组织
- `/css/style.css` - 所有样式在一个文件
- `/js/main.js` - 所有 JavaScript 在一个文件
- `/index.html` - 主 HTML 结构
- `/sitemap.xml` - SEO 站点地图
- `/.htaccess` - 服务器配置

### 可访问性
- 键盘导航的跳转链接
- 适当的 ARIA 标签和角色
- 高对比度模式支持
- 焦点管理
- 语义化 HTML 结构