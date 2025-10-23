# 事件系统详解

## 概述

CodeFunCore的事件系统基于Nukkit的事件驱动架构，通过多个专门的监听器处理不同类型的游戏事件。该系统为EaseCation服务器提供了事件处理能力，涵盖了玩家事件、服务器事件、Stage事件等多种类型。

## 系统架构

### 事件处理架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                      Nukkit核心事件系统                          │
├─────────────────────────────────────────────────────────────────┤
│                    CodeFunCore事件分发层                         │
├─────────────────────────────────────────────────────────────────┤
│  PlayerListener  │  ServerListener  │  StageListener  │ 其他...  │
├─────────────────────────────────────────────────────────────────┤
│              分支监听器 (Branch Listeners)                      │
├─────────────────────────────────────────────────────────────────┤
│         业务逻辑处理器 (Business Logic Handlers)                │
└─────────────────────────────────────────────────────────────────┘
```

### 事件流向

1. **事件触发**: 游戏行为触发Nukkit原生事件
2. **核心拦截**: CodeFunCore监听器拦截并预处理
3. **分支分发**: 根据当前上下文分发到相应分支监听器
4. **业务处理**: 具体业务逻辑处理器处理事件

## 核心监听器

### 1. PlayerListener - 玩家事件核心监听器

**基础架构**
```java
public class PlayerListener extends BasePluginListener implements Listener {
    
    private final CounterLimit limitSound = new CounterLimit(2);
    private final CounterLimit limitCommand = new CounterLimit(2);
    
    public PlayerListener(CodeFunCore plugin) {
        super(plugin);
    }
    
    @EventHandler
    public void onPlayerCreation(PlayerCreationEvent event) {
        // Player类选择逻辑
        event.setPlayerClass(ECPlayer12.class);
    }
    
    @EventHandler
    public void onSynapsePlayerCreation(SynapsePlayerCreationEvent event) {
        // 根据协议版本选择对应的ECPlayer实现类
        if (SynapsePlayer116100.class.equals(event.getPlayerClass())) {
            event.setPlayerClass(ECPlayer116100.class);
        } else if (SynapsePlayer116.class.equals(event.getPlayerClass())) {
            event.setPlayerClass(ECPlayer116.class);
        }
        // ... 其他版本的处理
    }
}
```

PlayerListener的主要功能是处理玩家类的创建，确保使用正确的ECPlayer实现类。

### 2. ServerListener - 服务器事件监听器

```java
public class ServerListener extends BasePluginListener implements Listener {
    
    public ServerListener(CodeFunCore plugin) {
        super(plugin);
    }
    
    // 处理服务器相关事件
    // 具体实现在实际的ServerListener类中
}
```

### 3. StageListener - Stage事件监听器

```java
public class StageListener extends BasePluginListener implements Listener {
    
    public StageListener(CodeFunCore plugin) {
        super(plugin);
    }
    
    // 处理Stage相关事件
    // 具体实现在实际的StageListener类中
}
```

### 4. 其他专门监听器

CodeFunCore还注册了多个专门的监听器：

- **EntityListener**: 处理实体相关事件
- **LevelListener**: 处理世界/关卡相关事件  
- **ECVIPListener**: 处理VIP相关事件
- **CustomStageGuidanceListener**: 处理Stage引导事件
- **ParkourListener**: 处理跑酷相关事件
- **ECFunctionTestListener**: 开发模式下的功能测试监听器

## 分支监听器系统

### BaseStageBranchListener - Stage分支监听器基类

```java
public class BaseStageBranchListener implements StageBranchListener {
    protected final Stage stage;
    
    public BaseStageBranchListener(Stage stage) {
        this.stage = stage;
    }
    
    // 具体的事件处理由继承类实现
}
```

### Stage分支监听器模式

每个Stage都有自己的分支监听器来处理Stage内的事件：

```java
public StageBranchListener branchListener = new BaseStageBranchListener(this);
```

## 自定义事件系统

### Stage相关事件

**PlayerJoinStageEvent - 玩家加入Stage事件**
```java
public class PlayerJoinStageEvent extends PlayerEvent implements Cancellable {
    private final Stage stage;
    private boolean cancelled = false;
    
    public PlayerJoinStageEvent(ECPlayer player, Stage stage) {
        this.player = player;
        this.stage = stage;
    }
    
    public Stage getStage() {
        return stage;
    }
    
    @Override
    public boolean isCancelled() {
        return cancelled;
    }
    
    @Override
    public void setCancelled(boolean cancelled) {
        this.cancelled = cancelled;
    }
}
```

这是一个实际存在的事件类，用于处理玩家加入Stage时的逻辑。

## 监听器注册

### 核心监听器注册

在CodeFunCore的onEnable方法中注册了以下监听器：

```java
// 核心事件监听器注册
this.getServer().getPluginManager().registerEvents(new PlayerListener(this), this);
this.getServer().getPluginManager().registerEvents(new ServerListener(this), this);
this.getServer().getPluginManager().registerEvents(new EntityListener(this), this);
this.getServer().getPluginManager().registerEvents(new LevelListener(this), this);
this.getServer().getPluginManager().registerEvents(new StageListener(this), this);
this.getServer().getPluginManager().registerEvents(new ECVIPListener(this), this);
this.getServer().getPluginManager().registerEvents(new CustomStageGuidanceListener(this), this);
this.getServer().getPluginManager().registerEvents(new ParkourListener(CodeFunCoreTool.getInstance().getParkourManager()), this);
this.getServer().getPluginManager().registerEvents(new PlayerLiveModeListener(), this);
```

### 业务模块监听器

除了核心监听器，CodeFunCore还根据功能模块注册了额外的监听器：

```java
// 通行证监听器
this.getServer().getPluginManager().registerEvents(new GamePassTicketListener(), this);
this.getServer().getPluginManager().registerEvents(new MissionTriggerListener(), this);

// 活动监听器  
this.getServer().getPluginManager().registerEvents(new TreeActivityEventListener(), this);
this.getServer().getPluginManager().registerEvents(new CheckInTicketListener(), this);
this.getServer().getPluginManager().registerEvents(new ECVIPTicketListener(), this);
```

## BasePluginListener基类

所有核心监听器都继承自BasePluginListener：

```java
public abstract class BasePluginListener implements Listener {
    
    protected final CodeFunCore plugin;
    
    public BasePluginListener(CodeFunCore plugin) {
        this.plugin = plugin;
    }
    
    protected CodeFunCore getPlugin() {
        return plugin;
    }
}
```

这个基类提供了对CodeFunCore插件实例的访问。

## 事件系统特点

### 1. 模块化设计
不同类型的事件由专门的监听器处理，实现了功能的模块化分离。

### 2. 版本兼容性
通过PlayerListener处理不同Minecraft协议版本的玩家类选择，确保兼容性。

### 3. 分支监听
Stage系统通过分支监听器模式，让每个游戏房间拥有自己的事件处理逻辑。

### 4. 业务扩展
通过注册专门的业务监听器，支持VIP、活动、任务等业务功能。

## 总结

CodeFunCore的事件系统采用了分层和模块化的设计，通过多个专门的监听器处理不同类型的事件。系统的核心特点是确保玩家类的正确选择、支持多协议版本，以及为Stage系统提供事件分支处理能力。

该系统为EaseCation服务器的各种游戏功能提供了坚实的事件处理基础，通过明确的职责分离和模块化设计，确保了代码的可维护性和扩展性。