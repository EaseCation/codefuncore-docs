# 数据持久化系统详解

## 概述

CodeFunCore的数据持久化系统是一个多层次的数据存储解决方案，集成了MySQL、Redis等多种存储技术以及飞书机器人集成，为EaseCation服务器提供了高性能、高可用的数据管理能力。该系统支持关系型数据、缓存数据等多种数据类型的持久化需求。

## 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    CodeFunCore 应用层                            │
├─────────────────────────────────────────────────────────────────┤
│               CodeFunCoreTool（数据提供者协调器）                  │
├─────────────────────────────────────────────────────────────────┤
│  MySQLDataProvider  │  RedisDataProvider  │  LarkDataProvider   │
├─────────────────────┼─────────────────────┼─────────────────────┤
│   ConnectionPool    │    ECJedisPool      │   Lark Open API     │
├─────────────────────┼─────────────────────┼─────────────────────┤
│    MySQL数据库       │    Redis缓存        │    飞书机器人        │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

### 数据流向

1. **写入流程**: 应用 → DataProvider → 连接池 → 存储后端
2. **读取流程**: 应用 → DataProvider → 缓存检查 → 存储后端 → 缓存更新 → 返回数据
3. **异步处理**: 通过AsyncPromise实现非阻塞数据操作

## 核心组件

### 1. 数据提供者协调器

**CodeFunCoreTool** 作为中心协调器管理所有数据提供者：

```java
public class CodeFunCoreTool {
    private static CodeFunCoreTool instance;
    
    // 数据提供者实例
    private final MySQLDataProvider mySQLDataProvider;
    private final RedisDataProvider redisDataProvider;
    private final LarkDataProvider larkDataProvider;
    
    public static CodeFunCoreTool getInstance() {
        return instance;
    }
    
    // 获取各种数据提供者
    public MySQLDataProvider getMySQLDataProvider() {
        return mySQLDataProvider;
    }
    
    public RedisDataProvider getRedisDataProvider() {
        return redisDataProvider;
    }
    
    // 数据提供器通过CodeFunCore实例获取
    // 主要包括MySQL数据库提供器和Redis缓存提供器
}
```

### 2. MySQL数据提供者

**MySQLDataProvider** 负责关系型数据的持久化：

#### 基础架构

```java
public class MySQLDataProvider {
    private ConnectionPool pool;
    
    public MySQLDataProvider() {
        // 初始化连接池
        String url = buildConnectionUrl();
        this.pool = new ConnectionPool(url, "SET NAMES utf8mb4");
    }
    
    // 构建数据库连接URL
    private String buildConnectionUrl() {
        return "jdbc:mysql://" + host + ":" + port + "/" + database + 
               "?useUnicode=true&characterEncoding=utf8mb4" +
               "&useSSL=false&serverTimezone=Asia/Shanghai" +
               "&allowPublicKeyRetrieval=true";
    }
}
```

#### 连接池管理

```java
public class ConnectionPool {
    public static int MAX_CONNECTIONS = 3;
    
    private final String url;
    private final String defaultSQL;
    private final List<ECConnection> list = new CopyOnWriteArrayList<>();
    private int lastIndex = 0;
    
    // 性能统计
    private int requestPreSecond = 0;
    private long lastCheck = System.currentTimeMillis();
    private long lastRequestOpen = System.currentTimeMillis();
    
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
    
    public ConnectionPool(String url, String defaultSQL) {
        this.url = url;
        this.defaultSQL = defaultSQL;
        try {
            this.addConnection(); // 初始化第一个连接
        } catch (ProviderException e) {
            Server.getInstance().getLogger().logException(e);
        }
    }
}
```

#### 数据访问模式

**玩家数据管理**
```java
// 检查玩家数据
public ECPlayerDataCheckResult checkPlayerData(String playerName) throws ProviderException {
    Connection connection = null;
    PreparedStatement statement = null;
    ResultSet resultSet = null;
    
    try {
        connection = pool.getConnection();
        String sql = "SELECT * FROM ec2017.cfgPlayerData WHERE name = ?";
        statement = connection.prepareStatement(sql);
        statement.setString(1, playerName);
        resultSet = statement.executeQuery();
        
        if (resultSet.next()) {
            return parsePlayerData(resultSet);
        }
        return null;
        
    } catch (SQLException e) {
        throw new ProviderException("查询玩家数据失败", e);
    } finally {
        closeResources(resultSet, statement, connection);
    }
}

// MySQLDataProvider提供多个异步方法用于不同的数据操作
// 例如权限管理相关的异步方法：
// - getPlayerPermissionAsync(String ecid, String permission)
// - updatePlayerPermissionAsync(ECPermission.Frozen permission)
// - deletePlayerPermissionAsync(String ecid, String permission)
```

**房间数据管理**
```java
// Stage日志数据读取 - 实际存在的方法
public List<StageDBLogData> getStageDBLogDataByGame(String game, StageState state) throws ProviderException {
    Connection connection = null;
    PreparedStatement statement = null;
    ResultSet resultSet = null;
    
    try {
        connection = pool.getConnection();
        String sql = "SELECT * FROM ec2017.stageDBLog WHERE game = ? AND state = ?";
        statement = connection.prepareStatement(sql);
        statement.setString(1, game);
        statement.setString(2, state.name());
        resultSet = statement.executeQuery();
        
        List<StageDBLogData> data = new ArrayList<>();
        while (resultSet.next()) {
            data.add(new StageDBLogData(resultSet));
        }
        return data;
        
    } catch (SQLException e) {
        throw new ProviderException("查询Stage日志数据失败", e);
    } finally {
        closeResources(resultSet, statement, connection);
    }
}
```

### 3. Redis数据提供者

**RedisDataProvider** 负责高速缓存和实时数据：

#### 基础架构

```java
public class RedisDataProvider {
    private final ECJedisPool pool;
    
    public RedisDataProvider() {
        this.pool = new ECJedisPool();
    }
}
```

#### Redis数据库分区

```java
public enum ECRedisDatabase {
    DB_SCORE_RANKING,     // 排行榜数据
    DB_ACTIVITY,          // 活动数据
    DB_RESOURCE_PACK      // 资源包数据
}
```

#### 排行榜系统

```java
/**
 * 记录玩家排行榜得分
 */
public void scoreTopRecord(String nick, String game, String scoreType, 
                          ScoreDeadlineType deadlineType, int score, 
                          boolean isAscending) throws ProviderException {
    Jedis jedis = null;
    try {
        jedis = pool.getReadJedisObject();
        jedis.select(ECRedisDatabase.DB_SCORE_RANKING.ordinal());
        
        // 构建Redis键
        String key = buildScoreKey(game, scoreType, deadlineType);
        
        if (isAscending) {
            // 分数越低越好的情况
            Double currentScore = jedis.zscore(key, nick);
            if (currentScore == null || score < currentScore.intValue()) {
                jedis.zadd(key, score, nick);
            }
        } else {
            // 分数越高越好的情况  
            jedis.zadd(key, score, nick);
        }
        
        // 设置过期时间
        setScoreExpiration(jedis, key, deadlineType);
        
    } finally {
        if (jedis != null) jedis.close();
    }
}

// 异步获取排行榜数据 - 实际存在的方法
public AsyncPromise<List<ScoreData>> scoreGetTopAsync(String game, String scoreType, 
                                                     ScoreDeadlineType deadlineType, 
                                                     int limit, boolean isAscending) {
    // 该方法返回AsyncPromise包装的排行榜数据列表
    // 实际实现在RedisDataProvider中
    return AsyncTransientScheduler.ofVirtual("获取排行榜数据", handler -> {
        // 异步执行排行榜查询逻辑
        // 根据isAscending参数决定升序或降序排列
    }).schedule();
}
```

#### 其他Redis功能

RedisDataProvider还提供其他数据管理功能：

```java
// 异步删除排行榜限制条目
public AsyncPromise<Unit> scoreDeleteLimitAsync(String game, String scoreType, 
                                               ScoreDeadlineType deadlineType, int limit)

// 异步删除所有排行榜数据  
public AsyncPromise<Unit> scoreDeleteAllAsync(String game, String scoreType, 
                                             ScoreDeadlineType deadlineType)

// 异步获取玩家排名
public AsyncPromise<Long> scoreGetPlayerRankAsync(String nick, String game, 
                                                 String scoreType, ScoreDeadlineType deadlineType)
```

### 4. 连接池优化

#### 连接管理

```java
public class ECConnection {
    private final Connection connection;
    private final ConnectionPool pool;
    private long lastUse = System.currentTimeMillis();

    public ECConnection(Connection connection, ConnectionPool pool) {
        this.connection = connection;
        this.pool = pool;
    }

    public Connection getConnection() {
        return connection;
    }

    public ConnectionPool getPool() {
        return pool;
    }

    public long getLastUse() {
        return lastUse;
    }

    public void checkLastUse() {
        this.lastUse = System.currentTimeMillis();
    }

    public long getSpareTime() {
        return System.currentTimeMillis() - lastUse;
    }
}
```

#### 连接分配策略

```java
public ECConnection getECConnection() {
    if (this.getPoolSize() <= 0) {  //池中无连接
        try {
            this.addConnection();
        } catch (ProviderException e) {
            throw new RuntimeException("Failed to connect to mysql data server!", e);
        }
    }
    if (++this.lastIndex >= this.list.size()) this.lastIndex = 0;
    ECConnection connection = this.list.get(this.lastIndex);
    this.requestPreSecond++;
    connection.checkLastUse();
    return connection;
}

public Connection getConnection() {
    return this.getECConnection().getConnection();
}
```

## 异步编程模型

### AsyncPromise框架

CodeFunCore使用来自ECCommons库的AsyncPromise框架处理异步数据操作：

```java
// AsyncPromise来自net.easecation.eccommons.promise包
import net.easecation.eccommons.promise.AsyncPromise;

// 异步操作示例 - 来自MySQLDataProvider的实际使用
public AsyncPromise<ECPermission.Frozen> getPlayerPermissionAsync(String ecid, String permission) {
    return AsyncTransientScheduler.<ECPermission.Frozen>ofVirtual("获取玩家权限", handler -> {
        try {
            ECPermission.Frozen result = getPlayerPermission(ecid, permission);
            handler.handle(result);
        } catch (ProviderException e) {
            throw new RuntimeException(e);
        }
    }).schedule();
}
```

### 异步任务调度

CodeFunCore使用`AsyncTransientScheduler`来创建异步任务，该调度器来自ECCommons库：

```java
// AsyncTransientScheduler来自ECCommons库
// 用于创建虚拟线程上的异步任务
return AsyncTransientScheduler.<ResultType>ofVirtual("任务描述", handler -> {
    try {
        // 执行具体的数据操作
        ResultType result = performOperation();
        handler.handle(result);
    } catch (ProviderException e) {
        throw new RuntimeException(e);
    }
}).schedule();
```

### 实际使用场景

CodeFunCore中大量使用异步操作，主要应用于：

- **权限管理**: `getPlayerPermissionAsync()`, `updatePlayerPermissionAsync()`
- **钱包操作**: `getWalletBalanceAsync()`, `deltaWalletBalanceAsync()`
- **排行榜**: `scoreGetTopAsync()`, `scoreTopRecordAsync()`
- **Stage记录**: `stageRecordCreate()`, `stageRecordGetById()`

## 数据模型设计

### 分层数据模型

**1. 实体层 (Entity Layer)**
- 对应数据库表结构的Java对象
- 包含基础的CRUD操作

**2. 数据传输层 (DTO Layer)**  
- 用于系统间数据传输的对象
- 优化了序列化性能

**3. 缓存层 (Cache Layer)**
- Redis中存储的数据结构
- 针对读取性能优化

### 核心数据结构

#### 玩家数据结构

```java
public class ECPlayerDataCheckResult implements Serializable {
    private final String nickName;          // 玩家昵称
    private String hash;                    // 密码哈希
    private final int vip;                  // VIP等级
    private final Date vipExpire;           // VIP过期时间
    private final int coins;                // 金币数量
    private final int diamond;              // 钻石数量
    private final int exp;                  // 经验值
    private String email;                   // 邮箱
    private final BanInfo banInfo;          // 封禁信息
    private final long lastCheck;           // 最后检查时间
    private final String lastIp;            // 最后登录IP
    private final String lastUUID;          // 最后使用的UUID
    private final String lastDevice;        // 最后使用的设备
    private int signInInterval;             // 签到间隔
}
```

#### 房间数据结构

```java
public class StageDBLogData {
    private final int id;                   // 数据库ID
    private final int runtimeId;            // 运行时ID
    private final Timestamp createTime;     // 创建时间
    private final Timestamp updateTime;     // 更新时间
    private final String game;              // 游戏类型
    private final String map;               // 游戏地图
    private final StageState state;         // Stage状态
    private final String[] gamingTag;       // 游戏标签
    private final int playerNow;            // 当前玩家数
    private final int playerMax;            // 最大玩家数
    private final String finalScore;        // 最终得分
}
```

#### 排行榜数据结构

```java
public class ScoreData {
    private String nick;                    // 玩家昵称
    private String neteaseName;             // 网易昵称
    private String game;                    // 游戏类型
    private String scoreType;               // 分数类型
    private ScoreDeadlineType deadlineType; // 统计周期类型
    private int score;                      // 分数
    private int rank;                       // 排名
}
```

## 总结

CodeFunCore的数据持久化系统采用分层架构设计，通过以下核心组件实现数据管理：

### 核心组件
- **MySQLDataProvider**: 关系型数据的持久化，支持玩家数据、权限管理、钱包系统等
- **RedisDataProvider**: 高速缓存和排行榜数据管理
- **ConnectionPool**: 数据库连接池管理，支持自动扩缩容和连接监控

### 技术特点
- **异步操作**: 广泛使用AsyncPromise进行异步数据操作
- **连接池优化**: 智能连接管理和性能监控
- **多数据源**: MySQL与Redis协同工作，各自发挥优势

### 数据模型
系统定义了完整的数据结构，包括ECPlayerDataCheckResult、StageDBLogData、ScoreData等，确保数据的一致性和完整性。