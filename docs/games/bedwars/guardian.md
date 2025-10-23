# ECBedWars 守护系统设计文档

## 概述

ECBedWars 守护系统是起床战争核心机制之一，负责管理需要被保护的关键对象（床铺和水晶）。该系统提供了统一的守护对象抽象、智能护盾机制、伤害检测、摧毁逻辑和视觉效果管理。

## 核心架构

### 1. 守护对象基类 (`BedWarsGuardianObject`)

#### 类设计概览
```java
public abstract class BedWarsGuardianObject {
    private final BedWarsStage stage;           // 所属游戏阶段
    private final BedWarsStageTeam team;        // 所属队伍
    private final Vector3 position;             // 守护对象位置
    private final int index;                    // 守护对象索引
    private final Vector3 nearestSpawn;         // 最近的重生点
    private GuardianShield shield = null;       // 护盾系统
}
```

#### 核心功能

**1. 位置管理**
- 自动计算最近重生点：基于距离计算选择最优重生位置
- 支持多重生点配置：适应复杂地图布局
- 索引标识系统：支持同队伍多个守护对象的字母标识（A, B, C...）

**2. 生命周期管理**
```java
// 抽象方法，由子类实现具体逻辑
public abstract boolean isAlive();
protected abstract void destroy0(ECPlayer player);

// 统一摧毁处理
public void destroy(ECPlayer player) {
    if (!this.isAlive()) return;
    
    // 1. 执行具体摧毁逻辑
    this.destroy0(player);
    
    // 2. 触发游戏事件
    if (this.getStage().getBedWarsStageState() == BedWarsStageState.STARTED) {
        // 事件通知、积分更新、自定义规则触发
        Server.getInstance().getPluginManager().callEvent(
            new InGameTargetDestroyEvent(this.stage, player, this)
        );
        // 更新记分板、玩家统计等
    }
}
```

**3. 事件处理系统**
- `onStageStart()`: 游戏开始时的初始化
- `onBlockBreak()`: 方块破坏事件处理
- `onPlayerBucketEmpty()`: 水桶倾倒事件处理  
- `onFick()`: 定时更新逻辑

## 2. 床铺守护实现 (`BedWarsGuardianBed`)

### 核心特性

#### **床铺检测算法**
```java
public Block[] getBedBlocks() {
    Block block = this.getStage().gameMap.getBlock(this.getPosition());
    if (block.getId() == BlockID.BLOCK_BED) {
        // 检测床铺上半部分和下半部分
        if ((block.getDamage() & 0x08) == 0x08) { // 上半部分
            // 搜索相邻的下半部分
        } else { // 下半部分  
            // 搜索相邻的上半部分
        }
    }
    return bedBlocks;
}
```

#### **装饰品系统**
- **装饰品实体**: `BedWarsBedOrnament` 实体管理
- **装饰品类型**: `BedWarsOrnamentBedOrnament` 多样化装饰
- **装饰品位置计算**: 基于床铺方向的精确定位
- **浮动文字提示**: 显示装饰品提供者信息，60秒后自动消失

```java
public void setOrnament(ECPlayer provider, BedWarsOrnamentBedOrnament ornament) {
    if (this.bedOrnamentEntity == null) {
        this.bedOrnamentEntity = new BedWarsBedOrnament(calculateBedOrnamentLocation(), 
                                                        this.getTeam().name());
    }
    this.ornament = ornament;
    this.bedOrnamentEntity.setOrnament(ornament);
    this.ornament.onInit(this.bedOrnamentEntity);
    
    // 更新提示文字
    if (this.floatingText != null) {
        this.floatingText.setText(new TranslateMessage("bedwars.ornament.bed.provider", 
                                                       provider.getAliasName()));
    }
}
```

#### **摧毁特效系统**
- **声音效果**: 队内 `MOB_WITHER_DEATH`，敌方 `MOB_ENDERDRAGON_GROWL`
- **视觉特效**: `HugeExplodeSeedParticle` 爆炸粒子
- **装饰品摧毁效果**: `BedWarsOrnamentBedDestroyEffect` 个性化摧毁特效
- **标题提示系统**: 支持多床铺索引显示（床A、床B等）

#### **自动防护建造**
```java
public void buildProtect() {
    // 第一层：木板保护（5tick延迟）
    Block plank = Block.get(Block.PLANKS);
    // 第二层：羊毛保护（10tick延迟）  
    Block wool = this.getTeam().getBlockStatesWool().getBlock();
    // 第三层：染色玻璃保护（15tick延迟）
    Block stainedGlass = Block.get(Block.STAINED_GLASS, 
                                   this.getTeam().getTeamDyeColor().getWoolData());
    
    // 分层递进式建造，每层都有音效反馈
}
```

## 3. 水晶守护实现 (`BedWarsGuardianCrystal`)

### 实体集成设计

#### **水晶实体管理**
```java
public class BedWarsGuardianCrystal extends BedWarsGuardianObject {
    private final EntityCrystal crystal;      // 绑定的水晶实体
    private boolean isAlive = true;           // 存活状态
    
    public BedWarsGuardianCrystal(BedWarsStage stage, BedWarsStageTeam team, 
                                  Vector3 position, int index, int health) {
        super(stage, team, position, index);
        this.crystal = new EntityCrystal(this, team, 
                                        Location.fromObject(position, this.getLevel()), 
                                        health);
    }
}
```

#### **水晶实体特性** (`EntityCrystal`)

**1. 视觉系统**
- **粒子效果**: 队伍颜色的 `WITCH_SPELL` 粒子环绕
- **血量显示**: 彩色进度条 + 数值显示的浮动文字
- **低血量警告**: 血量低于6时队内标题提示

```java
public String getHealthString() {
    double bi = ((double) this.getHealth()) / ((double) this.getMaxHealth());
    StringBuilder re = new StringBuilder(this.team.getTeamTextColor());
    for (int i = 0; i < 40; i++) {
        if (i == Mth.floor(bi * 40)) re.append(TextFormat.GRAY);
        re.append("|");
    }
    re.append(this.team.getTeamTextColor()).append(" ")
            .append((int) (this.getHealth())).append("/").append(this.getMaxHealth());
    return re.toString();
}
```

**2. 战斗系统**
- **攻击检测**: 6方向射线检测，确保攻击路径无阻挡
- **友方攻击转移**: 攻击同队水晶时转移到重叠的敌方玩家
- **自然恢复**: 18秒无伤害后每秒恢复0.5血量，伴有治疗粒子

**3. 摧毁效果**
- **死亡龙实体**: `EntityDeadDragon` 特殊视觉效果
- **爆炸效果**: `HugeExplodeSeedParticle` + `SOUND_EXPLODE`
- **震动反馈**: 队员和附近玩家设备震动3秒

## 4. 护盾系统 (`GuardianShield`)

### 核心设计理念

护盾系统采用**条件-触发-回调**的三层架构，提供灵活的防护机制。

#### **接口设计**
```java
// 触发条件接口
public interface ShieldTrigger {
    boolean test(GuardianShield shield);
    
    // 预制触发器：血量+玩家范围
    static ShieldTrigger ofHealthAndPlayers(Entity entity, float healthPercent, 
                                           double playersRadius);
}

// 触发回调接口  
public interface TriggerCallback {
    void onTrigger(GuardianShield shield);
    
    // 预制回调：弹飞玩家
    static TriggerCallback ofReboundPlayer(double playerRadius);
    // 预制回调：团队效果
    static TriggerCallback ofTeamEffect(Effect... effects);
}

// 攻击回调接口
public interface AttackCallback {
    boolean onAttack(GuardianShield shield, ECPlayer player);
    
    // 预制回调：攻击反弹
    static AttackCallback ofReboundPlayer();
}
```

#### **护盾状态机**
```java
public class GuardianShield {
    private boolean ready = true;              // 是否准备就绪
    private long effectiveUntil = 0;           // 有效期截止时间
    private long nextEnableTime = 0;           // 下次启用时间
    
    public void onUpdate() {
        if (ready) {
            if (trigger.test(this)) {
                ready = false;
                effectiveUntil = System.currentTimeMillis() + effectiveTime;
                nextEnableTime = System.currentTimeMillis() + cooldownTime;
                triggerCallback.onTrigger(this);  // 触发效果
            }
        } else {
            if (nextEnableTime < System.currentTimeMillis()) {
                ready = true;  // 冷却完成，重新准备
            }
        }
        notice.onUpdate();  // 更新攻击提醒
    }
}
```

#### **攻击提醒系统**
```java
public class AttackedNotice {
    private long noticeAttackedCoolDownUntil = 0;  // 提醒冷却
    private int leftCount = 0;                     // 剩余音效次数
    private long lastPlaySound = 0;                // 上次播放时间
    
    public void tryNotice() {
        if (System.currentTimeMillis() > this.noticeAttackedCoolDownUntil) {
            this.noticeAttackedCoolDownUntil = System.currentTimeMillis() + 5000;
            this.startNotice(3);  // 播放3次提醒音效
        }
    }
}
```

## 5. 系统集成与管理

### 在 BedWarsStage 中的集成

#### **守护对象管理**
```java
// BedWarsStage.java
protected Map<BedWarsStageTeam, List<BedWarsGuardianObject>> guardianObjects = new HashMap<>();

// 获取队伍守护对象
public List<BedWarsGuardianObject> getTeamGuardianObjects(BedWarsStageTeam team) {
    return team != null ? this.guardianObjects.getOrDefault(team, Collections.emptyList()) 
                        : Collections.emptyList();
}

// 检查队伍守护对象是否存活
public boolean isTeamGuardianAlive(BedWarsStageTeam team) {
    List<BedWarsGuardianObject> guardian = this.getTeamGuardianObjects(team);
    return guardian != null && guardian.stream().anyMatch(BedWarsGuardianObject::isAlive);
}
```

#### **重生逻辑集成**
```java
// 多守护对象重生点选择
if (this.getTeamGuardianObjects(team).size() > 1 && deathPos != null) {
    pos = this.getTeamGuardianObjects(team).stream()
            .min(Comparator.comparing(o -> o.getPosition().distanceSquared(deathPos)))
            .map(BedWarsGuardianObject::getNearestSpawn)
            .orElse(null);
}
```

#### **击杀统计集成**
```java
// 主场击杀检测
Optional.ofNullable(this.getTeamGuardianObjects(killerTeam)).ifPresent(list -> {
    for (BedWarsGuardianObject guardian : list) {
        if (guardian.isAlive() && guardian.getPosition().distance(player.getPlayer()) < 20) {
            getScoreBoard().getPlayerScore(killer.getName()).homeKill++;
            break;
        }
    }
});
```

### 自定义规则集成

守护系统与自定义规则系统深度集成，支持：

1. **摧毁触发规则**: `onPlayerDestroyGuardianObject()`
2. **水晶额外治疗**: `CustomRuleZDestroy1ThenExtraCrystalHeal`
3. **摧毁加血规则**: `CustomRuleZDestroyAddHealth`
4. **玩家治疗规则**: `CustomRuleZDestroy2ThenHealPlayers`

## 6. 多语言支持

### 语言键设计

#### **床铺相关**
- `bedwars.bed.attacked.msg`: 床铺被攻击消息
- `bedwars.popup.destroyed.bed.title`: 床铺被摧毁标题
- `bedwars.popup.destroyed.bed.index`: 多床铺索引标题  
- `bedwars.popup.destroyed.respawn`: 无法重生提示
- `bedwars.ornament.bed.tip`: 装饰品提示文本
- `bedwars.ornament.bed.provider`: 装饰品提供者信息

#### **水晶相关**  
- `bedwars.crystal.attacked.msg`: 水晶被攻击消息
- `bedwars.crystal.name`: 水晶名称显示
- `bedwars.popup.lowhp`: 水晶低血量警告
- `bedwars.popup.destroyed`: 水晶被摧毁标题
- `bedwars.popup.destroyed.0`: 水晶摧毁标题（敌方视角）
- `bedwars.popup.destroyed.1`: 水晶摧毁副标题

### 建议的多语言数据库条目

```sql
-- 守护系统核心消息
INSERT INTO ec2017.cfgLanguage (`key`, en, zh, pt, es, ja, zh_TW) VALUES 
('bedwars.bed.attacked.msg', 'Your bed is under attack!', '你的床正在被攻击！', 'Sua cama está sendo atacada!', '¡Tu cama está siendo atacada!', 'あなたのベッドが攻撃されています！', '你的床正在被攻擊！'),
('bedwars.crystal.attacked.msg', 'Your crystal is under attack!', '你的水晶正在被攻击！', 'Seu cristal está sendo atacado!', '¡Tu cristal está siendo atacado!', 'あなたのクリスタルが攻撃されています！', '你的水晶正在被攻擊！'),
('bedwars.popup.lowhp', '{0} Crystal is low on health!', '{0} 水晶血量过低！', 'Cristal {0} está com pouca vida!', '¡El cristal {0} tiene poca salud!', '{0}クリスタルの体力が少ない！', '{0} 水晶血量過低！'),
('bedwars.ornament.bed.tip', 'Use bed ornament to decorate', '使用床铺装饰品装饰', 'Use ornamento de cama para decorar', 'Usa ornamento de cama para decorar', 'ベッドの装飾品で飾る', '使用床鋪裝飾品裝飾'),
('bedwars.ornament.bed.provider', 'Provided by {0}', '由 {0} 提供', 'Fornecido por {0}', 'Proporcionado por {0}', '{0}によって提供', '由 {0} 提供');
```

## 7. 性能优化策略

### 更新频率优化

1. **护盾更新**: 每tick检查，但使用时间戳减少计算
2. **水晶粒子**: 每5tick更新一次粒子效果
3. **血量显示**: 每10tick更新一次显示文字  
4. **自然恢复**: 每20tick检查一次恢复条件

### 内存管理

1. **延迟加载**: 装饰品实体按需创建
2. **及时清理**: 浮动文字定时自动清理
3. **对象池**: 粒子效果使用对象池优化
4. **引用管理**: 避免循环引用，正确处理实体生命周期

### 网络优化

1. **批量更新**: 护盾效果批量发送给玩家
2. **距离过滤**: 根据距离过滤粒子效果接收者
3. **优化设置**: 集成 `Optimize.GAMING_EFFECT` 性能开关
4. **压缩协议**: 使用高效的网络协议传输状态更新

## 8. 扩展性设计

### 新守护对象类型

系统支持轻松添加新的守护对象类型：

```java
public class BedWarsGuardianTotem extends BedWarsGuardianObject {
    @Override
    public boolean isAlive() {
        // 图腾存活逻辑
    }
    
    @Override
    protected void destroy0(ECPlayer player) {
        // 图腾摧毁逻辑
    }
}
```

### 护盾效果扩展

```java
// 自定义触发条件
ShieldTrigger customTrigger = shield -> {
    // 自定义逻辑
    return someCondition;
};

// 自定义触发效果
TriggerCallback customCallback = shield -> {
    // 自定义效果
    performCustomEffect();
};
```

### 装饰品系统扩展

支持新的装饰品类型和特效，只需实现对应的装饰品接口和实体类。

## 总结

ECBedWars 守护系统通过统一的抽象设计、灵活的护盾机制、完善的事件处理和丰富的视觉效果，为起床战争提供了核心的游戏机制支持。系统具有良好的扩展性、性能优化和多语言支持，是ECBedWars架构中的关键组件。

该系统不仅实现了基础的床铺和水晶保护功能，还通过装饰品系统、护盾机制等高级特性，大大增强了游戏的趣味性和策略性，为玩家提供了丰富的游戏体验。