# CodeFunCore 核心系统文档

## 概述

CodeFunCore是EaseCation服务器系统的核心模块，承担双重角色：作为Nukkit插件提供游戏服务器功能，同时作为独立的API服务器处理分布式通信。它是整个EaseCation生态系统的基础架构组件。

## 核心架构

### 主要类结构

#### 核心插件类
```java
public class CodeFunCore extends PluginBase {
    private static CodeFunCore instance;
    public static boolean autoRestart = true;
    
    private CodeFunCoreConfig coreConfig;
    private Config metaConfig;
    private FickPlayerSTSThread fickPlayerSTSThread;
    private PreCheckPlayerDataTask preCheckPlayerDataTask;
    private PreCacheSkinTask preCacheSkinTask;
    private StageRedirectConfig stageRedirectConfig;
    
    @Override
    public void onEnable() {
        instance = this;
        reloadAllConfig();
        registerEntities();
        loadAllCommands();
        startTasks();
        enableSynapseAPI();
        selfCheck();
    }
}
```

#### 配置管理类
```java
public record CodeFunCoreConfig(
    boolean stageTest,
    boolean china,
    boolean netease,
    List<String> neteasePlatforms,
    List<String> neteaseSids,
    boolean ignorePrism,
    boolean orderTest
) {}
```

#### 工具类
```java
public class CodeFunCoreTool {
    private static CodeFunCoreTool instance;
    
    private final MySQLDataProvider mySQLDataProvider;
    private final RedisDataProvider redisDataProvider;
    private final LarkDataProvider larkDataProvider;
    private ECRMIAPIClient ecrmiApiClient;
    private StagePool stagePool;
    
    public static CodeFunCoreTool getInstance() {
        return instance;
    }
}
```

## 核心系统组件

### 1. Stage系统
游戏房间管理的核心系统，详见 [Stage系统详解](Stage系统详解.md)

### 2. ECPlayer系统
扩展的玩家系统，详见 [ECPlayer系统详解](ECPlayer系统详解.md)

### 3. 语言系统
多语言支持的核心组件，详见 [多语言系统详解](多语言系统详解.md)

### 4. 数据持久化系统
数据库和缓存系统的集成，支持MySQL、Redis等多种存储方式以及飞书机器人集成

### 5. 分布式通信系统
RMI和WebSocket的分布式服务器间通信

## 应用系统架构

### 核心应用模块
CodeFunCore整合了70多个子系统应用模块，包括：

- **社交系统**: 好友、公会、组队、聊天等功能
- **游戏功能**: 游戏中心、匹配系统、商店、抽奖等
- **用户体验**: 图形界面、皮肤系统、音乐系统等
- **管理系统**: 管理员工具、权限系统、监控等
- **技术基础**: ModUI、资源包、网络通信等

## 事件系统

基于Nukkit事件系统，CodeFunCore注册了多个监听器处理游戏事件：

```java
// 核心事件监听器注册
this.getServer().getPluginManager().registerEvents(new PlayerListener(this), this);
this.getServer().getPluginManager().registerEvents(new ServerListener(this), this);
this.getServer().getPluginManager().registerEvents(new EntityListener(this), this);
this.getServer().getPluginManager().registerEvents(new LevelListener(this), this);
this.getServer().getPluginManager().registerEvents(new StageListener(this), this);
this.getServer().getPluginManager().registerEvents(new ECVIPListener(this), this);
```

## 配置系统

### 配置管理
CodeFunCore使用分层配置系统：

```java
// 重新加载所有配置
public void reloadAllConfig() {
    reloadConfig();              // 重载主配置
    reloadCoreConfig();          // 重载核心配置
    reloadMetaConfig();          // 重载元配置
}

// 核心配置结构
private void reloadCoreConfig() {
    this.coreConfig = new CodeFunCoreConfig(
        this.getConfig().getBoolean("stage-test", false),
        this.getConfig().getBoolean("china", false),
        this.getConfig().getBoolean("netease", false),
        this.getConfig().getStringList("netease-platforms"),
        this.getConfig().getStringList("netease-sids"),
        this.getConfig().getBoolean("ignore-prism", false),
        this.getConfig().getBoolean("order-test", false)
    );
}
```

## 命令系统

### 命令注册
CodeFunCore注册了丰富的命令系统：

```java
private void loadAllCommands() {
    List<CommandBase> list = new ArrayList<>();
    
    // 玩家命令
    list.add(new LogoutCommand());
    list.add(new ChangePasswordCommand());
    list.add(new BackLobbyCommand());
    list.add(new ECHelpCommand());
    list.add(new SetLanguageCommand());
    list.add(new PartyCommand());
    list.add(new FriendCommand());
    list.add(new GuildCommand());
    
    // 管理命令
    list.add(new StageCommand());
    list.add(new RestartCommand());
    list.add(new ECAdminCommand());
    list.add(new TransferCommand());
    
    // 注册所有命令
    this.getServer().getCommandMap().registerAll("EaseCation", list);
}
```

## 部署和构建

### 双模式支持
CodeFunCore支持两种运行模式：

1. **插件模式**: 作为Nukkit插件运行在游戏服务器中
2. **API模式**: 作为独立应用程序运行，处理API请求

### 构建命令
```bash
# 构建核心JAR包
./gradlew :CodeFunCore:shadowJar

# 构建并复制到部署目录
./gradlew copyShadowJar

# 复制到测试部署目录
./gradlew copyToDeployTest
```

### 部署目标
- **游戏服务器**: `{server}/plugins/CodeFunCore.jar`
- **API服务器**: `API/CodeFunCore.jar`
- **代理服务器**: `{proxy}/plugins/CodeFunCore.jar`

## 任务调度系统

### 定时任务管理
CodeFunCore启动了多个定时任务确保系统正常运行：

```java
private void startTasks() {
    ServerScheduler sch = this.getServer().getScheduler();
    
    // 预启动任务
    sch.scheduleTask(this, new PreRunRunnable());
    
    // 服务器标题计时器
    sch.scheduleRepeatingTask(this, new SetMotdRunnable(this), 20 * 5);
    
    // 房间状态更新
    sch.scheduleRepeatingTask(this, new FickStageRunnable(), 1);
    sch.scheduleRepeatingTask(this, new UpdateNPCRunnable(), 1);
    
    // 大厅系统
    sch.scheduleRepeatingTask(this, new TickLobbyRunnable(), 1);
    
    // 各种管理器更新
    sch.scheduleRepeatingTask(this, new ECWalletManagerUpdateRunnable(), 1);
    sch.scheduleRepeatingTask(this, new ECExponentialManagerUpdateRunnable(), 1);
    sch.scheduleRepeatingTask(this, new ECPermissionManagerUpdateRunnable(), 1);
    sch.scheduleRepeatingTask(this, new ECMerchandiseManagerUpdateRunnable(), 1);
    sch.scheduleRepeatingTask(this, new ECTaskManagerUpdateRunnable(), 1);
    sch.scheduleRepeatingTask(this, new OrdersManagerUpdateRunnable(), 1);
    sch.scheduleRepeatingTask(this, new ECVIPManagerUpdateRunnable(), 1);
}
```

## 系统自检

### 启动时自检
CodeFunCore在启动时会执行系统自检：

```java
private void selfCheck() {
    getLogger().info("自检开始");
    
    try {
        // 多语言系统测试
        TranslateMessage t = new TranslateMessage("stage.join.msg.0", "Game Name", "stage-id");
        getLogger().info("自检语言1：" + Dictionary.get(Locale.ENGLISH, t.msg, t.array, t.useDictionary));
        getLogger().info("自检语言2：" + Dictionary.get(Locale.CHINESE, "language.using",
            Dictionary.get(Locale.SIMPLIFIED_CHINESE, "language.display-name")));
        
        // 脏话过滤测试
        getLogger().info("自检脏话屏蔽：" + DirtyWordsPool.filter("fuck Fuck fUCK 艹你妈"));
        
    } catch (Exception e) {
        getLogger().critical("自检时出现致命错误：", e);
    }
    
    getLogger().info("自检结束");
}
```

## 权限系统

### 权限注册
```java
private void registerPermissions() {
    Permission parent = registerPermission(new Permission("fc", "EaseCation", "false"));
    Permission player = registerPermission(new Permission("fc.player", "EaseCation Player", "false"), parent);
    Permission admin = registerPermission(new Permission("fc.admin", "false"), parent);
    Permission lobby = registerPermission(new Permission("fc.lobby", "EaseCation Lobby", "false"), parent);
    Permission command = registerPermission(new Permission("fc.command", "EaseCation Command", "false"), parent);
    
    // 具体权限
    registerPermission(new Permission("fc.lobby.fly", "Can fly in the lobby", "false"), lobby);
    registerPermission(new Permission("fc.lobby.touch", "Can Interact in the lobby", "false"), lobby);
    registerPermission(new Permission("fc.command.stage", "EaseCation Stage Command", "op"), command);
}
```