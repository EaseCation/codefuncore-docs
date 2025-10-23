# 入门指南

欢迎来到 CodeFunCore 文档！本指南将帮助你快速了解 EaseCation 服务器系统的架构和搭建方法。

## 📚 学习路径

### 1. [项目架构介绍](./introduction.md)

了解 EaseCation 服务器的整体架构设计：

- 三层架构模式（网络代理层、API控制层、游戏服务层）
- Synapse 通信协议
- 游戏服务器的灵活设计
- 分布式架构的优势

**推荐指数**: ⭐⭐⭐⭐⭐
**适合**: 所有开发者，建议首先阅读

### 2. [快速开始](./getting-started.md)

从零开始搭建 EaseCation 服务器后端：

- 环境准备和依赖安装
- 服务器配置详解
- 数据库和缓存设置
- 启动和测试服务器

**推荐指数**: ⭐⭐⭐⭐⭐
**适合**: 新手开发者，准备搭建开发环境

### 3. [开发环境配置](./setup.md)

配置本地开发环境：

- VitePress 文档站点设置
- 构建和部署流程
- GitHub Actions 自动化部署
- 本地测试和预览

**推荐指数**: ⭐⭐⭐⭐
**适合**: 需要修改或贡献文档的开发者

## 🎯 快速导航

### 核心系统文档

- [CodeFunCore 核心架构](/core/architecture/) - 了解核心模块的类结构和系统组件
- [Stage 系统](/core/architecture/stage.md) - 游戏房间管理的核心系统
- [ECPlayer 系统](/core/architecture/ecplayer.md) - 扩展的玩家系统

### 底层系统

- [事件系统](/core/systems/event.md) - 事件监听和处理机制
- [命令系统](/core/systems/command.md) - 命令注册和权限管理
- [多语言系统](/core/systems/i18n.md) - 多语言支持和翻译

### 游戏系统

- [起床战争](/games/bedwars/) - 最热门的游戏模式实现
- [VIP 系统](/games/vip.md) - 基于分数的VIP等级系统

## 💡 常见问题

### 我应该从哪里开始？

1. 如果你是**新手**，建议按顺序阅读：[项目架构介绍](./introduction.md) → [快速开始](./getting-started.md)
2. 如果你已经**熟悉架构**，直接查看 [CodeFunCore 核心架构](/core/architecture/)
3. 如果你要**开发新游戏模式**，先了解 [Stage 系统](/core/architecture/stage.md)

### 如何搭建本地测试环境？

详见 [快速开始](./getting-started.md) 文档，包含完整的环境搭建步骤。

### 文档中的代码示例在哪里？

大部分核心系统文档都包含实际的代码示例和使用说明，可以在对应的系统文档中查看。

## 🔗 相关链接

- [GitHub 仓库](https://github.com/EaseCation/CodeFunCore)
- [问题反馈](https://github.com/EaseCation/CodeFunCore/issues)

## 📝 贡献文档

如果你发现文档中的错误或希望改进文档，欢迎提交 Pull Request！详见 [开发环境配置](./setup.md) 了解如何修改和预览文档。
