# 命令系统详解

## 概述

CodeFunCore的命令系统是基于Nukkit框架构建的综合性命令管理系统，提供了丰富的玩家交互功能和服务器管理工具。该系统通过统一的CommandBase基类、权限管理、多语言支持和参数验证等机制，为EaseCation服务器提供了完整的命令解决方案。

## 系统架构

### 命令架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                    Nukkit Command Framework                      │
├─────────────────────────────────────────────────────────────────┤
│                      CommandBase基类                            │
├─────────────────────────────────────────────────────────────────┤
│  玩家命令    │   管理命令    │   系统命令    │   Stage命令      │
├─────────────────────────────────────────────────────────────────┤
│           权限验证 │ 参数解析 │ 多语言支持                      │
├─────────────────────────────────────────────────────────────────┤
│                      业务逻辑处理层                             │
└─────────────────────────────────────────────────────────────────┘
```

### 命令执行流程

1. **命令输入**: 玩家输入命令
2. **权限检查**: 验证玩家是否有执行权限
3. **参数解析**: 解析命令参数并验证
4. **业务处理**: 执行具体的业务逻辑
5. **结果反馈**: 向玩家返回执行结果

## 核心基类架构

### CommandBase基类

**基础结构**
```java
public abstract class CommandBase extends Command implements PluginIdentifiableCommand {
    
    // 构造函数重载
    public CommandBase(String name) {
        this(name, "", null, new ArrayList<>());
    }
    
    public CommandBase(String name, String description) {
        this(name, description, null, new ArrayList<>());
    }
    
    public CommandBase(String name, String description, String usageMessage, List<String> aliases) {
        super(name, description, usageMessage, aliases.toArray(new String[aliases.size()]));
    }
    
    // 获取插件实例
    public CodeFunCore getPlugin() {
        return CodeFunCore.getInstance();
    }
    
    // 基础执行方法 - 包含权限检查
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (sender instanceof Player && !sender.hasPermission(this.getPermission())) {
            ((ECPlayer) sender).sendMessage(new TranslateMessage("main.command.banned"));
            return false;
        }
        return true;
    }
}
```

**权限管理集成**
```java
// 权限设置示例
public class ExampleCommand extends CommandBase {
    public ExampleCommand() {
        super("example", "示例命令");
        this.setPermission("fc.command.example");
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        // 调用父类权限检查
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        // 执行具体逻辑
        return executeCommand((ECPlayer) sender, args);
    }
    
    protected abstract boolean executeCommand(ECPlayer player, String[] args);
}
```

## 命令分类体系

### 1. 玩家基础命令

#### BackLobbyCommand - 返回大厅命令

```java
public class BackLobbyCommand extends CommandBase {
    private static final String[] aliases = {"hub"};
    
    public BackLobbyCommand() {
        super("lobby", "Back the lobby any time!", "/lobby", aliases);
        this.commandParameters.clear();
        this.commandParameters.put("default", new CommandParameter[] {
                CommandParameter.newType("lobby", CommandParamType.STRING)
        });
        this.setPermission("ec.base.back-lobby");
    }
    
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (sender instanceof ECPlayer) {
            ECPlayer player = (ECPlayer) sender;
            
            // 检查是否需要确认弹窗
            boolean needForm = false;
            if (player.inStage() && player.getNowStage().isGameRunning() || 
                CodeFunCoreTool.getInstance().getPartiesManager().getPartyByPlayer(player.getName()) != null) {
                needForm = true;
            }
            
            if (needForm) {
                // 显示确认表单
                showConfirmationForm(player);
            } else {
                // 直接传送回大厅
                transferToLobby(player);
            }
            return true;
        }
        return false;
    }
}
```

#### PartyCommand - 组队命令

```java
public class PartyCommand extends CommandBase {
    private static final String[] aliases = {"team", "pt"};
    
    public PartyCommand() {
        super("party", "Party with your friends!", "/party", aliases);
        setupCommandParameters();
    }
    
    private void setupCommandParameters() {
        this.commandParameters.clear();
        
        // /party invite <player>
        this.commandParameters.put("invite", new CommandParameter[] {
                CommandParameter.newEnum("invite", false, new CommandEnum("ActionInvite", "invite")),
                CommandParameter.newType("player", false, CommandParamType.TARGET)
        });
        
        // /party kick <player>
        this.commandParameters.put("kick", new CommandParameter[] {
                CommandParameter.newEnum("kick", false, new CommandEnum("ActionKick", "kick")),
                CommandParameter.newType("player", false, CommandParamType.TARGET)
        });
        
        // /party accept
        this.commandParameters.put("accept", new CommandParameter[] {
                CommandParameter.newEnum("accept", false, new CommandEnum("ActionAccept", "accept"))
        });
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        if (args.length == 0) {
            // 显示组队主界面
            showPartyMainForm(player);
            return true;
        }
        
        String action = args[0].toLowerCase();
        switch (action) {
            case "invite":
                return handleInviteCommand(player, args);
            case "kick":
                return handleKickCommand(player, args);
            case "accept":
                return handleAcceptCommand(player, args);
            case "leave":
                return handleLeaveCommand(player);
            default:
                player.sendMessage(new TranslateMessage("party.command.unknown-action"));
                return false;
        }
    }
}
```

### 2. 社交系统命令

#### FriendCommand - 好友系统命令

```java
public class FriendCommand extends CommandBase {
    
    public FriendCommand() {
        super("friend", "好友系统命令", "/friend <add|remove|list|accept>");
        setupPermission();
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        if (args.length == 0) {
            showFriendMainGUI(player);
            return true;
        }
        
        String subCommand = args[0].toLowerCase();
        switch (subCommand) {
            case "add":
                return handleAddFriend(player, args);
            case "remove":
                return handleRemoveFriend(player, args);
            case "list":
                return handleListFriends(player);
            case "accept":
                return handleAcceptRequest(player, args);
            default:
                player.sendMessage("§c未知的子命令: " + subCommand);
                return false;
        }
    }
    
    private boolean handleAddFriend(ECPlayer player, String[] args) {
        if (args.length < 2) {
            player.sendMessage("§c用法: /friend add <玩家名>");
            return false;
        }
        
        String targetName = args[1];
        
        // 异步处理好友添加
        CodeFunCoreTool.getInstance().getFriendManager()
            .sendFriendRequest(player, targetName)
            .onComplete(result -> {
                if (result.isSuccess()) {
                    player.sendMessage("§a好友请求已发送给 " + targetName);
                } else {
                    player.sendMessage("§c" + result.getMessage());
                }
            })
            .onError(error -> {
                player.sendMessage("§c添加好友失败，请稍后重试");
            });
            
        return true;
    }
}
```

#### GuildCommand - 公会系统命令

```java
public class GuildCommand extends CommandBase {
    
    public GuildCommand() {
        super("guild", "公会系统命令", "/guild <create|join|leave|info>");
        setupCommandParameters();
    }
    
    @Override  
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        if (args.length == 0) {
            showGuildMainGUI(player);
            return true;
        }
        
        return handleGuildSubCommand(player, args);
    }
    
    private boolean handleGuildSubCommand(ECPlayer player, String[] args) {
        String subCommand = args[0].toLowerCase();
        
        switch (subCommand) {
            case "create":
                return handleCreateGuild(player, args);
            case "join":
                return handleJoinGuild(player, args);
            case "leave":
                return handleLeaveGuild(player);
            case "invite":
                return handleInviteToGuild(player, args);
            case "info":
                return handleGuildInfo(player, args);
            default:
                player.sendMessage(new TranslateMessage("guild.command.unknown"));
                return false;
        }
    }
}
```

### 3. 管理员命令

#### ECAdminCommand - 管理员工具命令

```java
public class ECAdminCommand extends CommandBase {
    
    public ECAdminCommand() {
        super("ecadmin", "EaseCation管理员命令");
        this.setPermission("fc.admin");
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        if (args.length == 0) {
            showAdminMainGUI(player);
            return true;
        }
        
        String subCommand = args[0].toLowerCase();
        return handleAdminSubCommand(player, subCommand, args);
    }
    
    private boolean handleAdminSubCommand(ECPlayer player, String subCommand, String[] args) {
        switch (subCommand) {
            case "tp":
                return handleTeleport(player, args);
            case "kick":
                return handleKickPlayer(player, args);
            case "ban":
                return handleBanPlayer(player, args);
            case "reload":
                return handleReload(player, args);
            case "stage":
                return handleStageManagement(player, args);
            default:
                player.sendMessage("§c未知的管理员命令: " + subCommand);
                return false;
        }
    }
}
```

### 4. 系统查询命令

#### QueryScoreCommand - 分数查询命令

```java
public class QueryScoreCommand extends CommandBase {
    
    public QueryScoreCommand() {
        super("score", "查询玩家分数", "/score [玩家名] [游戏类型]");
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        // 确定查询目标
        String targetName = args.length > 0 ? args[0] : player.getName();
        String gameType = args.length > 1 ? args[1] : "all";
        
        // 异步查询分数
        queryPlayerScore(player, targetName, gameType);
        
        return true;
    }
    
    private void queryPlayerScore(ECPlayer requester, String targetName, String gameType) {
        CodeFunCoreTool.getInstance().getMySQLDataProvider()
            .getPlayerScoreAsync(targetName, gameType)
            .onComplete(scoreData -> {
                if (scoreData != null) {
                    showScoreResult(requester, targetName, scoreData);
                } else {
                    requester.sendMessage("§c未找到玩家 " + targetName + " 的分数记录");
                }
            })
            .onError(error -> {
                requester.sendMessage("§c查询分数失败，请稍后重试");
            });
    }
}
```

## 命令参数系统

### 参数类型定义

```java
public class CommandParameterHelper {
    
    // 设置基础参数类型
    public static CommandParameter createPlayerParameter(String name, boolean optional) {
        return CommandParameter.newType(name, optional, CommandParamType.TARGET);
    }
    
    public static CommandParameter createIntegerParameter(String name, boolean optional) {
        return CommandParameter.newType(name, optional, CommandParamType.INT);
    }
    
    public static CommandParameter createStringParameter(String name, boolean optional) {
        return CommandParameter.newType(name, optional, CommandParamType.STRING);
    }
    
    // 设置枚举参数
    public static CommandParameter createEnumParameter(String name, boolean optional, String... values) {
        CommandEnum commandEnum = new CommandEnum(name + "Enum", values);
        return CommandParameter.newEnum(name, optional, commandEnum);
    }
}
```

### 复杂命令参数示例

```java
public class ComplexCommand extends CommandBase {
    
    public ComplexCommand() {
        super("complex", "复杂命令示例");
        setupComplexParameters();
    }
    
    private void setupComplexParameters() {
        this.commandParameters.clear();
        
        // /complex player <player> give <item> [count]
        this.commandParameters.put("player_give", new CommandParameter[] {
                CommandParameter.newEnum("player", false, 
                    new CommandEnum("PlayerAction", "player")),
                CommandParameter.newType("target", false, CommandParamType.TARGET),
                CommandParameter.newEnum("give", false, 
                    new CommandEnum("GiveAction", "give")),
                CommandParameter.newType("item", false, CommandParamType.STRING),
                CommandParameter.newType("count", true, CommandParamType.INT)
        });
        
        // /complex stage <action> [stageId]
        this.commandParameters.put("stage_action", new CommandParameter[] {
                CommandParameter.newEnum("stage", false,
                    new CommandEnum("StageAction", "stage")),
                CommandParameter.newEnum("action", false,
                    new CommandEnum("StageActions", "list", "info", "stop", "restart")),
                CommandParameter.newType("stageId", true, CommandParamType.STRING)
        });
    }
}
```

## 权限管理系统

### 权限层次结构

```java
public class CommandPermissionManager {
    
    // 权限层次定义
    public static final String PERMISSION_ROOT = "fc";
    public static final String PERMISSION_PLAYER = "fc.player";
    public static final String PERMISSION_ADMIN = "fc.admin";
    public static final String PERMISSION_COMMAND = "fc.command";
    
    // 具体命令权限
    public static final String PERM_LOBBY = "fc.command.lobby";
    public static final String PERM_PARTY = "fc.command.party";
    public static final String PERM_FRIEND = "fc.command.friend";
    public static final String PERM_STAGE = "fc.command.stage";
    
    // 权限检查辅助方法
    public static boolean hasCommandPermission(ECPlayer player, String command) {
        String permission = "fc.command." + command;
        return player.hasPermission(permission) || player.hasPermission(PERMISSION_ADMIN);
    }
    
    public static boolean hasAdminPermission(ECPlayer player) {
        return player.hasPermission(PERMISSION_ADMIN) || player.isOp();
    }
}
```

### 权限动态检查

```java
public abstract class PermissionAwareCommand extends CommandBase {
    
    public PermissionAwareCommand(String name, String permission) {
        super(name);
        this.setPermission(permission);
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        // 检查子命令权限
        if (args.length > 0 && !hasSubCommandPermission(player, args[0])) {
            player.sendMessage(new TranslateMessage("command.permission.sub-command.denied"));
            return false;
        }
        
        return executeWithPermission(player, args);
    }
    
    protected boolean hasSubCommandPermission(ECPlayer player, String subCommand) {
        String subPermission = this.getPermission() + "." + subCommand;
        return player.hasPermission(subPermission);
    }
    
    protected abstract boolean executeWithPermission(ECPlayer player, String[] args);
}
```

## 多语言支持

### TranslateMessage集成

```java
public class MultiLanguageCommand extends CommandBase {
    
    public MultiLanguageCommand() {
        super("example", "Example multi-language command");
    }
    
    @Override
    public boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        // 使用多语言消息
        player.sendMessage(new TranslateMessage("command.example.welcome", player.getName()));
        
        if (args.length == 0) {
            sendUsageMessage(player);
            return true;
        }
        
        return processCommand(player, args);
    }
    
    private void sendUsageMessage(ECPlayer player) {
        player.sendMessage(new TranslateMessage("command.example.usage"));
        player.sendMessage(new TranslateMessage("command.example.help.line1"));
        player.sendMessage(new TranslateMessage("command.example.help.line2"));
    }
    
    private void sendSuccessMessage(ECPlayer player, String action) {
        player.sendMessage(new TranslateMessage("command.example.success", action));
    }
    
    private void sendErrorMessage(ECPlayer player, String error) {
        player.sendMessage(new TranslateMessage("command.example.error", error));
    }
}
```

## 异步命令处理

### 异步执行框架

```java
public abstract class AsyncCommand extends CommandBase {
    
    public AsyncCommand(String name, String description) {
        super(name, description);
    }
    
    @Override
    public final boolean execute(CommandSender sender, String commandLabel, String[] args) {
        if (!super.execute(sender, commandLabel, args)) {
            return false;
        }
        
        ECPlayer player = (ECPlayer) sender;
        
        // 异步执行命令逻辑
        executeAsync(player, args)
            .onComplete(result -> {
                handleCommandResult(player, result);
            })
            .onError(error -> {
                handleCommandError(player, error);
            });
        
        return true;
    }
    
    protected abstract AsyncPromise<CommandResult> executeAsync(ECPlayer player, String[] args);
    
    protected void handleCommandResult(ECPlayer player, CommandResult result) {
        if (result.isSuccess()) {
            player.sendMessage("§a" + result.getMessage());
        } else {
            player.sendMessage("§c" + result.getMessage());
        }
    }
    
    protected void handleCommandError(ECPlayer player, Throwable error) {
        player.sendMessage("§c命令执行失败，请稍后重试");
        CodeFunCore.getInstance().getLogger().error("异步命令执行失败", error);
    }
    
    public static class CommandResult {
        private final boolean success;
        private final String message;
        private final Object data;
        
        public CommandResult(boolean success, String message) {
            this(success, message, null);
        }
        
        public CommandResult(boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }
        
        // Getters...
    }
}
```

### 异步查询命令示例

```java
public class AsyncQueryCommand extends AsyncCommand {
    
    public AsyncQueryCommand() {
        super("asyncquery", "异步查询示例");
    }
    
    @Override
    protected AsyncPromise<CommandResult> executeAsync(ECPlayer player, String[] args) {
        if (args.length == 0) {
            return AsyncPromise.completed(
                new CommandResult(false, "请指定查询参数"));
        }
        
        String queryType = args[0];
        
        return CodeFunCoreTool.getInstance().getMySQLDataProvider()
            .queryDataAsync(queryType, player.getName())
            .thenApply(data -> {
                if (data != null) {
                    return new CommandResult(true, "查询成功", data);
                } else {
                    return new CommandResult(false, "未找到相关数据");
                }
            });
    }
}
```

## 命令注册和管理

### 统一命令注册

```java
public class CommandRegistry {
    
    public void registerAllCommands() {
        Server server = CodeFunCore.getInstance().getServer();
        List<CommandBase> commands = createAllCommands();
        
        // 批量注册命令
        server.getCommandMap().registerAll("EaseCation", commands);
        
        CodeFunCore.getInstance().getLogger().info("注册了 " + commands.size() + " 个命令");
    }
    
    private List<CommandBase> createAllCommands() {
        List<CommandBase> commands = new ArrayList<>();
        
        // 基础命令
        commands.add(new BackLobbyCommand());
        commands.add(new ECHelpCommand());
        commands.add(new PingCommand());
        
        // 社交命令
        commands.add(new PartyCommand());
        commands.add(new FriendCommand());
        commands.add(new GuildCommand());
        
        // 游戏相关命令
        commands.add(new QueryScoreCommand());
        commands.add(new QueryScoreTopCommand());
        
        // 管理命令
        commands.add(new ECAdminCommand());
        commands.add(new RestartCommand());
        
        // 系统命令
        commands.add(new TransferCommand());
        commands.add(new HomeCommand());
        
        return commands;
    }
}
```

### 动态命令管理

```java
public class DynamicCommandManager {
    private final Map<String, CommandBase> dynamicCommands = new ConcurrentHashMap<>();
    
    public void registerDynamicCommand(CommandBase command) {
        String name = command.getName().toLowerCase();
        
        // 移除旧命令（如果存在）
        unregisterDynamicCommand(name);
        
        // 注册新命令
        CodeFunCore.getInstance().getServer().getCommandMap().register("EaseCation", command);
        dynamicCommands.put(name, command);
    }
    
    public void unregisterDynamicCommand(String name) {
        CommandBase command = dynamicCommands.remove(name.toLowerCase());
        if (command != null) {
            CodeFunCore.getInstance().getServer().getCommandMap().unregister(command);
        }
    }
    
    public void unregisterAllDynamicCommands() {
        dynamicCommands.values().forEach(command -> 
            CodeFunCore.getInstance().getServer().getCommandMap().unregister(command));
        dynamicCommands.clear();
    }
}
```

## 命令监控和统计

### 命令使用统计

```java
public class CommandStatistics {
    private final Map<String, CommandUsageStats> usageStats = new ConcurrentHashMap<>();
    
    public void recordCommandUsage(String commandName, ECPlayer player, boolean success, long executionTime) {
        CommandUsageStats stats = usageStats.computeIfAbsent(commandName, k -> new CommandUsageStats());
        stats.recordUsage(player.getName(), success, executionTime);
    }
    
    public void generateReport() {
        StringBuilder report = new StringBuilder("命令使用统计报告:\n");
        
        usageStats.entrySet().stream()
                  .sorted((e1, e2) -> Integer.compare(e2.getValue().getTotalUsage(), e1.getValue().getTotalUsage()))
                  .forEach(entry -> {
                      CommandUsageStats stats = entry.getValue();
                      report.append(String.format("%s: 使用%d次, 成功率%.2f%%, 平均耗时%dms\n",
                                                  entry.getKey(),
                                                  stats.getTotalUsage(),
                                                  stats.getSuccessRate() * 100,
                                                  stats.getAverageExecutionTime()));
                  });
        
        CodeFunCore.getInstance().getLogger().info(report.toString());
    }
    
    private static class CommandUsageStats {
        private int totalUsage = 0;
        private int successCount = 0;
        private long totalExecutionTime = 0;
        private final Set<String> uniqueUsers = new HashSet<>();
        
        public void recordUsage(String playerName, boolean success, long executionTime) {
            totalUsage++;
            totalExecutionTime += executionTime;
            uniqueUsers.add(playerName);
            
            if (success) {
                successCount++;
            }
        }
        
        public int getTotalUsage() { return totalUsage; }
        public double getSuccessRate() { return totalUsage > 0 ? (double) successCount / totalUsage : 0; }
        public long getAverageExecutionTime() { return totalUsage > 0 ? totalExecutionTime / totalUsage : 0; }
        public int getUniqueUserCount() { return uniqueUsers.size(); }
    }
}
```

## 总结

CodeFunCore的命令系统通过CommandBase基类提供了统一的命令框架，集成了权限管理、多语言支持、参数验证等核心功能。系统涵盖了玩家基础操作、社交功能、游戏查询、服务器管理等多个方面，为EaseCation服务器提供了完整的命令解决方案。

该系统的特点包括：

1. **统一架构**: 通过CommandBase基类提供一致的命令开发模式
2. **权限控制**: 细粒度的权限管理确保命令使用的安全性
3. **多语言支持**: 通过TranslateMessage实现国际化支持
4. **异步处理**: 支持异步命令执行避免服务器阻塞
5. **参数验证**: 完善的参数类型检查和验证机制
6. **监控统计**: 详细的使用统计和性能监控
7. **动态管理**: 支持命令的动态注册和注销

这些特性使得命令系统能够满足大型多人在线游戏的复杂交互需求，同时保持良好的性能和用户体验。