# GracefulStage系统架构详解

## 概述

GracefulStage是CodeFunCore中的现代化Stage系统，提供了更优雅和高效的游戏房间开发架构。它基于状态机、模块化、泛型设计等现代软件工程理念，为游戏房间提供了强大的抽象能力。

## 核心架构

### 主要组成部分

GracefulStage系统由4个核心部分组成：
1. **状态机系统** - 管理游戏房间的各种状态
2. **模块系统** - 提供可插拔的功能模块
3. **地图配置系统** - 管理游戏地图配置
4. **记分板系统** - 处理游戏计分显示

### 核心类结构

```java
public abstract class GracefulStage<STAGE extends GracefulStage, C extends StageGameMapConfig, S extends AbstractScoreBoard> extends Stage {
    
    // 状态机为嵌套结构，一个Stage一个游戏根状态机
    protected RootStageGamingState<STAGE> gamingState;
    
    // 模块系统
    private final Map<String, StageModule<STAGE>> modules = new LinkedHashMap<>();
    
    public GracefulStage(int maxCount, int startCount, int fastStartCount) {
        super(maxCount, startCount, fastStartCount);
        this.branchListener = new RootInGamingStageBranchListener(this);
        this.addModule("displayname", new DefaultDisplayNameModule<>(this, false));
    }
}
```

## 状态机系统

### GamingState核心概念

状态机是GracefulStage的核心，每个状态代表游戏房间的一个特定阶段：

```java
public class GamingState<S extends GracefulStage> {
    private final S stage;
    private final GamingState<S> parentState;
    protected long startTimestamp = 0;
    
    // 子状态机管理
    protected final LinkedHashMap<String, Supplier<GamingState<S>>> subStates = new LinkedHashMap<>();
    protected String currentSubStateName = null;
    protected GamingState<S> currentSubState = null;
    protected PeekingIterator<Map.Entry<String, Supplier<GamingState<S>>>> stateIterable;
    
    // 状态机监听器
    private InGamingStageBranchListener<S, ? extends GamingState<S>> listener;
}
```

### 嵌套状态机设计

- **根状态机**: `RootStageGamingState` 是必须使用的顶级状态机
- **子状态机**: 可以嵌套多层子状态，使用 `addSubState()` 添加
- **状态切换**: 使用 `nextSubState()` 自动切换到下一个状态
- **状态生命周期**: `onStateStart()` → `onGameFick()` → `onStateEnd()`

### 状态机生命周期

```java
// 状态开始时
public void onStateStart() {
    if (!this.subStates.isEmpty()) this.nextSubState();
    this.startTimestamp = System.currentTimeMillis();
    this.functionalOnStateStart.forEach(cb -> cb.accept(this));
}

// 状态运行中（每5tick）
public void onGameFick(long fick) {
    if (this.currentSubState != null) this.currentSubState.onGameFick(fick);
    this.functionalOnGameFick.forEach(runnable -> runnable.accept(this, fick));
}

// 状态结束时
public void onStateEnd() {
    if (this.currentSubState != null) this.currentSubState.onStateEnd();
    this.functionalOnStateEnd.forEach(cb -> cb.accept(this));
}
```

## 时间状态机系统

### TimeBasedGamingState

基于倒计时的状态机，常用于有时间限制的游戏阶段：

```java
public class TimeBasedGamingState<S extends GracefulStage> extends GamingState<S> {
    protected long nextStateTimestamp;
    private long duration;
    
    public TimeBasedGamingState(S stage, GamingState<S> parent, long duration) {
        super(stage, parent);
        this.duration = duration;
    }
    
    @Override
    public void onStateStart() {
        super.onStateStart();
        this.nextStateTimestamp = System.currentTimeMillis() + duration;
    }
    
    @Override
    public void onGameFick(long fick) {
        super.onGameFick(fick);
        if (nextStateTimestamp > 0 && System.currentTimeMillis() >= nextStateTimestamp) {
            this.onTimeOut();
            this.functionalOnTimeout.forEach(Runnable::run);
            if (this.getParentState() != null && this.getParentState().currentSubState() == this) 
                this.getParentState().nextSubState();
        }
    }
    
    // 时间到达时触发
    public void onTimeOut() {
        // 子类可重写
    }
}
```

### 根状态机

```java
public class RootStageGamingState<S extends GracefulStage> extends TimeBasedGamingState<S> {
    
    public RootStageGamingState(S stage, long forceStopDuration) {
        super(stage, null, forceStopDuration);
    }
    
    @Override
    public void onNoSuchNextSubState() {
        super.onNoSuchNextSubState();
        // 必须的！清理Stage
        CodeFunCoreTool.getInstance().getStagePool().cleanStage(getStage());
    }
}
```

## 模块系统

### StageModule基础架构

模块系统提供可插拔的功能组件：

```java
public abstract class StageModule<S extends GracefulStage> {
    protected final S stage;
    
    public StageModule(S stage) {
        this.stage = stage;
    }
    
    // 模块生命周期钩子
    public void onLoad() { }
    public void onJoin(ECPlayer player) { }
    public void onQuit(ECPlayer player) { }
    public boolean onDisconnect(ECPlayer player) { return true; }
    public void onReconnect(ECPlayer player) { }
    public void onStart() { }
    public void onFick(long fick) { }
}
```

### 模块注册和管理

```java
// 注册模块
public final void addModule(String key, StageModule module) {
    if (key.equals("team") && !(module instanceof StageTeamModule)) 
        throw new StageModuleNotAllowedAddException(key);
    if (key.equals("displayname") && !(module instanceof DisplayNameModule)) 
        throw new StageModuleNotAllowedAddException(key);
    this.modules.put(key, module);
    module.onLoad();
}

// 获取模块
public final StageModule getModule(String key) throws StageModuleNotLoadedException {
    if (this.modules.containsKey(key)) {
        return this.modules.get(key);
    } else {
        throw new StageModuleNotLoadedException(key);
    }
}
```

### 内置模块类型

#### 显示名称模块
```java
public class DefaultDisplayNameModule<S extends GracefulStage> extends DisplayNameModule<S> {
    private final boolean usePrefix;
    
    public DefaultDisplayNameModule(S stage, boolean usePrefix) {
        super(stage);
        this.usePrefix = usePrefix;
    }
    
    @Override
    public void setPlayerDisplayName(ECPlayer player) {
        // 设置玩家显示名称逻辑
    }
}
```

#### 队伍模块
```java
public abstract class StageTeamModule<S extends GracefulStage> extends StageModule<S> {
    
    public StageTeamModule(S stage) {
        super(stage);
    }
    
    // 获取观察者队伍
    public abstract StageTeam getTeamViewer();
    
    // 队伍相关方法
    public abstract void assignPlayerToTeam(ECPlayer player);
    public abstract StageTeam getPlayerTeam(ECPlayer player);
}
```

## 记分板系统

### AbstractScoreBoard

抽象记分板提供游戏计分显示的基础框架：

```java
public abstract class AbstractScoreBoard<S extends GracefulStage, B extends AbstractScoreBoard<S, B, PS>, PS extends AbstractPlayerScore> implements StageScoreBoard<PS> {
    
    private transient final S stage;
    private transient PlayerScoreFactory<B, PS> playerScoreFactory;
    public Map<String, PS> scores = new HashMap<>();
    public String firstBlood;
    
    public AbstractScoreBoard(S stage, PlayerScoreFactory<B, PS> playerScoreFactory) {
        this.stage = stage;
        this.playerScoreFactory = playerScoreFactory;
    }
    
    public S getStage() {
        return this.stage;
    }
    
    // 显示更多分数信息
    public abstract void showMoreScores(String name, Location loc);
}
```

### 具体记分板实现

#### 击杀记分板
```java
public class KillingBasedScoreBoard<S extends GracefulStage<?, ?, ?>, B extends AbstractScoreBoard<S, B, PS>, PS extends KillingBasedPlayerScore<?, ?>> extends AbstractScoreBoard<S, B, PS> implements StageScoreBoard<PS> {
    // 基于击杀的计分实现
}
```

#### 等级记分板
```java
public class LevelScoreBasedScoreBoard<S extends GracefulStage, B extends AbstractScoreBoard<S, B, PS>, PS extends LevelScoreBasedPlayerScore> extends AbstractScoreBoard<S, B, PS> implements StageScoreBoard<PS> {
    // 基于等级的计分实现
}
```

## 玩家管理增强

### 生命周期集成

GracefulStage重写了玩家管理方法以集成模块系统：

```java
@Override
public boolean playerJoin(ECPlayer player) {
    if (super.playerJoin(player)) {
        // 通知所有模块玩家加入
        this.modules.forEach((k, m) -> m.onJoin(player));
        // 设置玩家显示名称
        this.setPlayerDisplayName(player);
        return true;
    }
    return false;
}

@Override
public boolean onQuit(ECPlayer player) {
    if (super.onQuit(player)) {
        // 通知状态机玩家退出
        this.gamingState.onQuit(player);
        // 通知所有模块玩家退出
        this.modules.forEach((k, m) -> m.onQuit(player));
        return true;
    }
    return false;
}
```

### 断线重连处理

```java
@Override
public void onDisconnect(ECPlayer player) {
    boolean moduleSuper = this.modules.values().stream().allMatch(m -> m.onDisconnect(player));
    boolean stateSuper = this.gamingState.onDisconnect(player);
    if (moduleSuper && stateSuper) {
        super.onDisconnect(player);
    }
}

@Override
public void onReconnect(ECPlayer player) {
    super.onReconnect(player);
    this.modules.forEach((k, m) -> m.onReconnect(player));
    this.gamingState.onReconnect(player);
    setPlayerDisplayName(player);
}
```

## 游戏状态管理

### 游戏运行状态判断

```java
@Override
public boolean isGameRunning() {
    return this.getStageState() == StageState.RUNNING && 
           this.gamingState.isStateMeansGameRunning();
}

// 在状态机中实现
public boolean isStateMeansGameRunning() {
    if (this.currentSubState != null) 
        return this.currentSubState.isStateMeansGameRunning();
    return true;  // 默认游戏正在运行
}
```

### 胜利条件检查

```java
@Override
public boolean checkWin() {
    return this.gamingState.checkWin();
}

// 在状态机中递归检查
public boolean checkWin() {
    if (this.currentSubState != null) 
        return this.currentSubState.checkWin();
    return false;
}
```

## 开发最佳实践

### 1. 状态机设计原则

- **单一职责**: 每个状态只处理特定的游戏阶段
- **层次化设计**: 使用嵌套状态机组织复杂的游戏流程
- **时间管理**: 对有时间限制的状态使用 `TimeBasedGamingState`
- **错误处理**: 在状态切换时妥善处理异常情况

### 2. 模块开发指南

- **功能内聚**: 每个模块应该实现一个完整的功能集
- **松耦合**: 模块间应该尽量减少直接依赖
- **生命周期**: 正确实现模块的生命周期方法
- **资源管理**: 在模块中合理管理资源的创建和释放

### 3. 记分板实现

- **性能考虑**: 避免频繁更新记分板显示
- **数据一致性**: 确保分数数据在各个状态间保持一致
- **可扩展性**: 设计时考虑后续功能扩展的需要

### 4. 错误处理

GracefulStage系统提供了完善的错误处理机制：

```java
// 状态机异常处理
try {
    this.gamingState.onGameFick(this.fick);
} catch (Exception e) {
    this.getLogger().alert(this.gamingState.fullCurrentSubStateName() + 
                          " 执行 onGameFick 时抛出错误", e);
}

// 模块异常隔离
this.modules.forEach((k, m) -> {
    try {
        m.onFick(this.fick);
    } catch (Exception e) {
        this.getLogger().warning("模块 " + k + " 执行出错: " + e.getMessage());
    }
});
```

## 总结

GracefulStage系统通过状态机、模块化、泛型设计等现代架构理念，为游戏房间开发提供了强大而灵活的框架。它不仅简化了复杂游戏逻辑的实现，还提供了良好的可维护性和可扩展性，是CodeFunCore中游戏开发的推荐架构。