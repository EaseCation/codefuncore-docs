# CodeFunCore 核心系统

CodeFunCore 是 EaseCation 服务器系统的核心模块，承担双重角色：作为 Nukkit 插件提供游戏服务器功能，同时作为独立的 API 服务器处理分布式通信。

## 🏗️ 系统架构

### [架构设计](/core/architecture/)

核心架构层，定义了系统的基础框架和关键组件：

- **[核心系统概览](/core/architecture/index.md)** - CodeFunCore 主要类结构、配置管理、命令系统
- **[ECPlayer 系统](/core/architecture/ecplayer.md)** - 扩展的玩家系统，提供丰富的玩家数据和功能
- **[Stage 系统](/core/architecture/stage.md)** - 游戏房间管理的核心架构，传统 Stage 实现
- **[GracefulStage 系统](/core/architecture/graceful-stage.md)** - 现代化的优雅 Stage 实现，更好的生命周期管理

### [底层系统](/core/systems/)

提供核心功能支持的底层系统：

- **[事件系统](/core/systems/event.md)** - 基于 Nukkit 的事件驱动架构，处理游戏事件
- **[命令系统](/core/systems/command.md)** - 命令注册、处理和权限管理
- **[分布式通信系统](/core/systems/communication.md)** - RMI、WebSocket 等跨服务器通信机制
- **[多语言系统](/core/systems/i18n.md)** - 多语言支持和 TranslateMessage 翻译系统
- **[数据持久化系统](/core/systems/persistence.md)** - MySQL、Redis 等数据存储和缓存系统

### [应用模块](/core/modules/)

基于核心系统构建的可复用应用模块：

#### 数据管理
- **[ECMerchandise](/core/modules/merchandise.md)** - 玩家维度的键值对数据存储系统
- **[ECTask](/core/modules/task.md)** - 可定义的周期性任务基础框架

#### 游戏功能
- **[Exchange 兑换系统](/core/modules/exchange.md)** - 资源兑换，支持限制、价格、消费、获得等配置
- **[GamePass 通行证](/core/modules/gamepass.md)** - 基于任务积分的多线并行通行证奖励系统
- **[Mission 任务框架](/core/modules/mission.md)** - 可复用的任务配置和实例管理框架
- **[Questions 答题系统](/core/modules/questions.md)** - 题库配置和答题会话管理

#### 活动框架
- **[GiftMachine 礼物机](/core/modules/gift-machine.md)** - 基于状态机的时间驱动礼物机活动框架
- **[SimpleStateMachine 状态机](/core/modules/state-machine.md)** - 通用状态机框架，支持状态定义、转换和生命周期

#### 配置系统
- **[ECCondition 表达式](/core/modules/condition.md)** - 条件表达式系统，支持玩家数据、变量和外部值判断
- **[ECNPC 配置](/core/modules/npc.md)** - NPC 配置系统，包含皮肤、对话、行为钩子等
- **[HowToDo 快捷打开](/core/modules/howto.md)** - 商品获取方式的快捷跳转配置

## 🎯 学习路径

### 新手开发者

1. 从 [架构设计概览](/core/architecture/index.md) 开始，了解整体结构
2. 学习 [ECPlayer 系统](/core/architecture/ecplayer.md)，理解玩家数据管理
3. 掌握 [Stage 系统](/core/architecture/stage.md)，这是开发游戏模式的基础

### 进阶开发者

1. 深入理解 [事件系统](/core/systems/event.md) 和 [命令系统](/core/systems/command.md)
2. 学习 [分布式通信系统](/core/systems/communication.md)，开发跨服务器功能
3. 使用各种 [应用模块](/core/modules/)，快速实现常见功能

### 高级开发者

1. 研究 [GracefulStage 系统](/core/architecture/graceful-stage.md)，开发复杂游戏模式
2. 自定义 [状态机](/core/modules/state-machine.md) 和 [条件表达式](/core/modules/condition.md)
3. 优化 [数据持久化](/core/systems/persistence.md) 和性能

## 💡 核心概念

### 双模式运行

CodeFunCore 支持两种运行模式：

1. **插件模式** - 作为 Nukkit 插件运行在游戏服务器中
2. **API 模式** - 作为独立应用程序运行，处理 API 请求

### Stage 生命周期

游戏房间（Stage）的完整生命周期：

```
创建 → 等待玩家 → 游戏开始 → 游戏进行 → 游戏结束 → 清理资源 → 回收/销毁
```

### 事件驱动架构

系统通过事件机制响应游戏中的各种行为，开发者只需监听相关事件即可实现功能。

## 🔗 相关链接

- [入门指南](/guide/) - 了解整体架构和搭建方法
- [游戏系统](/games/) - 查看具体游戏模式的实现
- [参考资料](/reference/nukkit.md) - Nukkit 相关技术文档
