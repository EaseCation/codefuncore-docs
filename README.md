# CodeFunCore Docs

CodeFunCore 文档站点，基于 VitePress 构建。

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run docs:dev
```

构建文档：

```bash
npm run docs:build
```

预览构建结果：

```bash
npm run docs:preview
```

## 部署

推送到 `main` 分支时，GitHub Actions 会自动构建并部署到 GitHub Pages。

查看部署的文档：https://easecation.github.io/codefuncore-docs/

## 项目结构

```
.
├── docs/                    # 文档源文件
│   ├── .vitepress/         # VitePress 配置
│   │   └── config.mjs      # 站点配置
│   ├── guide/              # 指南页面
│   ├── api/                # API 文档
│   └── index.md            # 首页
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署工作流
└── package.json            # 项目依赖和脚本
```

## 技术栈

- [VitePress](https://vitepress.dev/) - 基于 Vite 的静态站点生成器
- [GitHub Actions](https://github.com/features/actions) - 自动化构建和部署
- [GitHub Pages](https://pages.github.com/) - 静态站点托管