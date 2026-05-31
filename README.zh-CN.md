<div align="center">
<img src="./src/assets/readme/logo.png" width="400" alt="Litos Logo" />

![License](https://img.shields.io/github/license/ndEX/Litos?color=blue&style=flat-square)
![Astro](https://img.shields.io/badge/Astro-v5.0-orange?style=flat-square&logo=astro)
![React](https://img.shields.io/badge/React-v19.0-blue?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/TailwindCSS-v4.0-38b2ac?style=flat-square&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0-blue?style=flat-square&logo=typescript)

**一个为开发者打造的现代、优雅、高性能博客主题。**

[English](./README.md) | **简体中文**

[在线演示](https://litos.vercel.app/) · [反馈问题](https://github.com/ndEX/Litos/issues) · [功能建议](https://github.com/ndEX/Litos/issues)

</div>

## 简介

Litos 是一个使用 **Astro**、**React** 和 **TailwindCSS** 精心打造的博客主题。它为开发者提供了一个简洁、专业且高度可定制的平台，用于展示作品、记录想法和分享摄影作品。

不同于传统主题，Litos 在保持极致性能的同时，注重视觉美感。它拥有流畅的动画效果、精致的设计系统以及丰富的内置组件，帮助你高效地打造个人品牌。

![封面图片](./src/assets/readme/readme.webp)

## 主要特性

- **现代架构** — 基于 Astro 5 实现极速性能，搭配 React 19 提供动态交互。
- **优雅设计** — 使用 TailwindCSS 4 精心打造的全响应式 UI。
- **文章** — 多种布局选项（紧凑式、封面图），支持丰富的 Markdown 语法。
- **代码高亮** — 集成 Expressive Code，提供精美的语法高亮。
- **数学公式** — 支持 KaTeX 渲染数学公式。
- **SEO** — 内置站点地图、robots.txt 和 Meta 标签支持。
- **数据分析** — 可配置 Vercount 和 Umami 分析服务。
- **暗色模式** — 原生支持明暗主题切换。

## 部署

一键部署你的 Litos 博客：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ndEX/Litos)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ndEX/Litos)

## 快速开始

### 环境要求

- **Node.js**（v18 或更高版本）
- **pnpm**（推荐的包管理器）

### 安装步骤

1.  **克隆仓库**

    ```bash
    git clone https://github.com/ndEX/Litos.git
    cd Litos
    ```

2.  **安装依赖**

    ```bash
    pnpm install
    ```

3.  **启动开发服务器**

    ```bash
    pnpm dev
    ```

    站点将运行在 `http://localhost:4321`。

## 配置

内容与主题行为现在分离在两个位置：

- `src/content/site.json`：站点元信息、首页内容、导航链接、Hero 指标与社交链接
- `src/config.ts`：主题行为与文章页面配置

### 站点设置
```json
{
  "default": {
    "site": {
      "title": "Litos",
      "description": "你的站点描述",
      "website": "https://your-domain.com",
      "author": "你的名字"
    }
  }
}
```

### 导航
通过 `src/content/site.json` 中的 `headerLinks` 和 `footerLinks` 管理页头和页脚链接。

## 脚本命令

| 命令 | 说明 |
| :--- | :--- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产环境站点 |
| `pnpm preview` | 本地预览生产构建 |
| `pnpm format` | 使用 Prettier 格式化代码 |
| `pnpm check` | 运行 Astro 诊断检查 |

## 许可证

基于 MIT 许可证分发。详见 [MIT LICENSE](LICENSE)。

## Star 趋势

<a href="https://www.star-history.com/#ndEX/Litos&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ndEX/Litos&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ndEX/Litos&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ndEX/Litos&type=date&legend=top-left" />
 </picture>
</a>

---

<p align="center">
made with 💗 by <a href="https://github.com/ndEX">ndEX</a> !
</p>
