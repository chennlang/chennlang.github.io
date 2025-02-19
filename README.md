# Next.js 个人博客模板

一个简约而优雅的个人博客模板，基于 Next.js 14 构建，支持 Markdown 文章编写，自动生成静态页面。

## ✨ 特性

- 🚀 基于 Next.js 14 构建
- 📝 Markdown 文章支持
- 🎨 优雅的阅读体验
- 🌙 自动暗色模式
- 📱 响应式设计
- 🔍 文章分类功能
- 🖼️ 图片预览功能
- ⚡️ 代码高亮支持

## 🚀 快速开始

1. 克隆项目

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 配置环境变量

复制 `.env.example` 到 `.env`：

```bash
cp .env.example .env
```

根据需要修改 `.env` 文件：

```env
SITE_NAME=我的博客
SITE_DESCRIPTION=分享技术与生活
AUTHOR_NAME=作者名
AUTHOR_AVATAR=/avatar.jpg
```

4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

## 📝 写作指南

在 `posts` 目录下创建 `.md` 文件即可开始写作。每篇文章需要包含 frontmatter 头部信息：

```markdown
---
title: "文章标题"
date: "2024-03-20"
categories: ["技术", "生活"] # 可以是单个分类或数组
summary: "文章摘要，会显示在列表页面"
---

这里是文章正文内容...
```

### Frontmatter 字段说明

| 字段       | 说明     | 是否必填 | 类型                |
| ---------- | -------- | -------- | ------------------- |
| title      | 文章标题 | 是       | string              |
| date       | 发布日期 | 是       | string (YYYY-MM-DD) |
| categories | 文章分类 | 否       | string 或 string[]  |
| summary    | 文章摘要 | 是       | string              |

## 🛠️ 自定义主题

主题相关的样式文件：

- `app/globals.css`: 全局样式
- `app/post/[id]/post.css`: 文章页面样式
- `tailwind.config.js`: Tailwind 配置

## 📦 构建部署

构建静态页面：

```bash
npm run build
# 或
yarn build
```

构建完成后，`out` 目录包含所有静态文件，可以部署到任何静态托管服务。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
