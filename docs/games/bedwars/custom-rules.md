# 起床战争自定义规则系统技术文档

## 系统概述

起床战争自定义规则系统是ECBedWars的核心扩展机制，允许通过代码实现难以通过配置文件完成的游戏逻辑修改。该系统采用接口化设计，支持动态加载、优先级排序以及事件驱动的规则执行机制，为游戏提供了丰富的变体和特殊玩法。

## 系统架构

### 核心架构组件

```
自定义规则系统架构
├── 规则接口 (CustomRule)                      # 规则定义接口
│   ├── 生命周期钩子                           # 游戏各阶段的回调方法
│   ├── 事件处理钩子                           # 玩家行为和游戏事件处理
│   └── 优先级机制                             # 规则执行顺序控制
├── 规则管理器 (CustomRuleManager)              # 规则集中管理和调度
│   ├── 规则注册与排序                         # 动态规则加载和优先级排序
│   ├── 事件分发                               # 将游戏事件分发给所有规则
│   └── 生命周期管理                           # 统一管理规则的生命周期
├── 友好规则 (F前缀规则)                       # 增强游戏体验的规则
│   ├── 时间控制规则                           # 游戏节奏调整
│   ├── 难度增强规则                           # 增加游戏挑战性
│   └── 机制变更规则                           # 核心机制的友好调整
└── 疯狂规则 (Z前缀规则)                       # 彻底改变玩法的规则
    ├── 玩家变身规则                           # 玩家外观和能力修改
    ├── 资源机制规则                           # 资源获取和使用变更
    └── 物理效果规则                           # 物理特效和视觉效果
```

## 核心接口设计

### CustomRule 接口 (CustomRule.java)

#### 规则分类和注册
```java
// 疯狂规则列表 (REGISTERED_POSITIVE) - 绿色前缀，提升游戏体验
List<Function<BedWarsStage, CustomRule>> REGISTERED_POSITIVE = Arrays.asList(
    CustomRuleZAssassin::new,           // 刺客模式
    CustomRuleZAutoRoad::new,           // 自动道路
    CustomRuleZMoreMaxHealthWhenTeamWipe::new, // 团队覆灭时增加生命值
    CustomRuleZMoreRespawn::new,        // 更多重生机会
    CustomRuleZTinyPlayers::new,        // 迷你玩家
    CustomRuleZSuperSpeed::new,         // 超级速度
    CustomRuleZInfiniteFireball::new    // 无限火球
);

// 友好规则列表 (REGISTERED_NEGATIVE) - 红色前缀，增加挑战性
List<Function<BedWarsStage, CustomRule>> REGISTERED_NEGATIVE = Arrays.asList(
    CustomRuleFDragon10::new,           // 10分钟末影龙
    CustomRuleFTimeFaster::new,         // 时间加速
    CustomRuleFBreakDamage::new,        // 破坏方块伤害
    CustomRuleFLongerRespawnTime::new,  // 更长重生时间
    CustomRuleFMonsters::new,           // 怪物模式
    CustomRuleFRGBSky::new             // 彩虹天空
);
```

#### 生命周期钩子方法
```java
// 游戏生命周期钩子
void onStageStart()              // 游戏开始时触发
void onStageTeamAssign()         // 队伍分配后触发
void onBeforeGameStart()         // 游戏开始前触发
void onGameFick()                // 游戏Fick（秒级更新）
void onGameTick()                // 游戏Tick（快速更新）

// 玩家生命周期钩子
Long onPlayerDeathBefore(ECPlayer player, ECPlayer killer, boolean teamGuardianAlive)
void onPlayerDeathAfter(ECPlayer player, ECPlayer killer)
Location onPlayerRespawnBefore(ECPlayer player, Location defaultPos)
void onPlayerRespawnAfter(ECPlayer player)
void onPlayerQuit(ECPlayer player)

// 游戏事件钩子
void onTeamWipe(BedWarsStageTeam team)
void onPlayerShootBow(EntityShootBowEvent event, ECPlayer player)
void onPlayerInteract(PlayerInteractEvent event, ECPlayer player)  
void onBlockBreak(BlockBreakEvent event, ECPlayer player)
void onPlayerItemHeld(PlayerItemHeldEvent event, ECPlayer player)
void onPlayerDestroyGuardianObject(ECPlayer player, BedWarsGuardianObject guardianObject)
```

#### 核心属性和方法
```java
// 规则基础信息
TranslateMessage getName()       // 获取规则名称（支持多语言）
String getPrefix()               // 获取显示前缀（颜色标记）
int getPriority()                // 获取优先级（数值越大越优先）

// 特殊机制
boolean disguiseFallback(ECPlayer player)  // 玩家变身回退机制
```

## 规则管理器 (CustomRuleManager.java)

### 核心管理功能
```java
// 规则集中管理
private final List<CustomRule> customRuleList = new ArrayList<>();
private boolean isBeforeGameStartExecuted = false;

// 动态规则添加和排序
public void addExtraRule(CustomRule extra) {
    this.customRuleList.add(extra);
    // 根据优先级进行从大到小重新排序
    this.customRuleList.sort(Comparator.comparingInt(CustomRule::getPriority).reversed());
}
```

### 事件分发机制
```java
// 统一事件分发模式
public void onGameFick() {
    for (CustomRule customRule : customRuleList) {
        customRule.onGameFick();
    }
}

// 优先级处理机制（第一个返回非null值的规则生效）
public Long onPlayerDeathBefore(ECPlayer player, ECPlayer killer, boolean teamGuardianAlive) {
    for (CustomRule customRule : customRuleList) {
        Long time = customRule.onPlayerDeathBefore(player, killer, teamGuardianAlive);
        if (time != null) {
            return time;  // 第一个规则返回结果后立即返回
        }
    }
    return null;
}
```

### 变身管理系统
```java
// 玩家变身优先级处理
public void checkDisguiseFallback(ECPlayer player) {
    for (CustomRule customRule : customRuleList) {
        if (customRule.disguiseFallback(player)) {
            return;  // 第一个成功变身的规则生效
        }
    }
    // 如果没有规则处理变身，恢复玩家原状
    if (player.isDisguised()) {
        player.setDisguise(0);
        player.getArmorInventory().sendContents(player.getViewers().values());
    }
}
```

## 友好规则系统 (F前缀规则)

### 规则设计理念
友好规则以红色前缀显示，主要用于增加游戏挑战性和策略深度，而不破坏核心游戏平衡。

### 典型友好规则实现

#### 1. 时间加速规则 (CustomRuleFTimeFaster.java)
```java
// 游戏节奏控制
@Override
public void onStageStart() {
    for (BedWarsGamingState state : this.stage.gamingStates) {
        if (state.getName().msg.equals("bedwars.state.gaming.dragon")) {
            continue;  // 不改变龙的时间
        }
        if (state.getDuration() == 0) {
            continue;  // 不改变0时间的状态
        }
        // 每个状态递减2分钟，最小保持10秒
        long l = state.getDuration() - (long) count++ * 2 * 60 * 1000;
        state.setDuration(Math.max(10000, l));
    }
}
```

**规则效果**：
- 压缩游戏各阶段时间
- 保持末影龙阶段不变
- 最小时间保护机制

#### 2. 10分钟末影龙规则 (CustomRuleFDragon10.java)
```java
// 末影龙提前召唤机制
private long dragonSpawnTime = 0;

@Override
public void onStageStart() {
    this.dragonSpawnTime = System.currentTimeMillis() + 10 * 60 * 1000;
}

@Override
public void onGameFick() {
    if (this.dragonSpawnTime > 0 && System.currentTimeMillis() >= this.dragonSpawnTime) {
        this.dragonSpawnTime = 0;
        this.stage.dragonManager.spawnDragon(null);
    }
}
```

**规则效果**：
- 游戏开始10分钟后强制召唤末影龙
- 增加游戏结束压力
- 防止游戏拖延过长

#### 3. 破坏伤害规则 (CustomRuleFBreakDamage.java)
```java
// 破坏方块造成伤害
@Override
public void onBlockBreak(BlockBreakEvent event, ECPlayer player) {
    if (!stage.isPlayerTeamAlive(player) || stage.isRespawning(player.getName())) {
        return;
    }
    // 每次破坏方块造成2点伤害
    player.attack(new EntityDamageEvent(player.getPlayer(), 
        EntityDamageEvent.DamageCause.SUFFOCATION, 2));
    player.getScreenTextShower().setPopup(
        new TranslateMessage("bedwars.extra.break_damage.popup"), 2, false);
}
```

**规则效果**：
- 破坏方块时受到伤害
- 增加建筑和拆除的策略考量
- 屏幕提示玩家规则生效

## 疯狂规则系统 (Z前缀规则)

### 规则设计理念
疯狂规则以绿色前缀显示，彻底改变游戏玩法和体验，提供全新的游戏模式和机制。

### 典型疯狂规则实现

#### 1. 迷你玩家规则 (CustomRuleZTinyPlayers.java)
```java
// 玩家尺寸和视角调整
@Override
public void onPlayerRespawnAfter(ECPlayer player) {
    player.setScale(0.62f);  // 设置玩家尺寸为62%
    if (player.isNetEaseClient()) {
        // 网易版客户端视角调整
        CameraRequest request = new CameraRequest();
        request.anchor = new Vector3(0, -0.2, 0);
        request.offset = new Vector3(0, -0.2, 0);
        NetEaseModNukkitUI.getInstance().requestCamera((SynapsePlayer) player, request);
    }
}

@Override
public void onPlayerQuit(ECPlayer player) {
    if (player.isNetEaseClient()) {
        // 恢复正常视角
        CameraRequest request = new CameraRequest();
        request.anchor = new Vector3(0, 0, 0);
        request.offset = new Vector3(0, 0, 0);
        NetEaseModNukkitUI.getInstance().requestCamera((SynapsePlayer) player, request);
    }
}
```

**规则效果**：
- 玩家模型缩小至62%
- 网易版客户端视角自动调整
- 退出游戏时恢复正常视角

#### 2. 超级速度规则 (CustomRuleZSuperSpeed.java)
```java
// 极限速度效果
@Override
public void onPlayerRespawnAfter(ECPlayer player) {
    player.addEffect(Effect.getEffect(Effect.SPEED)
        .setDuration(20 * 60 * 30)    // 30分钟持续时间
        .setAmplifier(10)             // 速度等级10
        .setVisible(false));          // 隐藏药水效果图标
}
```

**规则效果**：
- 玩家获得极限速度效果
- 移动速度大幅提升
- 隐藏效果图标保持界面清洁

#### 3. 无限火球规则 (CustomRuleZInfiniteFireball.java)
```java
// 火球无限使用机制
@Override
public void onPlayerItemHeld(PlayerItemHeldEvent event, ECPlayer player) {
    Item item = event.getItem();
    if ("bedwars.fireball".equals(ECItemManager.getECItemId(item))) {
        // 为火球添加无限使用标记
        CompoundTag namedTag = item.getNamedTag();
        namedTag.putBoolean("infinity", true);
        item.setNamedTag(namedTag);
        player.getInventory().setItem(event.getSlot(), item);
    }
}
```

**规则效果**：
- 火球物品获得无限使用特性
- 动态修改物品属性
- 实时更新玩家背包

#### 4. 自动道路规则 (CustomRuleZAutoRoad.java)
```java
// 自动建造道路机制
@Override
public void onStageStart() {
    this.stage.getBedWarsConfig().setAutoRoad(true);
}
```

**规则效果**：
- 激活自动道路建造功能
- 简化配置修改流程
- 改变地图建筑机制

#### 5. 水晶治疗强化规则 (CustomRuleZDestroy1ThenExtraCrystalHeal.java)
```java
// 基于破坏数的治疗强化
@Override
public void onGameFick() {
    if (fick++ % 4 == 0) {  // 每4个Fick执行一次
        for (BedWarsStageTeam team : stage.teams) {
            if (stage.getScoreBoard().teamDestroyCount.getOrDefault(team, 0) >= 1) {
                for (BedWarsGuardianObject teamGuardianObject : stage.getTeamGuardianObjects(team)) {
                    if (teamGuardianObject instanceof BedWarsGuardianCrystal) {
                        BedWarsGuardianCrystal crystal = (BedWarsGuardianCrystal) teamGuardianObject;
                        crystal.getCrystal().heal(0.5f);  // 额外回血
                    }
                }
            }
        }
    }
}
```

**规则效果**：
- 破坏敌方目标1个以上的队伍获得水晶额外治疗
- 鼓励积极进攻的策略
- 基于表现的动态奖励机制

## 规则系统集成机制

### 规则注册和加载
```java
// 在BedWarsStage中的集成
public class BedWarsStage extends Stage {
    protected CustomRuleManager customRuleManager = new CustomRuleManager();
    
    // 动态添加规则
    public void addCustomRule(CustomRule rule) {
        this.customRuleManager.addExtraRule(rule);
    }
    
    // 游戏事件集成
    @Override
    public void onStageStart() {
        super.onStageStart();
        this.customRuleManager.onStageStart();
    }
}
```

### 事件驱动机制
```java
// 在游戏主循环中的集成
public void gameLoop() {
    // 游戏Fick处理
    this.customRuleManager.onGameFick();
    
    // 游戏Tick处理
    this.customRuleManager.onGameTick();
}

// 在玩家事件处理中的集成
@EventHandler
public void onPlayerDeath(PlayerDeathEvent event) {
    ECPlayer player = (ECPlayer) event.getEntity();
    
    // 触发自定义规则
    Long customRespawnTime = this.customRuleManager.onPlayerDeathBefore(
        player, killer, teamGuardianAlive);
    
    if (customRespawnTime != null) {
        // 使用自定义规则返回的重生时间
        player.setRespawnTime(customRespawnTime);
    }
}
```

## 规则优先级系统

### 优先级设计原则
1. **数值越大优先级越高**: 通过`getPriority()`方法返回的整数值决定
2. **第一匹配原则**: 对于返回值的钩子方法，第一个返回非null值的规则生效
3. **全执行原则**: 对于无返回值的钩子方法，所有规则都会执行
4. **变身回退机制**: 按优先级顺序尝试变身，第一个成功的生效

### 优先级应用场景
```java
// 示例：重生时间优先级处理
public Long onPlayerDeathBefore(ECPlayer player, ECPlayer killer, boolean teamGuardianAlive) {
    // 高优先级规则先执行
    for (CustomRule customRule : customRuleList) {
        Long time = customRule.onPlayerDeathBefore(player, killer, teamGuardianAlive);
        if (time != null) {
            return time;  // 第一个规则设定的时间生效
        }
    }
    return null;  // 使用默认重生时间
}
```

## 开发指南

### 1. 创建新的自定义规则
```java
// 规则实现模板
public class CustomRuleExample implements CustomRule {
    
    private final BedWarsStage stage;
    
    public CustomRuleExample(BedWarsStage stage) {
        this.stage = stage;
    }
    
    @Override
    public TranslateMessage getName() {
        return new TranslateMessage("bedwars.extra.example");
    }
    
    @Override
    public String getPrefix() {
        return TextFormat.GREEN.toString();  // 疯狂规则用绿色
        // return TextFormat.RED.toString();   // 友好规则用红色
    }
    
    @Override
    public int getPriority() {
        return 100;  // 设置优先级
    }
    
    // 实现需要的钩子方法
    @Override
    public void onPlayerRespawnAfter(ECPlayer player) {
        // 自定义逻辑实现
    }
}
```

### 2. 规则注册流程
```java
// 在CustomRule接口中添加到相应列表
List<Function<BedWarsStage, CustomRule>> REGISTERED_POSITIVE = Arrays.asList(
    // 现有规则...
    CustomRuleExample::new  // 添加新规则
);
```

### 3. 多语言支持
```java
// 在语言文件中添加翻译键
INSERT INTO ec2017.cfgLanguage (`key`, en, zh, pt, es, ja, zh_TW) VALUES 
('bedwars.extra.example', 'Example Rule', '示例规则', 'Regra Exemplo', 'Regla Ejemplo', '例ルール', '示例規則');
```

### 4. 规则测试和调试
```java
// 调试信息输出
@Override
public void onStageStart() {
    ECBedWars.getInstance().getLogger().info(
        "Custom rule " + getName().msg + " activated for stage " + stage.getStageId());
}

// 条件检查
@Override
public void onPlayerRespawnAfter(ECPlayer player) {
    if (!stage.isPlayerTeamAlive(player)) {
        return;  // 安全检查
    }
    // 规则逻辑...
}
```

## 性能优化建议

### 1. 执行效率优化
```java
// 避免频繁的重复计算
private final Map<ECPlayer, Long> playerCache = new HashMap<>();

@Override
public void onGameTick() {
    long currentTime = System.currentTimeMillis();
    // 缓存计算结果，减少重复操作
}
```

### 2. 内存管理
```java
// 及时清理缓存数据
@Override
public void onPlayerQuit(ECPlayer player) {
    playerCache.remove(player);  // 清理玩家相关缓存
}
```

### 3. 条件检查优化
```java
@Override
public void onGameFick() {
    // 添加执行条件，避免不必要的计算
    if (stage.getBedWarsStageState() != BedWarsStageState.STARTED) {
        return;
    }
    // 规则逻辑...
}
```

## 规则系统最佳实践

### 1. 规则设计原则
- **单一职责**: 每个规则专注于一个特定的游戏机制修改
- **最小影响**: 规则应该最小化对其他系统的影响
- **可组合性**: 规则之间应该能够良好组合，避免冲突
- **性能考虑**: 避免在高频调用的钩子中进行重计算

### 2. 错误处理
```java
@Override
public void onPlayerRespawnAfter(ECPlayer player) {
    try {
        // 规则逻辑
    } catch (Exception e) {
        ECBedWars.getInstance().getLogger().error(
            "Error in custom rule " + getName().msg, e);
    }
}
```

### 3. 兼容性考虑
```java
@Override
public void onPlayerRespawnAfter(ECPlayer player) {
    // 检查客户端兼容性
    if (player.isNetEaseClient()) {
        // 网易版特殊处理
    } else {
        // 标准客户端处理
    }
}
```

## 总结

起床战争自定义规则系统通过精心设计的接口和管理机制，实现了高度灵活和可扩展的游戏变体系统。系统的核心优势包括：

1. **灵活的架构设计**: 基于接口的规则定义，支持无限扩展
2. **完善的生命周期管理**: 覆盖游戏各个阶段的钩子方法
3. **智能的优先级系统**: 确保规则间的正确执行顺序
4. **丰富的规则库**: 友好规则和疯狂规则提供不同的游戏体验
5. **事件驱动机制**: 高效的事件分发和处理系统

这样的设计不仅满足了当前的游戏变体需求，也为未来的功能扩展和创新玩法提供了强大的技术支撑。通过自定义规则系统，开发团队可以快速实现各种创意玩法，为玩家提供持续新鲜的游戏体验。