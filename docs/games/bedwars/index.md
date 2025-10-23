# ECBedWars 模块文档

## 项目概述

ECBedWars 是 EaseCation 服务器的核心游戏模式——起床战争的主要实现模块。这是一个基于团队的 PvP 游戏，玩家需要收集资源、保护床铺、消灭敌方队伍获得胜利。该模块实现了完整的游戏逻辑、多种游戏模式、商店系统、陷阱机制等复杂功能。

## 模块架构

### 核心入口
- **主类**: `ECBedWars.java` - 插件主入口，管理游戏核心逻辑和系统初始化
- **部署位置**: `{server}/plugins` - 服务器插件目录

### 依赖关系
```
ECBedWars
├── libschem         // 建筑蓝图库
├── nukkit          // 服务器核心
├── CodeFunCore     // 核心功能库
├── MagicGuns       // 魔法枪械系统
├── ECBedWarsTool   // 起床战争工具模块
└── ECTeamPulse     // 团队脉冲系统
```

## 核心游戏系统

### 1. 游戏状态管理 (Stage System)

#### 状态枚举 (`BedWarsStageState.java`)
```java
PRESTART_CANT_MOVE    // 游戏准备阶段，玩家不能移动
STARTED               // 游戏进行中
FINISH_WAITING        // 游戏结束等待
```

#### 游戏控制器 (`BedWarsStage.java`)
抽象基类，定义了游戏的核心逻辑框架：
- 游戏生命周期管理
- 玩家状态跟踪
- 资源生成控制
- 胜负判定逻辑

#### 游戏状态机 (`BedWarsGamingState.java`)
基于时间的状态机，管理游戏不同阶段的转换：
- 准备阶段 → 开始游戏
- 正常游戏 → 加速阶段
- 加速阶段 → 结束游戏

### 2. 游戏模式 (Game Modes)

#### 传统起床战争模式 (bed/)
```java
// 位置: src/main/java/net/easecation/ecbedwars/stage/bed/
BedWarsBedStage.java              // 床模式基类
BedWarsRemake4TeamsStage.java     // 4队模式
BedWarsRemake8TeamsStage.java     // 8队模式  
BedWarsRemake2TeamsStage.java     // 2队模式
BedWarsRemakeMegaStage.java       // 超大模式
BedWarsRemakeMatchStage.java      // 匹配模式
BedWarsRemakeTrainingStage.java   // 训练模式
BedWarsRemakeVoidlessStage.java   // 无虚空模式
```

#### 特殊活动模式
```java
BedWarsRemakeNewYear2023Stage.java     // 新年2023模式
BedWarsRemakeChristmas2022Stage.java   // 圣诞2022模式  
BedWarsRemakeChristmas2023Stage.java   // 圣诞2023模式
BedWarsRemakeHalloweenStage.java       // 万圣节模式
```

#### 梦境模式
```java
BedWarsDreamSpeedStage.java       // 梦境极速模式
BedWarsDreamEXPStage.java         // 梦境经验模式
BedWarsDreamSpeedDueStage.java    // 梦境极速决斗模式
```

#### 水晶模式 (crystal/)
```java
// 位置: src/main/java/net/easecation/ecbedwars/stage/crystal/
BedWarsCrystalStage.java              // 水晶模式基类
BedWarsCrystalClassicStage.java       // 经典水晶模式
BedWarsCrystalSoloStage.java          // 单人水晶模式
BedWarsCrystalDueStage.java           // 决斗水晶模式
BedWarsCrystal4PlayersStage.java      // 4人水晶模式
BedWarsCrystalMini4PlayersStage.java  // 迷你4人水晶模式
BedWarsCrystalTeamCrazyStage.java     // 疯狂团队水晶模式
```

#### 排位和竞技模式
```java
BedWarsRemakeChampionshipsStage.java  // 锦标赛模式
BedWarsCutOffStage.java               // 断阈模式
BedWarsMatchStage.java                // 匹配模式
```

### 3. 团队系统 (Team System)

#### 团队枚举 (`BedWarsStageTeam.java`)
```java
RED, BLUE, YELLOW, GREEN,     // 4队模式基本队伍
WHITE, ORANGE, PINK, GRAY     // 8队模式扩展队伍
```

#### 团队边界系统 (`BedWarsTeamBorder.java`)
- 队伍区域限制
- 边界可视化效果
- 越界惩罚机制

### 4. 资源系统 (Resource System)

#### 资源类型 (`BedWarsResourceType.java`)
```java
IRON     // 铁锭 - 基础资源
GOLD     // 金锭 - 中级资源  
DIAMOND  // 钻石 - 高级资源
EMERALD  // 绿宝石 - 顶级资源
```

#### 资源生成器 (`BedWarsResourceGenerator.java`)
- 定时生成各类资源
- 支持生成速率配置
- 升级生成器机制
- 资源分配逻辑

#### 资源生成配置
```java
BedWarsResourceGeneratorConfig.java         // 生成器配置
BedWarsResourceGeneratorPeriodConfig.java   // 生成周期配置
```

### 5. 商店系统 (Shop System)

#### 核心商店类
```java
// 位置: src/main/java/net/easecation/ecbedwars/shop/
BedWarsShop.java                    // 商店主控制器
BedWarsShopConfig.java              // 商店配置
BedWarsShopCategory.java            // 商店分类
BedWarsShopCurrency.java            // 商店货币
TeamUpgradeManager.java             // 团队升级管理器
```

#### 商品系统
```java
// 位置: src/main/java/net/easecation/ecbedwars/shop/goods/
ShopGoods.java                      // 商品基类
BedWarsShopGoodsPool.java           // 商品池
BuyIt.java                          // 购买接口
BuyItItems.java                     // 可购买物品
CheckCanBuy.java                    // 购买条件检查
CheckCurrentPriceLevel.java         // 价格等级检查
```

#### 推荐系统
```java
// 位置: src/main/java/net/easecation/ecbedwars/shop/recommend/
BedWarsRecommendManager.java        // 推荐管理器
RecommendScheme.java                // 推荐方案
RecommendSchemePool.java            // 推荐方案池
PlayerRecommendHandler.java         // 玩家推荐处理器
RecommendLine.java                  // 推荐行
RecommendLineEntry.java             // 推荐条目
```

#### 商店界面
```java
// 位置: src/main/java/net/easecation/ecbedwars/shop/interaction/
ShopMainFormWindow.java             // 主商店表单
ShopCategoryGoodsFormWindow.java    // 分类商品表单
BedWarsShopContainer.java           // 商店容器
BedWarsShopModUI.java               // 商店ModUI
```

### 6. 守护系统 (Guardian System)

#### 守护对象
```java
// 位置: src/main/java/net/easecation/ecbedwars/guardian/
BedWarsGuardianObject.java          // 守护对象基类
BedWarsGuardianBed.java             // 床守护器
BedWarsGuardianCrystal.java         // 水晶守护器
GuardianShield.java                 // 守护护盾
```

#### 功能特性
- 床的保护和破坏机制
- 水晶的能量管理
- 护盾效果实现
- 破坏特效和音效

### 7. 陷阱系统 (Trap System)

#### 陷阱类型
```java
// 位置: src/main/java/net/easecation/ecbedwars/trap/
BedWarsTrap.java                    // 陷阱基类
BedWarsTrapAlert.java               // 警告陷阱
BedWarsTrapFatigue.java             // 疲劳陷阱
BedWarsTrapSlowness.java            // 缓慢陷阱
BedWarsTrapBeatBack.java            // 击退陷阱
BedWarsTrapManager.java             // 陷阱管理器
```

#### 陷阱机制
- 自动触发检测
- 多重陷阱叠加
- 陷阱效果持续时间
- 陷阱购买和布置

### 8. 地图系统 (Maps System)

#### 团队地图配置
```java
// 位置: src/main/java/net/easecation/ecbedwars/maps/game/team/
BedWarsAtlantisGameMapConfig.java        // 亚特兰蒂斯
BedWarsCastleGameMapConfig.java          // 城堡
BedWarsFantasiaGameMapConfig.java        // 幻想乡
BedWarsClayGameMapConfig.java            // 粘土世界
BedWarsFullMoonGameMapConfig.java        // 满月
BedWarsIceCrystalGameMapConfig.java      // 冰晶
BedWarsMushroomGameMapConfig.java        // 蘑菇岛
BedWarsMysticGameMapConfig.java          // 神秘世界
BedWarsPrehistoricGameMapConfig.java     // 史前世界
BedWarsSuperMarioGameMapConfig.java      // 超级马里奥
BedWarsSteamPunkGameMapConfig.java       // 蒸汽朋克
BedWarsUnderSeaGameMapConfig.java        // 海底世界
BedWarsWinterWonderlandGameMapConfig.java // 冬季仙境
BedWarsWildernessGameMapConfig.java      // 荒野
```

#### 单人地图配置
```java  
// 位置: src/main/java/net/easecation/ecbedwars/maps/game/solo/
BedWarsSoloAtlantisGameMapConfig.java    // 单人亚特兰蒂斯
BedWarsSoloSteamPunkGameMapConfig.java   // 单人蒸汽朋克  
BedWarsSoloPrehistoricGameMapConfig.java // 单人史前世界
```

### 9. 实体系统 (Entity System)

#### 特殊实体
```java
// 位置: src/main/java/net/easecation/ecbedwars/entity/
EntityBedWarsDog.java               // 起床战争狗
EntityBedWarsSilverfish.java       // 蠹虫
EntitySchematicBuilder.java        // 蓝图构建器
ListHaterRandomTargetFinder.java   // 仇恨随机目标查找器
```

#### 虚拟实体
```java
// 位置: src/main/java/net/easecation/ecbedwars/entity/dummy/
BedWarsEnchantmentSoulSand.java     // 附魔灵魂沙
BedWarsInletEntity.java             // 入口实体
BedWarsVentilateEntity.java         // 通风实体
```

#### 特殊钩子实体
```java
EntityRLThrowWitherHeadHook.java    // 凋零头颅钩子
```

### 10. 自定义规则系统 (Custom Rules)

#### 友好规则 (F开头)
```java
// 位置: src/main/java/net/easecation/ecbedwars/custom/rule/
CustomRuleFDragon10.java            // 10分钟末影龙
CustomRuleFDragonFirst.java         // 优先末影龙
CustomRuleFBreakDamage.java         // 破坏伤害
CustomRuleFFoodEnable.java          // 启用食物
CustomRuleFLongerRespawnTime.java   // 延长重生时间
CustomRuleFOutDeath10.java          // 10次出局死亡
CustomRuleFMonsters.java            // 怪物模式
CustomRuleFTimeFaster.java          // 时间加速
CustomRuleFRGBSky.java              // 彩虹天空
CustomRuleFLoseMaxHealth.java       // 失去最大生命值
```

#### 疯狂规则 (Z开头)  
```java
CustomRuleZAutoRoad.java            // 自动道路
CustomRuleZInfiniteFireball.java   // 无限火球
CustomRuleZMoreRespawn.java         // 更多重生
CustomRuleZResourceRolling.java    // 资源滚动
CustomRuleZRespawnOnSite.java       // 原地重生
CustomRuleZSuperSpeed.java          // 超级速度
CustomRuleZTinyPlayers.java         // 迷你玩家
CustomRuleZDestroy1ThenExtraCrystalHeal.java      // 破坏1个后额外水晶治疗
CustomRuleZDestroyAddHealth.java                  // 破坏添加生命值
CustomRuleZDestroy3ThenPlayerRespawn.java         // 破坏3个后玩家重生
CustomRuleZMoreMaxHealthWhenTeamWipe.java         // 团队覆灭时增加最大生命值
```

### 11. 扩展系统 (Extension System)

#### 扩展配置
```java
// 位置: src/main/java/net/easecation/ecbedwars/extension/config/
MapExtensionConfig.java             // 地图扩展配置
MapExtensionType.java               // 扩展类型枚举
MapExtensionPositionalConfig.java   // 位置扩展配置
MapExtensionConfigJsonAdapter.java  // JSON适配器
```

#### 扩展实例
```java  
// 位置: src/main/java/net/easecation/ecbedwars/extension/instance/
MapExtensionInstance.java           // 扩展实例基类
```

#### 扩展实例配置
```java
// 位置: src/main/java/net/easecation/ecbedwars/extension/instance/config/
TeleporterConfig.java               // 传送器配置
GeometryConfig.java                 // 几何配置
LightningBlockConfig.java           // 闪电块配置  
CreatureConfig.java                 // 生物配置
ParticleConfig.java                 // 粒子配置
```

### 12. 辅助系统

#### 治疗池系统
```java
// 位置: src/main/java/net/easecation/ecbedwars/healingpool/
BedWarsHealingPoolManager.java      // 治疗池管理器
```

#### 计分系统
```java
// 位置: src/main/java/net/easecation/ecbedwars/stage/score/
BedWarsScoreBoard.java              // 计分板
BedWarsPlayerScore.java             // 玩家分数
```

#### 排位匹配系统
```java
// 位置: src/main/java/net/easecation/ecbedwars/stage/bed/score/ranking/
BedWarsBedMatchingScore.java        // 床模式匹配分数
BedWarsCutOffMatchingScore.java     // 断阈匹配分数

// 位置: src/main/java/net/easecation/ecbedwars/stage/crystal/score/ranking/  
BedWarsCrystalMatchingScore.java    // 水晶模式匹配分数
```

#### 工具类
```java
// 位置: src/main/java/net/easecation/ecbedwars/utils/
BedWarsCustomHotbarHandler.java     // 自定义热键栏处理器
```

#### 容器系统
```java
// 位置: src/main/java/net/easecation/ecbedwars/items/
BedWarsWaitingContainer.java        // 等待容器
BedWarsSoloWaitingContainer.java    // 单人等待容器
BedWarsChooseTeamContainer.java     // 选择队伍容器
BedWarsViewListContainer.java       // 观看列表容器
BedWarsViewerContainer.java         // 观战者容器
```

## 游戏流程

### 1. 游戏初始化
1. **地图加载**: 根据游戏模式加载对应地图配置
2. **资源生成器初始化**: 设置各队伍的资源生成点
3. **床守护系统启动**: 激活床的保护机制
4. **商店系统准备**: 初始化商店物品和价格
5. **陷阱系统就绪**: 准备陷阱购买和布置功能

### 2. 游戏准备阶段 (PRESTART_CANT_MOVE)
1. **玩家传送**: 将玩家传送到各队出生点
2. **队伍分配**: 自动或手动分配玩家到不同队伍
3. **界面初始化**: 显示队伍选择和设置界面
4. **倒计时**: 游戏开始倒计时

### 3. 游戏进行阶段 (STARTED)
1. **资源生成**: 各生成器开始产出资源
2. **商店开放**: 玩家可以购买装备和升级
3. **PvP战斗**: 队伍间开始战斗
4. **床破坏**: 尝试破坏敌方队伍的床
5. **陷阱触发**: 陷阱系统激活和触发
6. **团队升级**: 购买团队升级提升整队能力

### 4. 游戏结束阶段 (FINISH_WAITING)  
1. **胜负判定**: 判断最后存活的队伍
2. **奖励发放**: 根据表现发放奖励
3. **统计记录**: 记录游戏数据和排位变化
4. **清理工作**: 清理游戏资源和状态

## 关键配置

### 资源生成配置
- **铁锭**: 基础生成速率，用于购买基础装备
- **金锭**: 中等生成速率，用于购买进阶装备  
- **钻石**: 较慢生成速率，用于购买高级装备
- **绿宝石**: 最慢生成速率，用于购买顶级装备和团队升级

### 商店价格体系
- **武器类**: 木剑(10铁) → 石剑(20铁) → 铁剑(7金) → 钻剑(4钻)
- **防具类**: 链甲(40铁) → 铁甲(12金) → 钻甲(6钻)  
- **工具类**: 剪刀(4铁)、镐子(10铁)、斧头(10铁)
- **方块类**: 羊毛(4铁)、木头(4金)、末地石(24铁)、黑曜石(4绿宝石)
- **消耗品**: 金苹果(3金)、弓箭(2金)、火球(40铁)、TNT(4金)
- **团队升级**: 锋利(4钻)、保护(5钻)、急迫(2钻)、治疗池(1绿宝石)

### 陷阱价格
- **报警陷阱**: 1钻石 - 敌人靠近时提醒队友
- **挖掘疲劳**: 1钻石 - 敌人挖掘速度变慢
- **击退陷阱**: 1钻石 - 将敌人击退
- **缓慢陷阱**: 2钻石 - 让敌人移动变慢

## 性能优化

### 1. 资源管理
- 资源生成器使用定时任务而非频繁检查
- 物品掉落自动清理机制
- 实体数量限制和清理

### 2. 网络优化  
- 批量发送数据包减少网络负载
- 粒子效果范围限制
- 音效播放频率控制

### 3. 内存管理
- 游戏结束后及时清理对象引用
- 缓存经常访问的配置数据
- 避免内存泄漏的事件监听器注册

## 开发建议

### 添加新游戏模式
1. 继承 `BedWarsStage` 或其子类
2. 实现特定的游戏规则和逻辑
3. 配置地图和资源生成器
4. 注册到游戏模式池

### 扩展商店系统
1. 在 `BedWarsShopGoodsPool` 中添加新商品
2. 配置价格和购买条件
3. 实现物品效果逻辑
4. 更新推荐系统

### 添加新陷阱类型
1. 继承 `BedWarsTrap` 基类
2. 实现触发条件和效果
3. 在 `BedWarsTrapManager` 中注册
4. 配置价格和购买界面

### 调试和测试
1. 使用训练模式进行功能测试
2. 检查资源平衡性和游戏节奏
3. 验证多队伍交互逻辑
4. 测试网络同步和性能表现

## 文件结构总结

```
ECBedWars/
├── src/main/java/net/easecation/ecbedwars/
│   ├── ECBedWars.java                   # 主入口类
│   ├── stage/                           # 游戏状态管理
│   │   ├── bed/                         # 床模式实现
│   │   ├── crystal/                     # 水晶模式实现
│   │   └── score/                       # 计分系统
│   ├── shop/                            # 商店系统
│   │   ├── goods/                       # 商品管理
│   │   ├── recommend/                   # 推荐系统
│   │   └── interaction/                 # 交互界面
│   ├── guardian/                        # 守护系统
│   ├── trap/                            # 陷阱系统
│   ├── maps/                            # 地图配置
│   │   ├── game/team/                   # 团队地图
│   │   └── game/solo/                   # 单人地图
│   ├── entity/                          # 实体系统
│   ├── custom/rule/                     # 自定义规则
│   ├── extension/                       # 扩展系统
│   ├── healingpool/                     # 治疗池
│   ├── items/                           # 容器系统
│   ├── listener/                        # 事件监听
│   ├── task/                            # 任务系统
│   ├── team/                            # 团队系统
│   └── utils/                           # 工具类
├── build.gradle.kts                     # 构建配置
└── src/main/resources/                  # 资源文件
```

ECBedWars 作为 EaseCation 服务器的核心游戏模式，实现了完整的起床战争游戏逻辑，支持多种游戏模式和丰富的功能特性，为玩家提供了深度的游戏体验。