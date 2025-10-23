# Stage系统详解

## 概述

Stage系统是CodeFunCore中游戏房间管理的核心架构，负责管理从房间创建、玩家匹配、游戏运行到房间销毁的完整生命周期。该系统支持两种架构：传统的Stage类和现代化的GracefulStage类，为不同复杂度的游戏提供了灵活的实现方案。

## 系统架构演进

### 传统Stage架构

传统Stage系统基于继承和事件监听，提供了游戏房间的基础功能：

```java
public abstract class Stage implements Listener {
    // 地图和状态
    public Level waitingMap;         // 等待地图
    public Level gameMap;           // 游戏地图
    private StageState state;       // 房间状态
    
    // 玩家管理
    protected final List<ECPlayer> players = new LinkedList<>();  // 玩家列表
    protected final Map<String, ECPlayer> disconnect = new HashMap<>();  // 断线玩家
    protected final HashSet<String> viewerOnlyPlayerNames = new HashSet<>(); // 观战玩家
    
    // 房间配置
    public int maxCount = 0;         // 最大玩家数
    public int startCount = 0;       // 开始游戏所需玩家数
    public int fastStartCount = 0;   // 快速开始玩家数
    public int fastStartTime = 15;   // 快速开始时间
    public int pCount = 0;           // 当前玩家数
    
    // 地图配置
    public StageWaitingMapConfig waitingMapConfig;
    public StageGameMapConfig gameMapConfig;
    
    // 计时器
    protected final long createTime = System.currentTimeMillis(); // 创建时间
    public long fick = 0;            // 游戏tick计数
    public int mainTimer = -90;      // 主计时器
    public int forceDestroyTimer = -1; // 强制销毁计时器
    
    // 计分板
    protected StageScoreBoard<? extends PlayerScore> scoreBoard;
}
```

### GracefulStage现代架构

GracefulStage引入了状态机、模块化和泛型设计：

```java
public abstract class GracefulStage<STAGE extends GracefulStage, C extends StageGameMapConfig, S extends AbstractScoreBoard> extends Stage {
    
    // 状态机核心 - 嵌套结构管理游戏状态
    protected RootStageGamingState<STAGE> gamingState;
    
    // 模块系统 - 可插拔功能组件
    private final Map<String, StageModule<STAGE>> modules = new LinkedHashMap<>();
    
    public GracefulStage(int maxCount, int startCount, int fastStartCount) {
        this(maxCount, startCount, fastStartCount, null);
    }
    
    public GracefulStage(int maxCount, int startCount, int fastStartCount, @Nullable Integer fastStartTime) {
        super(maxCount, startCount, fastStartCount, fastStartTime);
        this.branchListener = new RootInGamingStageBranchListener(this);
    }
}
```

## Stage生命周期管理

### 房间状态枚举

```java
public enum StageState implements Serializable {
    UNINITIALIZED,  // 未初始化
    WAITING,        // 等待玩家
    READY,          // 准备开始游戏
    STARTING,       // 正在开始游戏
    RUNNING,        // 已开始游戏
    STOPPING,       // 正在结束游戏
    DESTROYABLE     // 下一步就是destroy
}
```

### 核心生命周期方法

**房间初始化方法**
```java
public AsyncPromise<Integer> onInit(int requestId, String type, String waitingMap, 
                                   String gameMap, String matching, String roomName, 
                                   String roomOwner, String metadata) throws StageException {
    StagePool pool = CodeFunCoreTool.getInstance().getStagePool();
    this.gameMapConfig = pool.getGameMapConfigManager(type).instanceConfig(gameMap, this);
    this.waitingMapConfig = pool.getWaitingMapConfigManager().instanceConfig(waitingMap, this);
    if (this.info == null) this.loadStageInfo(requestId, matching, roomName, roomOwner, metadata);
    this.setStageState(StageState.UNINITIALIZED);
    
    return new AsyncTransientScheduler<Integer>("Stage创建后初始化（RMI上报与获取runtimeId）", handler -> {
        int runtimeId = this.addToRMIAPI();  //rmi!
        handler.handle(runtimeId);
        handler.runSync(() -> {
            this.logger = new StageLogger(this);
            this.loadMetadataBase(); //对metadata进行解析，进行一些通用基础设置
            this.loadAllMaps().whenSuccess(unit -> this.getLogger().info("[{}] 地图加载完成: {} {}", 
                this.getStageIDText(), this.waitingMap.getFolderName(), this.gameMap.getFolderName()));
        });
    }).schedule();
}
```

**玩家管理方法**
```java
public final boolean onJoin(ECPlayer player) {
    // 实际的玩家加入逻辑由子类实现
    return this.playerJoin(player);
}

public final boolean onQuit(ECPlayer player) {
    // 实际的玩家退出逻辑由子类实现
    return this.playerQuit(player);
}
```

## 事件系统集成

### Stage分支监听器

```java
public class BaseStageBranchListener implements StageBranchListener {
    protected final Stage stage;
    
    public BaseStageBranchListener(Stage stage) {
        this.stage = stage;
    }
    
    // 具体的事件处理由继承类实现
}
```

### 事件注册

Stage系统通过StageBranchListener模式处理事件，每个Stage都有自己的事件监听器：

```java
public StageBranchListener branchListener = new BaseStageBranchListener(this);
```

## 地图配置系统

### 地图配置基类

```java
// 等待地图配置
public StageWaitingMapConfig waitingMapConfig;

// 游戏地图配置  
public StageGameMapConfig gameMapConfig;

// 地图加载器
public StageMapLoader mapLoader;
```

### 地图加载流程

```java
public AsyncPromise<Unit> loadAllMaps() {
    // 异步加载所有地图
    // 实际实现在Stage基类中
}
```

## StagePool管理

Stage系统通过StagePool进行统一管理：

```java
public class StagePool {
    // 管理所有活跃的Stage实例
    // 提供Stage的创建、查找、清理功能
}
```

## 计分板系统

### 计分板基类

```java
protected StageScoreBoard<? extends PlayerScore> scoreBoard;
```

每个Stage都可以有自己的计分板实现，用于显示游戏得分和排行信息。

## 异常处理

### Stage异常体系

```java
public class StageException extends Exception {
    // Stage相关的异常处理
}
```

Stage系统提供了完整的异常处理机制，确保游戏运行的稳定性。

## 总结

Stage系统是CodeFunCore的核心游戏管理架构，通过传统Stage和GracefulStage两种模式，为不同复杂度的游戏提供了灵活的实现方案。系统涵盖了完整的生命周期管理、玩家管理、地图加载、事件处理等功能，通过模块化设计确保了系统的可扩展性和稳定性。

传统Stage适合简单的游戏模式，而GracefulStage通过状态机和模块化设计，为复杂游戏提供了更强大和灵活的架构支持。