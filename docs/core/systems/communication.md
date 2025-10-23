# 分布式通信系统详解

## 概述

CodeFunCore的分布式通信系统是支撑EaseCation服务器集群运行的核心基础设施。该系统基于Java RMI（远程方法调用）技术，实现了多个服务器节点之间的高效通信和数据同步。

## 系统架构

### 整体架构图

```
┌─────────────────┐    RMI    ┌─────────────────┐
│   游戏服务器1    │◄─────────►│                 │
├─────────────────┤           │                 │
│ ECRMIAPIClient  │           │   API中央服务器  │
└─────────────────┘           │                 │
                              │  ECRMIAPIImpl   │
┌─────────────────┐    RMI    │                 │
│   游戏服务器2    │◄─────────►│    (ECRMIAPI)   │
├─────────────────┤           │                 │
│ ECRMIAPIClient  │           └─────────────────┘
└─────────────────┘                    │
                                       │
┌─────────────────┐    RMI             │ 数据访问
│   代理服务器     │◄───────────────────┤
├─────────────────┤                    │
│ ECRMIAPIClient  │                    ▼
└─────────────────┘           ┌─────────────────┐
                              │   数据存储层     │
┌─────────────────┐           │                 │
│   大厅服务器     │           │ MySQL + Redis   │
├─────────────────┤           │                 │
│ ECRMIAPIClient  │           └─────────────────┘
└─────────────────┘
```

## 核心组件

### 1. RMI客户端 (ECRMIAPIClient)

每个游戏服务器都包含一个RMI客户端，负责与中央API服务器通信：

```java
public class ECRMIAPIClient {
    private ECRMIAPI api;
    private final Logger logger;
    
    public ECRMIAPIClient(Logger logger) {
        this.logger = logger;
    }
    
    // 连接RMI服务器
    public boolean connectRMIServer(String address, int port) {
        try {
            logger.info("开始连接连接 RMI API 服务端...");
            String url = "rmi://" + address + ":" + port + "/ecapi";
            api = (ECRMIAPI) Naming.lookup(url);
            logger.warning("[RMI] 正在连接 RMI 服务器: " + address);
            logger.info("已成功连接 RMI API 服务端！");
            return true;
        } catch (Exception e) {
            // 错误处理
            return false;
        }
    }
}
```

#### 主要功能模块

**服务器管理**
```java
// 服务器启动通知
public void onFCServerStart(ECServer ECServer) {
    try {
        ECAPI.getInstance().getClientManager().thisECServer = 
            getAPI().onFCServerStart(ECServer);
    } catch (RemoteException e) {
        // 错误处理
    }
}

// 服务器关闭通知
public void onFCServerClose() {
    try {
        getAPI().onFCServerClose(ECAPI.getInstance().getClientManager().getThisFCServerId());
    } catch (RemoteException e) {
        // 错误处理
    }
}

// 心跳检测
public ECServer heartBeatServer(ECServer ECServer) {
    try {
        return getAPI().heartBeatServer(ECServer);
    } catch (RemoteException e) {
        return null;
    }
}
```

**玩家信息管理**
```java
// 添加玩家信息
public void addPlayerInfo(UUID uuid, String name, String ip, PlayerPlatform platform) {
    try {
        getAPI().addPlayerInfo(new ECPlayerInfo(uuid, name, ip, platform));
    } catch (RemoteException e) {
        // 错误处理
    }
}

// 更新玩家服务器位置
public void updatePlayerServer(UUID uuid, int id) {
    try {
        getAPI().updatePlayerServer(uuid, id);
    } catch (RemoteException e) {
        // 错误处理
    }
}

// 检查玩家加入
public CheckPlayerJoinResult checkPlayerJoin(ECPlayerInfo info) {
    try {
        return getAPI().checkPlayerJoin(info);
    } catch (RemoteException e) {
        return null;
    }
}
```

**游戏房间管理**
```java
// 注册房间类型管理器
public void registerStageTypeManager(String type) {
    try {
        getAPI().registerStageTypeManager(type);
    } catch (RemoteException e) {
        // 错误处理
    }
}

// 添加房间信息
public int addStageInfo(StageInfo info) {
    try {
        return getAPI().addStageInfo(info);
    } catch (RemoteException e) {
        return -1;
    }
}

// 更新房间信息
public void updateStageInfo(StageInfo info) {
    try {
        getAPI().updateStageInfo(info);
    } catch (RemoteException e) {
        // 错误处理
    }
}
```

### 2. RMI服务端接口 (ECRMIAPI)

定义了所有远程调用的接口规范：

```java
public interface ECRMIAPI extends Remote {
    
    // 基础通信
    String helloWorld(String name) throws RemoteException;
    
    // 服务器生命周期
    ECServer onFCServerStart(ECServer ECServer) throws RemoteException;
    boolean onFCServerClose(int id) throws RemoteException;
    ECServer heartBeatServer(ECServer ECServer) throws RemoteException;
    
    // 玩家统计
    int getPlayerCount(PlayerCountType type) throws RemoteException;
    int getMaxPlayerCount() throws RemoteException;
    
    // 大厅管理
    int addFCLobbyInfo(ECLobbyInfo info) throws RemoteException;
    void updateLobbyInfo(ECLobbyInfo info) throws RemoteException;
    
    // 房间管理
    void registerStageTypeManager(String type) throws RemoteException;
    int addStageInfo(StageInfo info) throws RemoteException;
    void updateStageInfo(StageInfo info) throws RemoteException;
    boolean removeStageInfo(StageInfo info) throws RemoteException;
    
    // 玩家管理
    ECPlayerInfo getFCPlayerInfo(UUID uuid) throws RemoteException;
    void addPlayerInfo(ECPlayerInfo info) throws RemoteException;
    void updatePlayerInfo(ECPlayerInfo info) throws RemoteException;
    void removePlayerInfo(UUID uuid) throws RemoteException;
    CheckPlayerJoinResult checkPlayerJoin(ECPlayerInfo info) throws RemoteException;
    
    // 匹配系统
    JoinLobbyResponse joinLobby(JoinLobbyRequest request) throws RemoteException;
    JoinStageResponse joinStage(JoinStageRequest request) throws RemoteException;
}
```

### 3. 心跳检测系统

确保服务器集群的健康状态：

```java
public class HeartBeatRMIServerThread extends Thread {
    
    @Override
    public void run() {
        while (running) {
            try {
                ECRMIAPIClient client = ECAPI.getInstance().getECRMIAPIClient();
                ECServer thisServer = ECAPI.getInstance().getClientManager().getThisECServer();
                
                if (client != null && client.isConnected() && thisServer != null) {
                    // 发送心跳
                    ECServer updatedServer = client.heartBeatServer(thisServer);
                    if (updatedServer != null) {
                        // 更新服务器信息
                        ECAPI.getInstance().getClientManager().updateThisECServer(updatedServer);
                    }
                }
                
                Thread.sleep(HEARTBEAT_INTERVAL);
                
            } catch (Exception e) {
                // 处理心跳异常
            }
        }
    }
}
```

## 数据模型

### 服务器信息 (ECServer)

```java
public class ECServer implements Serializable {
    private int id;                    // 服务器ID
    private String hash;               // 服务器哈希
    private String description;        // 服务器描述
    private ECServerType type;         // 服务器类型
    private String ip;                 // 服务器IP
    private int port;                  // 服务器端口
    private int playerCount;           // 当前玩家数量
    private int maxPlayerCount;        // 最大玩家数量
    private boolean isOnline;          // 是否在线
    
    public enum ECServerType {
        LOGIN,     // 登录服务器
        BASE,      // 基础服务器
        SLAVE      // 从属服务器
    }
}
```

### 玩家信息 (ECPlayerInfo)

```java
public class ECPlayerInfo implements Serializable {
    private UUID uuid;                 // 玩家UUID
    private String name;               // 玩家名称
    private String ip;                 // 玩家IP
    private PlayerPlatform platform;   // 玩家平台
    private int serverId;              // 所在服务器ID
    private int lobbyId;               // 所在大厅ID
    private int stageId;               // 所在房间ID
    private boolean isOnline;          // 是否在线
    private long lastActiveTime;       // 最后活跃时间
}
```

### 房间信息 (StageInfo)

```java
public class StageInfo implements Serializable {
    private int id;                    // 房间ID
    private String type;               // 房间类型
    private String gameMap;            // 游戏地图
    private String waitingMap;         // 等待地图
    private int serverId;              // 所在服务器ID
    private int playerCount;           // 当前玩家数量
    private int maxPlayerCount;        // 最大玩家数量
    private StageState state;          // 房间状态
    private String roomName;           // 房间名称
    private String roomOwner;          // 房主
}
```

## 通信协议

### 消息传递模式

**1. 同步调用**
- 用于需要立即响应的操作
- 如玩家加入检查、服务器状态查询等

**2. 异步通知**
- 用于状态更新通知
- 如玩家位置变更、房间状态更新等

### 错误处理机制

**连接异常处理**
- RMI客户端在连接失败时会记录相应的错误日志
- 支持MalformedURLException、RemoteException、NotBoundException等异常处理
- 心跳机制检测连接状态，超时自动移除服务器

## 心跳机制

系统通过HeartBeatRMIServerThread实现服务器健康监控：

```java
// 心跳线程定期发送服务器状态
public class HeartBeatRMIServerThread extends Thread {
    @Override
    public void run() {
        while (running) {
            try {
                ECRMIAPIClient client = ECAPI.getInstance().getECRMIAPIClient();
                ECServer thisServer = ECAPI.getInstance().getClientManager().getThisECServer();
                
                if (client != null && thisServer != null) {
                    ECServer updatedServer = client.heartBeatServer(thisServer);
                    if (updatedServer != null) {
                        ECAPI.getInstance().getClientManager().updateThisECServer(updatedServer);
                    }
                }
                
                Thread.sleep(HEARTBEAT_INTERVAL);
                
            } catch (Exception e) {
                // 处理心跳异常
            }
        }
    }
}
```

## 故障排除

### 常见问题及解决方案

**1. 连接超时**
- 检查网络连通性
- 确认RMI端口是否开放
- 增加连接超时时间

**2. 序列化错误**
- 确保所有传输的对象都实现Serializable
- 检查类版本兼容性
- 使用serialVersionUID

**3. 内存泄漏**
- 及时释放RMI对象引用
- 监控远程对象的生命周期
- 定期清理过期的远程引用

## 总结

CodeFunCore的分布式通信系统通过Java RMI技术实现了高效、可靠的服务器间通信。该系统支持服务器管理、玩家信息同步、房间状态管理等核心功能，为整个EaseCation服务器集群提供了坚实的通信基础。通过心跳检测、错误处理、缓存优化等机制，确保了系统的稳定性和高性能。