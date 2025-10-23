# CodeFunCore ECPlayer系统详解

## 概述

ECPlayer系统是CodeFunCore对原生Nukkit Player类的全面扩展，为EaseCation服务器提供了丰富的玩家功能。它不仅包含了原生Player的所有功能，还添加了跨服传送、数据缓存、语言系统、VIP系统等高级特性。

## ECPlayer接口定义

### 核心接口
```java
public interface ECPlayer extends BasePlayerInterface, StageVoteSource, RidingOrnamentHolder {
    // 资源包常量
    String PACK_RES_MOD_RELEASE = "951337aa-5fac-4d73-aa99-511670010f93";
    String PACK_RES_MOD_TEST = "8b9fe59e-2210-4e7e-9136-d847caa76e8a";
    String PACK_BEH_MOD_RELEASE = "8b6fc2b4-f45f-41d2-872e-d5fa9e6f51b4";
    String PACK_BEH_MOD_TEST = "76edcef2-b980-44cb-a08d-ae07938a3623";
    String PACK_BEH_PRISM_SUN_MOD = "bcd898a2-0d2b-4038-9fa7-edc552c6ce31";
    
    String PACK_RES_MOD = PACK_RES_MOD_RELEASE;
    String PACK_BEH_MOD = PACK_BEH_MOD_RELEASE;
    
    int ENTITY_CAN_PLAYER_VIEW_CHECK_RANDOM_TICK_REMAINDER_RANGE = 20;
}
```

### ECPlayer实现类架构
```java
// 根据协议版本实现不同的ECPlayer类
public class ECPlayer19 extends SynapsePlayer19 implements ECPlayer, ScoreboardHolder {
    private Locale realLocale = null;
    private Locale locale = null;
    
    private ECPlayerDataCheckResult playerDataCache = null;
    private FriendInviteEntry friendInviteEntry = null;
    private List<FriendData> friends = new ArrayList<>();
    private String[] additionalResourcePacksCache = new String[0];
    
    private boolean chatEnabled = true;
    private long loginTime = System.currentTimeMillis();
    
    public PermissionAttachment permissionAttachment;
    
    private boolean sameChatMessage;
    private String lastChatMessage = "";
    private long lastChatTime = System.currentTimeMillis();
    private final List<TranslateMessage> sendAfterJoin = new ArrayList<>();
    
    public StageTeam stageTeam;
    public PlayerKit kit;
    
    // VIP和货币数据
    private int vip = 0;
    private Date vipExpire = null;
    private int coins = 0;
    private int diamonds = 0;
    private int exp = 0;
    private int expLevel = 0;
    private float expBi = 0;
    
    // 显示相关
    private String prefix = "";
    private String medal = "";
    private String rankPrefix = "";
    private String realname = this.getName();
}
```

## 跨服传送系统

### 传送方法
```java
public interface ECPlayer {
    /**
     * 通过服务器描述传送
     */
    boolean transferByDescription(String serverDescription);
    
    /**
     * 通过服务器哈希传送
     */
    boolean transfer(String hash);
    
    /**
     * 通过服务器哈希传送，携带额外数据
     */
    boolean transfer(String hash, JsonObject extra);
    
    /**
     * 获取从上一个服务器传过来的额外数据
     */
    JsonObject getCachedExtra();
    
    /**
     * 设置传往下一个服务器的数据
     */
    JsonObject getTransferExtra();
}
```

### 传送实现示例
```java
public class ECPlayer19 implements ECPlayer {
    private JsonObject cachedExtra;
    private JsonObject transferExtra;
    
    @Override
    public boolean transfer(String hash, JsonObject extra) {
        if (hash == null || hash.isEmpty()) {
            return false;
        }
        
        // 设置传送数据
        this.transferExtra = extra;
        
        try {
            // 通过RMI API进行传送
            ECRMIAPIClient rmiClient = CodeFunCoreTool.getInstance().getRmiClient();
            TargetStage targetStage = rmiClient.getServerManager().findServer(hash);
            
            if (targetStage != null) {
                // 保存玩家数据
                savePlayerData();
                
                // 执行传送
                getSynapseEntry().transfer(this, targetStage.getAddress(), targetStage.getPort());
                return true;
            }
        } catch (Exception e) {
            CodeFunCore.getInstance().getLogger().error("传送失败", e);
        }
        
        return false;
    }
    
    @Override
    public boolean transferByDescription(String serverDescription) {
        try {
            ECRMIAPIClient rmiClient = CodeFunCoreTool.getInstance().getRmiClient();
            TargetStage targetStage = rmiClient.getServerManager().findServerByDescription(serverDescription);
            
            if (targetStage != null) {
                return transfer(targetStage.getHash());
            }
        } catch (Exception e) {
            CodeFunCore.getInstance().getLogger().error("通过描述传送失败", e);
        }
        
        return false;
    }
}
```

## 数据缓存系统

### 玩家数据缓存
```java
public class ECPlayerDataCheckResult implements Serializable {
    private final String nickName;
    private String hash;
    private final int vip;
    private final Date vipExpire;
    private final int coins;
    private final int diamond;
    private final int exp;
    private String email;
    private final BanInfo banInfo;
    private final long lastCheck;
    private final String lastIp;
    private final String lastUUID;
    private final String lastDevice;
    private int signInInterval;
    
    public ECPlayerDataCheckResult(String nickName, String hash, int vip, Date vipExpire, 
                                 int coins, int diamond, int exp, String email, 
                                 BanInfo banInfo, long lastCheck, String lastIp, 
                                 String lastUUID, String lastDevice, int signInInterval) {
        this.nickName = nickName;
        this.hash = hash;
        this.vip = vip;
        this.vipExpire = vipExpire;
        this.coins = coins;
        this.diamond = diamond;
        this.exp = exp;
        this.email = email;
        this.banInfo = banInfo;
        this.lastCheck = lastCheck;
        this.lastIp = lastIp;
        this.lastUUID = lastUUID;
        this.lastDevice = lastDevice;
        this.signInInterval = signInInterval;
    }
    
    // Getter 方法...
}
```

### 数据缓存接口
```java
public interface ECPlayer {
    /**
     * 设置玩家数据缓存
     */
    void setPlayerDataCache(ECPlayerDataCheckResult playerDataCache);
    
    /**
     * 获取玩家数据缓存
     */
    ECPlayerDataCheckResult getPlayerDataCache();
    
    /**
     * 是否为VIP
     */
    default boolean isVIP() {
        ECPlayerDataCheckResult cache = getPlayerDataCache();
        return cache != null && cache.getVip() > 0 && 
               (cache.getVipExpire() == null || cache.getVipExpire().after(new Date()));
    }
    
    /**
     * 获取VIP等级
     */
    default int getVIPLevel() {
        ECPlayerDataCheckResult cache = getPlayerDataCache();
        return cache != null ? cache.getVip() : 0;
    }
    
    /**
     * 获取VIP过期时间
     */
    default Date getVIPExpire() {
        ECPlayerDataCheckResult cache = getPlayerDataCache();
        return cache != null ? cache.getVipExpire() : null;
    }
    
    /**
     * 获取金币数量
     */
    default int getCoins() {
        ECPlayerDataCheckResult cache = getPlayerDataCache();
        return cache != null ? cache.getCoins() : 0;
    }
    
    /**
     * 获取钻石数量
     */
    default int getDiamonds() {
        ECPlayerDataCheckResult cache = getPlayerDataCache();
        return cache != null ? cache.getDiamond() : 0;
    }
}
```

## 语言系统

### 语言设置
```java
public interface ECPlayer {
    /**
     * 获取玩家语言设置
     */
    Locale getLocale();
    
    /**
     * 设置玩家语言
     */
    void setLocale(Locale locale);
    
    /**
     * 获取真实语言设置
     */
    Locale getRealLocale();
    
    /**
     * 发送多语言消息
     */
    default void sendMessage(TranslateMessage message) {
        if (message != null) {
            sendMessage(message.trans(this));
        }
    }
    
    /**
     * 发送多语言动作栏
     */
    default void sendActionBar(TranslateMessage message) {
        if (message != null) {
            sendActionBar(message.trans(this));
        }
    }
    
    /**
     * 发送多语言标题
     */
    default void sendTitle(TranslateMessage title, TranslateMessage subtitle) {
        String titleText = title != null ? title.trans(this) : "";
        String subtitleText = subtitle != null ? subtitle.trans(this) : "";
        sendTitle(titleText, subtitleText);
    }
}
```

### 延迟消息系统
```java
public interface ECPlayer {
    /**
     * 获取登录后待发送的消息列表
     */
    List<TranslateMessage> getSendAfterJoin();
    
    /**
     * 添加登录后待发送的消息
     */
    void addSendAfterJoin(TranslateMessage sendAfterJoin);
}

public class ECPlayer19 implements ECPlayer {
    private final List<TranslateMessage> sendAfterJoin = new ArrayList<>();
    
    @Override
    public void addSendAfterJoin(TranslateMessage message) {
        if (message != null) {
            sendAfterJoin.add(message);
        }
    }
    
    /**
     * 处理登录后的消息发送
     */
    public void processSendAfterJoin() {
        for (TranslateMessage message : sendAfterJoin) {
            sendMessage(message);
        }
        sendAfterJoin.clear();
    }
}
```

## 客户端兼容性

### 网易客户端支持
```java
public interface ECPlayer {
    /**
     * 是否为网易客户端
     */
    boolean isNetEaseClient();
    
    /**
     * 获取玩家别名（网易版显示名）
     */
    default String getAliasName(boolean anonymity) {
        String name;
        if (anonymity && this.getAnonymity() != null) {
            name = this.getAnonymity();
        } else {
            name = this.getRealname();
        }
        return name;
    }
    
    /**
     * 获取玩家别名
     */
    default String getAliasName() {
        return getAliasName(true);
    }
    
    /**
     * 获取原始用户名
     */
    String getOriginName();
    
    /**
     * 获取真实姓名
     */
    default String getRealname() {
        return getName();
    }
    
    /**
     * 获取匿名名称
     */
    default String getAnonymity() {
        return null;
    }
}
```

### 协议兼容性
```java
public interface ECPlayer {
    /**
     * 获取抽象协议处理器
     */
    AbstractProtocol getAbstractProtocol();
    
    /**
     * 是否为Beta客户端
     */
    boolean isBetaClient();
    
    /**
     * 是否需要级别变化加载屏幕
     */
    boolean isNeedLevelChangeLoadScreen();
    
    /**
     * 获取下一个虚拟维度ID
     */
    int nextDummyDimension();
    
    /**
     * 获取虚拟维度ID
     */
    int getDummyDimension();
}
```

## 聊天和通信系统

### 聊天控制
```java
public interface ECPlayer {
    /**
     * 设置聊天是否启用
     */
    void setChatEnabled(boolean enabled);
    
    /**
     * 聊天是否启用
     */
    boolean isChatEnabled();
    
    /**
     * 获取登录时间
     */
    long getLoginTime();
    
    /**
     * 设置登录时间
     */
    void setLoginTime(long loginTime);
}

public class ECPlayer19 implements ECPlayer {
    private boolean chatEnabled = true;
    private long loginTime = System.currentTimeMillis();
    
    private boolean sameChatMessage;
    private String lastChatMessage = "";
    private long lastChatTime = System.currentTimeMillis();
    
    @Override
    public void setChatEnabled(boolean enabled) {
        this.chatEnabled = enabled;
    }
    
    @Override
    public boolean isChatEnabled() {
        return chatEnabled;
    }
    
    /**
     * 检查聊天消息是否重复
     */
    public boolean checkChatMessage(String message) {
        long now = System.currentTimeMillis();
        
        if (message.equals(lastChatMessage) && now - lastChatTime < 3000) {
            return false; // 3秒内重复消息
        }
        
        lastChatMessage = message;
        lastChatTime = now;
        return true;
    }
}
```

## 玩家显示控制

### 自动显示玩家系统
```java
public interface ECPlayer {
    /**
     * 获取自动显示玩家数量
     * 0：隐藏所有其他玩家
     * -1：不隐藏玩家，全部显示
     * >0：仅显示这个数量的玩家
     */
    int getAutoShowPlayerCount();
    
    /**
     * 启用隐藏所有玩家功能
     */
    void enableHideAllPlayers(int autoShowPlayerCount);
    
    /**
     * 检查特定玩家是否可见
     */
    void checkAutoShowPlayer(ECPlayer player);
}
```

## 网络和性能

### 网络延迟
```java
public interface ECPlayer {
    /**
     * 请求Ping，成功后会触发 SynapsePlayerNetworkStackLatencyUpdateEvent
     */
    void requestPing();
    
    /**
     * 执行ping
     */
    void ping();
    
    /**
     * 获取延迟（毫秒）
     */
    long getLatency();
    
    /**
     * 获取RakNet延迟
     */
    int getRakNetLatency();
}
```

### 权威性控制
```java
public interface ECPlayer {
    /**
     * 是否启用服务器权威方块破坏
     */
    boolean isServerAuthoritativeBlockBreakingEnabled();
    
    /**
     * 是否启用服务器权威声音
     */
    boolean isServerAuthoritativeSoundEnabled();
}
```

## 特效和交互

### 粒子效果
```java
public interface ECPlayer {
    /**
     * 生成粒子效果
     */
    void spawnParticleEffect(Vector3f position, String identifier);
    
    /**
     * 生成粒子效果（指定实体）
     */
    void spawnParticleEffect(Vector3f position, String identifier, long entityUniqueId);
    
    /**
     * 生成粒子效果（带Molang变量）
     */
    void spawnParticleEffect(Vector3f position, String identifier, long entityUniqueId, 
                           @Nullable String molangVariables);
}
```

### 摄像机控制
```java
public interface ECPlayer {
    /**
     * 添加摄像机震动
     * @since 1.16.100
     */
    void addCameraShake(float intensity, float duration, int type);
    
    /**
     * 停止摄像机震动
     * @since 1.16.100
     */
    void stopCameraShake();
    
    /**
     * 开始摄像机指令
     */
    void startCameraInstruction(CameraSetInstruction set, CameraFovInstruction fov, 
                              CameraTargetInstruction target, CameraFadeInstruction fade);
    
    /**
     * 清除摄像机指令
     * @since 1.20.30
     */
    void clearCameraInstruction();
}
```

### 瞄准辅助
```java
public interface ECPlayer {
    /**
     * 设置瞄准辅助
     */
    void setAimAssist(float viewAngleX, float viewAngleZ);
    
    /**
     * 设置瞄准辅助（带预设）
     */
    void setAimAssist(float viewAngleX, float viewAngleZ, String presetId);
    
    /**
     * 设置瞄准辅助（距离）
     */
    void setAimAssist(float distance);
    
    /**
     * 清除瞄准辅助
     */
    void clearAimAssist();
}
```

## 社交系统集成

### 好友系统
```java
public class ECPlayer19 implements ECPlayer {
    private List<FriendData> friends = new ArrayList<>();
    private FriendInviteEntry friendInviteEntry = null;
    
    /**
     * 获取好友列表
     */
    public List<FriendData> getFriends() {
        return friends;
    }
    
    /**
     * 设置好友列表
     */
    public void setFriends(List<FriendData> friends) {
        this.friends = friends != null ? friends : new ArrayList<>();
    }
    
    /**
     * 获取好友邀请条目
     */
    public FriendInviteEntry getFriendInviteEntry() {
        return friendInviteEntry;
    }
    
    /**
     * 设置好友邀请条目
     */
    public void setFriendInviteEntry(FriendInviteEntry friendInviteEntry) {
        this.friendInviteEntry = friendInviteEntry;
    }
}
```

### 团队系统
```java
public class ECPlayer19 implements ECPlayer {
    public StageTeam stageTeam;
    
    /**
     * 获取当前Stage团队
     */
    public StageTeam getStageTeam() {
        return stageTeam;
    }
    
    /**
     * 设置Stage团队
     */
    public void setStageTeam(StageTeam stageTeam) {
        this.stageTeam = stageTeam;
    }
}
```

## 经验和等级系统

### 经验管理
```java
public interface ECPlayer {
    /**
     * 设置经验值
     */
    void setExp(int exp);
    
    /**
     * 设置经验等级
     */
    void setExpLevel(int expLevel);
    
    /**
     * 设置显示的经验等级
     */
    void setShowedExpLevel(int showedExpLevel);
    
    /**
     * 获取显示的经验等级
     */
    int getShowedExpLevel();
    
    /**
     * 获取经验进度条比例
     */
    float getExpBi();
    
    /**
     * 设置经验进度条比例
     */
    void setExpBi(float expBi);
    
    /**
     * 设置显示的经验进度条比例
     */
    void setShowedExpBi(float showedExpBi);
    
    /**
     * 获取显示的经验进度条比例
     */
    float getShowedExpBi();
}
```

### 等级前缀
```java
public interface ECPlayer {
    /**
     * 设置等级前缀
     * 从数据库返回rank等级后，存在Player对象中
     */
    void setRankPrefix(String rankPrefix);
    
    /**
     * 获取等级前缀
     */
    String getRankPrefix();
}
```

## 开发指南

### 获取ECPlayer实例
```java
public class ExampleListener implements Listener {
    
    @EventHandler
    public void onPlayerJoin(PlayerLoginEvent event) {
        Player player = event.getPlayer();
        
        // 强制转换为ECPlayer
        if (player instanceof ECPlayer ecPlayer) {
            // 使用ECPlayer的功能
            ecPlayer.sendMessage(new TranslateMessage("welcome.message", ecPlayer.getName()));
            
            // 检查VIP状态
            if (ecPlayer.isVIP()) {
                ecPlayer.sendMessage(new TranslateMessage("vip.welcome"));
            }
        }
    }
}
```

### 跨服传送示例
```java
public class TeleportCommand extends Command {
    
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!(sender instanceof ECPlayer player)) {
            sender.sendMessage("只有玩家可以使用此命令");
            return false;
        }
        
        if (args.length < 1) {
            player.sendMessage("用法: /tp <服务器>");
            return false;
        }
        
        String serverName = args[0];
        JsonObject extra = new JsonObject();
        extra.addProperty("reason", "command");
        extra.addProperty("source", "lobby");
        
        if (player.transferByDescription(serverName)) {
            player.sendMessage("正在传送到 " + serverName + "...");
        } else {
            player.sendMessage("传送失败，服务器不存在或不可用");
        }
        
        return true;
    }
}
```

### 多语言消息发送示例
```java
public class MessageHelper {
    
    public void sendWelcomeMessage(ECPlayer player) {
        // 简单消息
        TranslateMessage welcome = new TranslateMessage("welcome.message");
        player.sendMessage(welcome);
        
        // 带参数的消息
        TranslateMessage withParams = new TranslateMessage("welcome.player", player.getName());
        player.sendMessage(withParams);
        
        // 复杂参数消息
        TranslateMessage complex = new TranslateMessage("player.info")
            .putParam("{player}", player.getName())
            .putParam("{level}", String.valueOf(player.getExpLevel()))
            .putParam("{coins}", String.valueOf(player.getCoins()));
        player.sendMessage(complex);
    }
    
    public void sendVIPMessage(ECPlayer player) {
        if (player.isVIP()) {
            TranslateMessage vipMsg = new TranslateMessage("vip.welcome", 
                String.valueOf(player.getVIPLevel()));
            player.sendMessage(vipMsg);
        } else {
            TranslateMessage normalMsg = new TranslateMessage("normal.welcome");
            player.sendMessage(normalMsg);
        }
    }
}
```

### 最佳实践

1. **类型检查**: 始终检查Player是否为ECPlayer实例
2. **空值检查**: 检查缓存数据是否为null
3. **异步操作**: 数据库操作和跨服传送使用异步处理
4. **资源清理**: 及时清理不再使用的数据和监听器
5. **错误处理**: 妥善处理网络错误和数据异常
6. **多语言支持**: 所有面向用户的文本都使用TranslateMessage