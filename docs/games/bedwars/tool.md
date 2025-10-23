# ECBedWarsTool 模块文档

## 项目概述

ECBedWarsTool 是 EaseCation 服务器起床战争游戏的工具模块，提供起床战争相关的扩展功能、装饰系统、任务管理、UI 界面以及梦境任务等特性。该模块独立于主游戏逻辑，专注于增强玩家体验和提供辅助功能。

## 模块架构

### 核心入口
- **主类**: `ECBedWarsTool.java` - 插件主入口，负责初始化和注册各种系统
- **部署位置**: `{server}/plugins` - 服务器插件目录

### 依赖关系
```
ECBedWarsTool
├── ECCommons        // 通用工具库
├── nukkit          // 服务器核心
└── CodeFunCore     // 核心功能库
```

## 核心功能系统

### 1. 装饰系统 (Ornament System)
#### 装饰类型枚举 (`BedWarsOrnamentType.java`)
- 胜利特效 (WINNER_EFFECT)
- 击杀音效 (KILL_SOUND)  
- 击杀广播 (KILL_BROADCAST)
- 床装饰 (BED_ORNAMENT)
- 床破坏特效 (BED_DESTROY_EFFECT)
- 床破坏消息 (BED_DESTROY_MESSAGE)
- 表情包 (MEME)
- 喷雾 (SPRAY)
- 个性化商店 (PERSONALIZED_SHOP)
- 商店NPC皮肤 (SHOP_NPC_SKIN)

#### 装饰实现类
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/ornament/
BedWarsOrnament.java              // 装饰基类
BedWarsOrnamentWinnerEffect.java  // 胜利特效装饰
BedWarsOrnamentKillSound.java     // 击杀音效装饰
BedWarsOrnamentMeme.java          // 表情包装饰
BedWarsOrnamentBedOrnament.java   // 床装饰
BedWarsOrnamentGolem.java         // 魔像装饰
BedWarsOrnamentTools.java         // 装饰工具类
```

### 2. 梦境任务系统 (Dream Mission System)
#### 核心组件
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/dream/
DreamMission.java                // 梦境任务核心逻辑
BedWarsDreamListener.java        // 梦境任务事件监听器
DreamMissionFormWindow.java      // 任务表单窗口
DreamMissionListFormWindow.java  // 任务列表窗口
DreamMissionStartFormWindow.java // 任务开始窗口
```

#### 梦境模式列表
- `bedwars-remake-dream-speed` - 极速模式
- `bedwars-remake-ny2023` - 新年2023模式
- `bedwars-remake-2t` - 2队模式
- `bedwars-remake-mega` - 超大模式
- `bedwars-remake-dream-exp` - 经验模式
- `bedwars-remake-dream-speed-due` - 极速决斗模式

### 3. 任务管理系统 (Task System)
#### 任务相关类
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/
BedWarsTaskPool.java             // 任务池管理
task/LongStandingTask.java       // 长期任务实现
```

#### GUI表单
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/gui/form/
BedWarsTaskCategoriesForm.java   // 任务分类表单
BedWarsTaskCategoryForm.java     // 单个任务分类表单
LongStandingTaskInfoForm.java    // 长期任务信息表单
BedWarsExchangeForm.java         // 兑换表单
BedWarsSettingsForm.java         // 设置表单
BedWarsPerformanceSettingsForm.java // 性能设置表单
```

### 4. 实体系统 (Entity System)
#### 特殊实体
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/entity/
BedWarsFirework.java             // 烟花实体
BedWarsFireworkBase.java         // 烟花基础类
BedWarsBedOrnament.java          // 床装饰实体
BedWarsBedDestroyEntity.java     // 床破坏特效实体
BedWarsWinnerEffectDragon.java   // 胜利特效龙实体
BedWarsMeme.java                 // 表情包实体
BedWarsGolem.java                // 魔像实体
BedWarsOrnamentEntityItem.java   // 装饰物品实体
```

#### NPC实体
```java
EntityCommonShopNPC.java         // 通用商店NPC
EntityViewersShopNPC.java        // 观战商店NPC
```

### 5. 音效系统 (Sound System)
#### 音效实现
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/sound/
Sound.java                       // 音效基类
SoundType.java                   // 音效类型枚举
LevelSoundEventSound.java        // 等级音效事件
LevelEventSound.java             // 等级事件音效
PlaySoundSound.java              // 播放音效
```

### 6. 事件监听系统
#### 核心监听器
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/
listener/BedWarsGlobalListener.java  // 全局事件监听器
event/BedWarsPlayerDeathEvent.java   // 玩家死亡事件
```

### 7. 抽奖系统 (Lottery System)
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/lottery/
BedWarsLottery.java              // 起床战争抽奖系统
```

### 8. 火花杯系统 (Spark Cup System)
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/sparkcup/
BedWarsSparkCup.java             // 火花杯核心
SparkCupNoticeModUI.java         // 火花杯通知UI
```

## 配置和管理

### 热键栏配置
```java
// 位置: src/main/java/net/easecation/ecbedwarstool/
gui/container/BedWarsCustomHotbarContainer.java // 自定义热键栏容器
utils/HotbarType.java                           // 热键栏类型
```

### 游戏中心集成
ECBedWarsTool 深度集成到游戏中心系统：
- 梦境任务入口注册
- 训练模式按钮
- 装扮商城广告
- 排位系统展示
- 断阈模式支持

## 初始化流程

### onEnable() 主要步骤
1. **初始化核心系统**
   ```java
   BedWarsTaskPool.init();          // 初始化任务池
   BedWarsLottery.init();           // 初始化抽奖系统
   ```

2. **注册事件监听器**
   ```java
   this.getServer().getPluginManager().registerEvents(new BedWarsGlobalListener(), this);
   this.getServer().getPluginManager().registerEvents(new BedWarsDreamListener(), this);
   ```

3. **注册游戏中心UI动作**
   - 梦境任务界面 (`bedwars.dream`)
   - 装扮商城入口 (`workshop:cyber_seky`)

4. **注册游戏中心扩展功能**
   - 训练模式按钮
   - 游戏简介
   - 排位系统展示
   - 断阈模式
   - 梦境任务卡片
   - 房间列表

5. **注册回放实体皮肤**
   - 表情包皮肤
   - 床装饰皮肤  
   - 魔像皮肤

6. **注册玩家动作**
   ```java
   PlayerActionConfigCustom.register("bedwars.uu", (p, args) -> openUnlockUpgradeForm(p));
   PlayerActionConfigCustom.register("bedwars.task", (p, args) -> p.showFormWindow(new BedWarsTaskCategoriesForm(p)));
   PlayerActionConfigCustom.register("bedwars.settings", (p, args) -> p.showFormWindow(new BedWarsSettingsForm(p)));
   ```

## 特殊功能

### 物品框Hook系统
ECBedWarsTool 实现了复杂的物品框Hook机制，用于动态更换展示内容：

```java
// 主要方法
hookItemFrame(Player player, BlockEntityItemFrame itemFrame, ItemMap itemMap)
unhookItemFrame(Player player, BlockEntityItemFrame itemFrame)
```

### 隐藏积分系统
自动将隐藏积分转换为钥匙：
- 每20个隐藏积分 = 1个起床战争钥匙
- 自动触发转换和奖励发放

## 开发建议

### 添加新装饰类型
1. 在 `BedWarsOrnamentType` 枚举中添加新类型
2. 创建对应的装饰实现类继承 `BedWarsOrnament`
3. 在主类中注册皮肤（如需要）
4. 更新相关UI界面

### 扩展梦境任务
1. 在 `DREAM_MODES` 列表中添加新模式
2. 实现对应的游戏逻辑
3. 更新任务进度计算
4. 添加相关UI支持

### 性能注意事项
- 物品框Hook系统使用缓存机制，避免频繁操作
- 实体系统合理管理生命周期
- 音效播放考虑客户端兼容性
- UI界面使用异步数据加载

## 文件结构总结

```
ECBedWarsTool/
├── src/main/java/net/easecation/ecbedwarstool/
│   ├── ECBedWarsTool.java                    # 主入口类
│   ├── BedWarsTaskPool.java                  # 任务池管理
│   ├── dream/                                # 梦境任务系统
│   ├── ornament/                             # 装饰系统
│   ├── entity/                               # 实体系统
│   ├── sound/                                # 音效系统
│   ├── gui/                                  # GUI界面
│   ├── listener/                             # 事件监听
│   ├── lottery/                              # 抽奖系统
│   ├── sparkcup/                             # 火花杯系统
│   ├── task/                                 # 任务实现
│   ├── event/                                # 自定义事件
│   └── utils/                                # 工具类
└── build.gradle.kts                          # 构建配置
```

ECBedWarsTool 作为 ECBedWars 的重要补充，提供了丰富的扩展功能和用户体验增强，是起床战争游戏生态的重要组成部分。