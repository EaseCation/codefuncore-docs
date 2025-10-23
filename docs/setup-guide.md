# 项目设置说明

本文档说明了 CodeFunCore Docs 项目的设置和配置。

## 已完成的设置

### 1. VitePress 文档站点

- ✅ 安装了 VitePress 1.6.4 作为开发依赖
- ✅ 创建了基本的文档结构：
  - `docs/index.md` - 首页（使用 VitePress home 布局）
  - `docs/guide/` - 指南章节
  - `docs/api/` - API 参考章节
- ✅ 配置文件 `docs/.vitepress/config.mjs` 包含：
  - 网站标题和描述
  - 导航菜单
  - 侧边栏配置
  - 社交链接（GitHub）
  - GitHub Pages 的 base 路径配置

### 2. 构建脚本

在 `package.json` 中配置了以下脚本：

- `npm run docs:dev` - 启动开发服务器
- `npm run docs:build` - 构建生产版本
- `npm run docs:preview` - 预览构建结果

### 3. GitHub Actions 自动部署

创建了 `.github/workflows/deploy.yml` 工作流，实现：

- ✅ 当推送到 `main` 分支时自动触发
- ✅ 使用 Node.js 20
- ✅ 自动安装依赖并构建
- ✅ 部署到 GitHub Pages
- ✅ 支持手动触发（workflow_dispatch）

### 4. Git 配置

- ✅ `.gitignore` 配置排除：
  - `node_modules/`
  - `.vitepress/dist/`
  - `.vitepress/cache/`
  - 其他临时文件

## GitHub Pages 设置要求

要使自动部署工作，需要在 GitHub 仓库中进行以下设置：

1. 转到仓库的 **Settings** > **Pages**
2. 在 **Source** 下选择 **GitHub Actions**
3. 保存设置

完成这些设置后，每次推送到 `main` 分支时，网站将自动构建并部署。

## 访问部署的网站

部署成功后，可以通过以下 URL 访问文档：

https://easecation.github.io/codefuncore-docs/

## 本地测试

### 开发模式

```bash
npm install
npm run docs:dev
```

访问 http://localhost:5173/codefuncore-docs/

### 构建测试

```bash
npm run docs:build
npm run docs:preview
```

## 添加新文档

1. 在 `docs/` 目录下创建新的 `.md` 文件
2. 在 `docs/.vitepress/config.mjs` 中更新导航和侧边栏配置
3. 提交并推送到仓库

## 自定义配置

可以在 `docs/.vitepress/config.mjs` 中自定义：

- 网站标题、描述
- 主题颜色
- 导航菜单
- 侧边栏结构
- 社交链接
- 页脚信息

更多配置选项请参考：https://vitepress.dev/reference/site-config

## 故障排除

### 构建失败

如果构建失败，检查：

1. Node.js 版本是否为 20.x
2. 依赖是否正确安装（`npm install`）
3. 文档中的链接是否正确

### 部署失败

如果 GitHub Actions 部署失败：

1. 检查仓库的 Pages 设置是否正确
2. 确认工作流有足够的权限
3. 查看 Actions 标签页的错误日志

## 技术栈版本

- VitePress: 1.6.4
- Node.js: 20.x (推荐)
- GitHub Actions: 最新版本
