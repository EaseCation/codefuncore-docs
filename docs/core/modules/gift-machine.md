# GiftMachine 礼物机活动框架

基于SimpleStateMachine的通用礼物机活动框架，支持时间驱动的状态管理、答题解锁机制和多波次礼物发放。

## 核心概念

- **时间驱动状态机**：基于活动时间和准点判断自动切换状态
- **答题解锁机制**：集成Questions系统，支持题库配置和答题交互
- **多波次发放**：支持5波次礼物发放，基于周围玩家数量计算礼物数量
- **Exchange集成**：通过Exchange系统处理礼物奖励发放
- **配置化设计**：支持灵活的活动配置和礼物类型定义

## 核心组件

### 1. 状态机管理 (GiftMachineManager)

基于SimpleStateMachine实现的单状态机架构，管理5个核心状态：

```java
// 礼物机状态枚举
public enum GiftMachineState {
    CLOSED,      // 关闭状态 - 非活动时间
    IDLE,        // 待机状态 - 准备阶段或非准点时间
    UNLOCKABLE,  // 可解锁状态 - 准点时可答题解锁
    UNLOCKED,    // 解锁状态 - 完成答题，等待拉杆
    DISPENSING   // 发放状态 - 正在喷射礼物
}
```

**状态转换逻辑**：
- 自动时间检测和状态切换
- 超时保护机制（普通10分钟，最终15分钟）
- 答题成功和拉杆交互驱动

### 2. 配置管理 (GiftMachineConfig)

**统一配置文件结构**：
```yaml
gift-machine:
  # 文件路径配置 - 框架自动加载依赖的Exchange和题库配置
  files:
    exchange-config: "activity/gq2025_giftmachine.exchange.yml"
    questions-config: "activity/gq2025_giftmachine.questions.yml"
    question-bank-id: "gift.connection.2025"

  # 活动时间配置
  activity-period:
    start-date: "2025-10-01"
    end-date: "2025-10-07"
    daily-start-time: "13:00"
    daily-end-time: "21:00"
    preparation-time: "12:15"

  # 礼物类型配置
  gift-types:
    - name: "large"
      skin-id: 2
      exchange-id: "exc_gq2025_giftmachine_large"
      probability: 0.125
    - name: "medium"
      skin-id: 1
      exchange-id: "exc_gq2025_giftmachine_medium"
      probability: 0.275
    - name: "small"
      skin-id: 0
      exchange-id: "exc_gq2025_giftmachine_small"
      probability: 0.600

  # 超时配置
  timeouts:
    unlock-timeout: "10m"
    lever-timeout: "5m"
    final-window: "15m"

  # 发放配置
  dispense-timing:
    initial-delay: "5s"
    wave-interval: "10s"
    total-waves: 5
```

**关键特性**：
- **自动依赖加载**：框架根据files配置自动注册Exchange和题库
- **时间字符串支持**：超时和延迟配置支持"5s"、"10m"等格式
- **概率自动校验**：礼物类型概率总和应为1.0

### 3. 实体系统

**礼物机实体 (GiftMachineEntity)**：
- 继承CreatureNPC，支持variant动画控制
- 6种动画状态：关闭/待机/可解锁/解锁/蓄力/喷射
- 消息显示和玩家交互处理

**礼物实体 (GiftEntity)**：
- 独立的礼物盒实体，支持物理效果
- 与Exchange系统集成，点击触发奖励发放
- 基于SKIN_ID控制外观类型

### 4. 发放管理 (GiftDispenseManager)

**多波次发放**：
- 5波次发放，首次蓄力5秒，后续间隔10秒
- 礼物数量 = 周围15格内玩家数 × 2/3
- 支持动画状态控制和进度提示

## 答题系统集成

直接复用 **[Questions答题系统](./questions.md)**，支持：
- 题库配置和管理
- 答题会话和超时处理
- 多选题UI界面
- 答题结果回调处理

多语言支持通过 **[多语言系统](../systems/i18n.md)** 实现。

## Exchange系统集成

### 奖励配置分离

礼物机活动负责：
- 礼物外观类型选择（大/中/小型）
- 提供Exchange ID

Exchange系统负责：
- 具体奖励内容和权重
- 随机抽奖逻辑
- 奖励发放和提示

### 依赖配置文件

礼物机框架依赖两个独立的配置文件：

- **Exchange配置**：参考 **[Exchange兑换文档](./exchange.md)** 编写奖励配置
- **Questions配置**：参考 **[Questions答题文档](./questions.md)** 编写题库配置

框架会根据主配置文件中的`files`部分自动加载这些依赖配置。

## 使用方法

### 1. 活动初始化

```java
// 创建礼物机活动实例
GiftMachineActivity activity = new GiftMachineActivity(plugin, configPath);

// 初始化活动（自动加载所有依赖配置）
activity.initialize();
```

### 2. 礼物机创建

```java
// 在指定位置创建礼物机实体
Location position = new Location(100, 64, 100, level);
GiftMachineEntity entity = activity.createGiftMachine("machine_1", position);
```

### 3. 生命周期管理

礼物机实体会自动管理状态机生命周期，无需额外的启动或停止调用。实体内部的tick方法会自动处理状态更新。

## 开发扩展

### 新活动适配

1. **复制配置文件**：参考现有配置格式
2. **修改参数**：调整活动时间、超时设置、礼物概率
3. **配置依赖**：编写Exchange和Questions配置文件
4. **更新路径**：修改主配置中的文件路径引用

## 技术特点

- **基于SimpleStateMachine**：稳定的状态管理和自动转换
- **模块化复用**：集成Questions、Exchange等现有系统
- **配置驱动**：所有参数通过配置文件调整
- **自动依赖管理**：框架自动加载Exchange和题库配置

## 相关文档

- **[SimpleStateMachine状态机](./state-machine.md)** - 状态机框架详解
- **[Exchange兑换](./exchange.md)** - 奖励系统配置
- **[Questions答题（题库）](./questions.md)** - 答题系统使用
- **[多语言系统](../systems/i18n.md)** - 国际化支持