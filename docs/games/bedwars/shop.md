# 起床战争商店系统技术文档

## 系统概述

起床战争商店系统是ECBedWars游戏模块的核心经济系统，负责管理玩家的资源交易、装备购买、团队升级以及智能推荐等功能。该系统采用分层架构设计，支持多种货币类型、灵活的定价机制、智能推荐算法以及多样化的用户界面。

## 系统架构

### 核心架构组件

```
商店系统架构
├── 商店核心 (BedWarsShop)                    # 商店实例和配置管理
│   ├── 商店配置 (BedWarsShopConfig)          # 商店基础配置
│   └── 商店分类 (BedWarsShopCategory)        # 商品分类管理
├── 商品系统 (Goods System)                   # 商品定义和管理
│   ├── 商品池 (BedWarsShopGoodsPool)         # 全局商品配置池
│   ├── 商品配置 (ShopGoodPracticableConfig)   # 单个商品配置
│   └── 商品实例 (ShopGoods)                  # 运行时商品实例
├── 价格与货币 (Currency & Pricing)           # 经济系统
│   ├── 货币类型 (BedWarsShopCurrency)        # 货币枚举定义
│   ├── 商品价格 (BedWarsShopGoodsPrice)      # 价格计算和管理
│   └── 团队升级 (TeamUpgradeManager)         # 团队升级价格体系
├── 推荐系统 (Recommendation System)          # 智能推荐算法
│   ├── 推荐管理 (BedWarsRecommendManager)    # 推荐系统总控
│   ├── 推荐方案 (RecommendScheme)            # 推荐方案定义
│   ├── 推荐处理 (PlayerRecommendHandler)     # 玩家个人推荐
│   └── 方案池 (RecommendSchemePool)          # 推荐方案池
└── 用户界面 (User Interface)                # 多样化UI支持
    ├── 表单界面 (Form Windows)               # 现代UI表单
    ├── 容器界面 (Container UI)               # 经典箱子界面
    └── ModUI界面 (ModUI System)              # 网易版增强UI
```

## 核心系统详解

### 1. 商店核心系统 (Store Core System)

#### 商店实例 (BedWarsShop.java)
商店实例是每个游戏房间的商店对象，在Stage创建时实例化：

```java
// 商店核心属性
private final BedWarsStage stage;              // 关联的游戏Stage
private final BedWarsShopConfig config;        // 商店配置
private final List<BedWarsShopCategory> categories; // 商店分类列表
```

**关键功能实现**：
- **多UI适配**：根据客户端类型和设置自动选择UI界面
- **资源显示**：实时显示玩家拥有的各种货币数量
- **权限控制**：检查玩家是否可以访问商店（队伍存活状态）

#### 商店配置系统 (BedWarsShopConfig.java)
```java
// 配置核心结构
private final String name;                      // 商店名称（多语言key）
private final String intro;                     // 商店介绍（可选）
private final List<BedWarsShopCategoryConfig> shopCategoriesConfig; // 分类配置列表
private final Boolean showRecommend;            // 是否显示推荐系统
```

#### 商店分类系统 (BedWarsShopCategory.java)
每个商店分类包含一组相关商品，支持多种高级特性：

**动态商品展示**：
- **随机展示** (`randomShowcase`): 从商品池随机选择限定数量展示
- **轮换商品** (`rotating`): 基于日期的商品轮换机制
- **特殊功能**: 陷阱展示、旋转商品等特殊UI扩展

```java
// 核心分类属性
private final Map<String, ShopGoods> goodsMap;  // 商品映射表
```

**购买成功回调机制**：
```java
public void onBuySuccess(ShopGoods goods) {
    if (config.randomShowcase > 0) {
        // 购买后自动替换随机商品
        // 从剩余商品池中随机选择新商品
    }
}
```

### 2. 货币与价格系统 (Currency & Pricing System)

#### 货币类型枚举 (BedWarsShopCurrency.java)
定义了起床战争中的所有货币类型：

```java
// 货币类型及其特性
COPPER   (铜锭)   - 基础货币，金色显示，不产生拾取特效
IRON     (铁锭)   - 基础货币，白色显示，不产生拾取特效  
GOLD     (金锭)   - 中级货币，黄色显示，不产生拾取特效
DIAMOND  (钻石)   - 高级货币，水蓝显示，产生拾取特效
EMERALD  (绿宝石) - 顶级货币，绿色显示，产生拾取特效
EXP      (经验值) - 特殊货币，用于经验模式
SNOWFLAKE(雪花)   - 活动货币，用于特殊活动
```

**货币特性设计**：
- **稀有度标识** (`spawnPickupMeme`): 钻石和绿宝石产生拾取特效
- **经验替换** (`expReplaceType`): 用于经验模式的货币转换
- **图标系统** (`icon`): 统一的图标显示系统

#### 价格计算系统 (BedWarsShopGoodsPrice.java)
提供灵活的多货币价格计算和管理：

**价格构建方法**：
```java
// 单一货币价格
BedWarsShopGoodsPrice.ofIron(4)           // 4个铁锭
BedWarsShopGoodsPrice.ofGold(2)           // 2个金锭
BedWarsShopGoodsPrice.ofDiamond(1)        // 1个钻石

// 组合货币价格
BedWarsShopGoodsPrice.ofIronGold(2, 1)    // 2铁锭 + 1金锭
BedWarsShopGoodsPrice.ofCopperDiamond(1, 2) // 1铜锭 + 2钻石
```

**价格计算核心功能**：
```java
// 支付能力检查
public boolean canAfford(ECPlayer player) {
    return this.currencies.object2IntEntrySet().stream()
        .allMatch(e -> e.getKey().getPlayerHave(player) >= e.getIntValue());
}

// 扣除货币
public void payForIt(ECPlayer player) {
    this.currencies.object2IntEntrySet().stream()
        .forEach(e -> e.getKey().payForIt(player, e.getIntValue()));
}
```

### 3. 商品系统 (Goods System)

#### 商品池管理 (BedWarsShopGoodsPool.java)
全局商品池，采用单例模式管理所有商品配置：

**商品分类结构**：
```java
// 方块类商品 (Block Category)
"block.wool"        - 羊毛方块 (16个) - 4铁锭
"block.clay"        - 粘土方块 (16个) - 12铁锭  
"block.plank"       - 木板方块 (16个) - 4金锭
"block.endstone"    - 末地石 (12个) - 24铁锭
"block.obsidian"    - 黑曜石 (4个) - 4绿宝石

// 武器类商品 (Weapon Category)  
"weapon.wood_sword"    - 木剑 - 10铁锭
"weapon.stone_sword"   - 石剑 - 20铁锭
"weapon.iron_sword"    - 铁剑 - 7金锭
"weapon.diamond_sword" - 钻剑 - 4钻石

// 护甲类商品 (Armor Category)
"armor.leather"     - 皮革套装 - 永久免费
"armor.chainmail"   - 锁链套装 - 40铁锭
"armor.iron"        - 铁质套装 - 12金锭
"armor.diamond"     - 钻石套装 - 6钻石

// 工具类商品 (Tools Category)
"tool.shears"       - 剪刀 - 4铁锭
"tool.pickaxe"      - 镐子 - 10铁锭
"tool.axe"          - 斧头 - 10铁锭

// 弓箭类商品 (Bow Category)
"bow.bow"           - 弓 - 12金锭
"bow.arrow"         - 箭 (8支) - 2金锭

// 食物类商品 (Food Category)
"food.apple"        - 金苹果 - 3金锭
"food.steak"        - 牛排 (2个) - 3铁锭

// 药水类商品 (Potion Category)
"potion.speed"      - 速度药水 (45秒) - 1绿宝石
"potion.jump"       - 跳跃药水 (45秒) - 1绿宝石
"potion.invisibility" - 隐身药水 (30秒) - 2绿宝石

// 特殊道具 (Special Items)
"special.tnt"       - TNT - 4金锭
"special.fireball"  - 火球 - 40铁锭
"special.enderpearl" - 末影珍珠 - 4绿宝石
"special.water_bucket" - 水桶 - 6金锭
"special.sponge"    - 海绵 (4个) - 1绿宝石

// 陷阱类商品 (Trap Category)
"trap.alert"        - 警报陷阱 - 1钻石
"trap.fatigue"      - 疲劳陷阱 - 1钻石  
"trap.slowness"     - 缓慢陷阱 - 2钻石
"trap.beatback"     - 击退陷阱 - 1钻石
```

**商品配置构建**：
```java
// 复杂商品配置示例 - 羊毛方块
addConfig(ShopGoodPracticableConfig.builder("block.wool")
    .name(new TranslateMessage("bedwars.shop.block.wool"))
    .intro(new TranslateMessage("bedwars.shop.block.wool.intro"))
    .showItem(p -> {
        // 动态生成队伍色彩羊毛
        DyeColor color = BedWarsStage.getStageTeam(p).getTeamDyeColor();
        Item item = BlockStatesWool.fromDyeColor(color).orElseThrow().toItem(16);
        // 个性化商店装饰集成
        if (p.getNowStage() instanceof BedWarsBedStage) {
            BedWarsOrnamentPersonalizedShop ornament = 
                BedWarsOrnamentType.PERSONALIZED_SHOP.findCurrentOrnament(p);
            item = ornament.createWoolItem(16, color);
        }
        return item;
    })
    .build()
);
```

### 4. 团队升级系统 (Team Upgrade System)

#### 升级管理器 (TeamUpgradeManager.java)
管理团队级别的升级项目和效果：

**升级项目类别**：
```java
// 生命值升级 (Health Upgrade)
private int healthLevel = 0;           // 最大等级3
// 等级1: +2生命值 - 2钻石
// 等级2: +4生命值 - 4钻石  
// 等级3: +6生命值 - 8钻石

// 护甲升级 (Armor Upgrade)  
private int armorLevel = 0;            // 最大等级4
// 等级1: 保护I - 5钻石
// 等级2: 保护II - 10钻石
// 等级3: 保护III - 20钻石
// 等级4: 保护IV - 30钻石

// 武器升级 (Weapon Upgrade)
private int swordLevel = 0;            // 最大等级1
// 等级1: 锋利I - 8钻石

// 生成器升级 (Generator Upgrade)
private int generatorIronLevel = 1;    // 铁锭生成器升级
private int generatorGoldLevel = 1;    // 金锭生成器升级
// 铁锭升级: 2钻石, 4钻石 (50%速度提升, 100%速度提升)
// 金锭升级: 4钻石, 8钻石 (50%速度提升, 100%速度提升)

// 特殊升级项目
private int superMiner = 0;            // 急迫效果 - 2钻石
private int compass = 0;               // 追踪指南针 - 2钻石
```

**升级效果应用**：
```java
// 玩家生命值计算
public int getPlayerAddHeath() {
    switch (healthLevel) {
        case 1: return 2;
        case 2: return 4; 
        case 3: return 6;
        default: return 0;
    }
}

// 护甲附魔等级
public int getPlayerArmorEnchantmentLevel() {
    return Math.min(armorLevel, getMaxArmorLevel());
}
```

### 5. 智能推荐系统 (Intelligent Recommendation System)

#### 推荐管理器 (BedWarsRecommendManager.java)
管理推荐方案池和玩家个人推荐状态：

```java
// 核心组件
private final List<RecommendScheme> schemesPool;          // 推荐方案池
private final Map<ECPlayer, PlayerRecommendHandler> recommendSchemes; // 玩家推荐处理器
```

#### 推荐算法核心 (PlayerRecommendHandler.java)
实现智能推荐的核心算法：

**推荐触发机制**：
```java
public void onGetResource() {
    for (NoticeEntry entry : noticeEntry) {
        entry.onGetResource();  // 检查是否可购买推荐物品
    }
}

// 推荐提醒逻辑
private void onGetResource() {
    if (totalPrice.canAfford(player)) {
        // 显示购买提醒
        player.sendTitle(new TranslateMessage(""), 
            new TranslateMessage("bedwars.recommend.can-buy", 
                this.nextGoods.getGoodsConfig().getName().getArgRawMsg()), 
            10, 10, 20);
        this.checkNext();  // 自动切换到下一个推荐物品
    }
}
```

**推荐方案设计**：
```java
// 推荐方案示例
"速攻方案": [
    羊毛16个 -> 木剑 -> 链甲套装 -> 剪刀 -> 火球
]

"防守方案": [  
    末地石12个 -> 弓箭套装 -> 警报陷阱 -> 疲劳陷阱 -> 团队升级
]

"资源控制方案": [
    生成器升级 -> 急迫效果 -> 治疗池 -> 钻石套装 -> 末影珍珠
]
```

### 6. 用户界面系统 (User Interface System)

#### 多界面适配策略
系统根据客户端类型和用户设置自动选择合适的UI界面：

```java
// UI选择逻辑 - BedWarsShop.java:57
public void openStore(ECPlayer player, int shopIndex) {
    if (player.isNetEaseClient() && 
        player.getMerchandiseItem("bedwars", "legacy-shop").getData() == 0 &&
        player.getResourcePacks().containsKey(ECPlayer.PACK_RES_MOD)) {
        // 网易版ModUI界面
        player.showModUIStack(new BedWarsShopModUI(this, player, shopIndex, 0));
    } else {
        if (player.getUIProfile() == ClientChainData.UI_PROFILE_CLASSIC) {
            // 经典箱子界面
            new BedWarsShopContainer(this, player, shopIndex).setToPlayer(player);
        } else {
            // 现代表单界面
            player.showFormWindow(new ShopMainFormWindow(player, this, shopIndex));
        }
    }
}
```

#### 表单界面系统 (Form Interface)
**主商店表单** (`ShopMainFormWindow.java`)：
- **推荐显示**: 优先显示智能推荐的物品
- **分类导航**: 展示所有可用的商店分类
- **资源显示**: 实时显示玩家资源状态
- **声音反馈**: 提供音效反馈增强用户体验

#### 容器界面系统 (Container Interface)  
**商店容器** (`BedWarsShopContainer.java`)：
- **分类切换**: 顶部9个槽位显示分类选项
- **商品展示**: 中间区域展示当前分类商品
- **特殊功能**: 支持陷阱槽位显示等特殊功能
- **视觉指示**: 使用不同颜色玻璃板指示当前分类

```java
// 分类显示逻辑
public void showCategory(int index, BedWarsShopCategory category) {
    // 更新分类指示器
    for (int c = 0; c < 9; c++) {
        Item item = (index == c) ? 
            Item.get(ECItems.PANE2D_LIME) : Item.get(ECItems.PANE2D_GRAY);
        this.slots.put(c + 9, item);
    }
    // 展示商品
    for (ShopGoods goods : category.getGoodsMap().values()) {
        this.slots.put(getPaddedIndex(i++) + 18, new BuyGoodItem(shop, player, this, goods));
    }
}
```

## 商店交互流程

### 购买流程设计
```
1. 界面打开
   ├── 检查玩家队伍状态
   ├── 选择合适的UI界面  
   ├── 显示推荐物品（如果启用）
   └── 播放打开音效

2. 商品浏览
   ├── 分类导航和切换
   ├── 商品信息展示
   ├── 价格和货币检查
   └── 推荐系统提示

3. 购买确认
   ├── 货币充足性验证
   ├── 库存和条件检查
   ├── 执行购买逻辑
   └── 更新推荐状态

4. 购买完成
   ├── 物品发放到背包
   ├── 货币扣除处理
   ├── 统计数据更新
   └── 音效和视觉反馈
```

### 推荐系统工作流程
```
1. 推荐激活
   ├── 玩家选择推荐方案
   ├── 初始化推荐处理器
   ├── 计算当前推荐物品
   └── 显示推荐提示

2. 资源监听  
   ├── 监听玩家资源变化
   ├── 检查推荐物品购买能力
   ├── 显示购买提醒标题
   └── 自动切换下一推荐

3. 购买集成
   ├── 推荐物品优先显示
   ├── 一键购买推荐物品
   ├── 购买后自动更新推荐
   └── 推荐完成提示
```

## 特殊功能和扩展

### 1. 个性化商店装饰集成
```java
// 装饰系统集成 - BedWarsShopGoodsPool.java:58
if (p.getNowStage() instanceof BedWarsBedStage) {
    BedWarsOrnamentPersonalizedShop ornament = 
        BedWarsOrnamentType.PERSONALIZED_SHOP.findCurrentOrnament(p);
    // 应用个性化装饰到商品展示
    item = ornament.createWoolItem(16, color);
    texture = ornament.getWoolTexture();
}
```

### 2. 陷阱系统商店集成
```java
// 陷阱展示特殊处理 - BedWarsShopCategory.java:27
CHEST_UI_EXTRAS.put("trap", ((container, category, player, shopIndex) -> {
    // 显示已购买的陷阱状态
    List<BedWarsTrap> traps = stage.getTrapManager().getTraps().get(team).get(shopIndex);
    // 为每个陷阱槽位生成显示物品
    for (int i = 0; i < 3; i++) {
        // 根据陷阱状态显示不同的物品和文本
    }
}));
```

### 3. 动态商品系统
```java
// 随机展示商品 - BedWarsShopCategory.java:95
if (config.randomShowcase > 0) {
    // 从商品池随机选择指定数量的商品展示
    arrayGoods = new String[Math.min(config.randomShowcase, goods.length)];
    // 使用ThreadLocalRandom确保随机性
}

// 轮换商品 - BedWarsShopCategory.java:106  
if (config.rotating > 0) {
    // 基于当前日期计算轮换商品
    int day = LocalDate.now().getDayOfYear();
    int index = day % goods.length;
    arrayGoods = new String[]{goods[index]};
}
```

### 4. 多客户端支持
- **PC版**: 支持表单界面和容器界面
- **网易版**: 支持ModUI增强界面和传统界面切换
- **移动版**: 自适应界面布局和触控优化

## 性能优化策略

### 1. 缓存机制
- **商品池缓存**: 全局单例模式，避免重复创建商品配置
- **价格计算缓存**: 缓存团队升级后的价格调整
- **UI状态缓存**: 缓存界面状态减少重复计算

### 2. 异步处理
- **推荐计算**: 推荐算法的复杂计算使用异步处理
- **数据库查询**: 玩家推荐方案的加载使用异步查询
- **UI更新**: 大量UI元素的更新使用批量处理

### 3. 内存优化
- **对象复用**: 商品实例和价格对象的复用机制
- **懒加载**: 商品配置的按需加载
- **垃圾回收**: 及时清理临时对象和缓存数据

## 扩展开发指南

### 1. 添加新商品类型
```java
// 1. 在BedWarsShopGoodsPool中注册新商品
addConfig(ShopGoodPracticableConfig.builder("new_item_key")
    .name(new TranslateMessage("新商品名称"))
    .intro(new TranslateMessage("商品描述"))
    .simpleItem(Item.get(Item.ITEM_ID, 0, count))
    .build()
);

// 2. 配置商品价格
stage.getBedWarsConfig().setPrice("new_item_key", 
    BedWarsShopGoodsPrice.ofGold(price));

// 3. 添加到相应的商店分类
category.addGoods("new_item_key");
```

### 2. 创建自定义推荐方案
```java
// 1. 定义推荐路线
RecommendLine[] lines = {
    new RecommendLine("block.wool", "weapon.wood_sword", "armor.chainmail"),
    new RecommendLine("tool.shears", "special.fireball"),
    new RecommendLine("upgrade.armor", "upgrade.sword")
};

// 2. 创建推荐方案
RecommendScheme scheme = new RecommendScheme("custom_scheme", 
    new TranslateMessage("自定义方案"), lines);

// 3. 注册到推荐管理器
stage.getRecommendManager().registerRecommendSchemes(new RecommendScheme[]{scheme});
```

### 3. 扩展UI界面
```java
// 1. 继承现有UI类
public class CustomShopFormWindow extends ShopMainFormWindow {
    public CustomShopFormWindow(ECPlayer player, BedWarsShop shop, int shopIndex) {
        super(player, shop, shopIndex);
        // 添加自定义UI元素
        this.addCustomButtons();
    }
}

// 2. 注册到商店系统
shop.setCustomUIProvider((player, shop, shopIndex) -> 
    new CustomShopFormWindow(player, shop, shopIndex));
```

## 调试和故障排除

### 1. 常见问题诊断
- **商品不显示**: 检查商品配置和价格设置
- **购买失败**: 验证货币充足性和购买条件
- **推荐不工作**: 确认推荐方案配置和玩家状态
- **UI异常**: 检查客户端兼容性和界面配置

### 2. 调试工具
- **商店状态查看**: `/bedwars shop status` 查看商店配置
- **推荐系统调试**: `/bedwars recommend debug` 显示推荐状态
- **价格验证**: `/bedwars price check <item>` 验证商品价格

### 3. 性能监控
- **购买统计**: 监控商品购买频率和成功率
- **推荐效果**: 统计推荐系统的使用率和转化率
- **UI性能**: 监控不同UI界面的响应时间

## 总结

起床战争商店系统通过精心设计的分层架构，实现了功能丰富、性能优秀、扩展性强的游戏经济系统。系统的核心优势包括：

1. **灵活的商品管理**: 支持动态商品、随机展示、轮换商品等高级特性
2. **智能推荐算法**: 基于玩家行为和游戏状态的智能购买推荐
3. **多样化UI支持**: 适配不同客户端的多种界面形式
4. **完整的升级体系**: 团队升级和个人装备的完整价格体系
5. **个性化集成**: 与装饰系统的深度集成提升用户体验

这样的系统设计不仅满足了当前的游戏需求，也为未来的功能扩展和性能优化提供了坚实的技术基础。通过模块化的架构和清晰的接口设计，开发团队可以轻松地添加新功能、修改现有逻辑，并保持系统的稳定性和可维护性。