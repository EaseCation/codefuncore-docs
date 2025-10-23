# Exchange 兑换

通过那么多的活动，总结出，大家都遵循一个逻辑：**消费资源兑换 → 获取到物品**

因此，抽象出Exchange（兑换）的概念，配合callback的支持，能够实现极其丰富的配置驱动的逻辑编写。

- 通过配置文件注册
- 每个Exchange，都有个key
- 每个Exchange，包含6个部分
    - limit（限制条件）
    - price（兑换价格，用于货币）
    - spend（兑换消费）
    - gain（兑换获得）
    - suc（成功时的回调）
    - failure（spend失败时的回调）
    - failureLimit（limit判断未通过时的回调）
    - failurePrice（price失败时的回调）
- 调用方式
    - 代码调用
    - 在Exchange中，再通过callback连续调用
    - 其他任何支持配置callback的地方，都可调用（通行证、任务回调、大厅NPC等）

### 范例：

花费100个圣符宝石，获得一个圣符宝箱钥匙

```yaml
exc_rl_demo:  # exchange名称
  spend:  # 花费（兑换成功后会扣除）
    merchandises:
      - "rl.coin:100"
  gain:  # 获得
    merchandises:
      - "key.rl1:1"
```

怎么办，我还需要玩家额外花10个EC钻石，同时需要10个圣符宝石！

```yaml
exc_rl_demo:  # exchange名称
  spend:  # 花费（兑换成功后会扣除）
    diamond: 10  # EC钻石
    merchandises:
      - "rl.coin:100"
  gain:  # 获得
    merchandises:
      - "key.rl1:1"
```

把钻石换成EC点券！

```yaml
exc_rl_demo:  # exchange名称
  price:  # 这是一个巨坑！EC点券是另外的经济系统！不走merchandise，所以不在spend里配置！
		type: "wallet_balance",
		currency: "credits",
		amount: 10
  spend:  # 花费（兑换成功后会扣除）
    merchandises:
      - "rl.coin:100"
  gain:  # 获得
    merchandises:
      - "key.rl1:1"
```

那么，如果我需要限制每天只能购买一次，应该怎么办呢？

可以使用limit功能！

```yaml
exc_rl_demo:  # exchange名称
  limit:
    cycle: daily  # 周期，支持：none, daily, weekly, monthly, yearly
    max: 15
    count: "rl.demo.daily-count"  # 数量当然也是需要作为merchandise存储的，这里指定的是存储的merchandise
    last: "rl.demo.last"  # 用于记录上一次兑换时间戳的merchandise存储，毕竟我们需要知道上一次兑换的时间，才能判断周期
  spend:  # 花费（兑换成功后会扣除）
    merchandises:
      - "rl.coin:100"
  gain:  # 获得
    merchandises:
      - "key.rl1:1"
```

### 在NPC中使用exchange

```yaml
npc:
  - pos: "100:100:100"
    type: human
    hook:
      # exchange是一个PlayerAction（也就是在玩家身上执行的，而不是NPC身上）
      # 因此需要通过touch的这个hook来触发
      - type: touch
        callback:
          - type: exchange
            exchange: exc_rl_demo
            # 可选：当价格或花费不足时，是否自动给出基础提示（默认true）
            # failNotice: true
```

```yaml
npc:
  - pos: "100:100:100"
    type: human
    hook:
      # 当然，你也可以通过dialogue来触发！
      - type: dialogue
        dialogue: 你要购买吗？
        button:
          - buttonName: 我要买！
            forceCloseOnClick: true
            callback:
              - type: exchange
                exchange: exc_rl_demo
                # 可选：开启/关闭基础失败提示（默认开启）
                # failNotice: true

#### 基础失败提示（PlayerActionConfigExchange 扩展）

- 当通过 PlayerAction `type: exchange` 触发兑换时，新增开关 `failNotice`（默认 true）。
  - 兼容旧配置键 `basicNoticeOnFailure`（如两者同时配置，优先使用 `failNotice`）。
- 开启后，在以下情况会弹出统一的基础提示（与 ExchangeForm 一致样式与文案）：
  - `price` 不满足（如点券余额不足）。
  - `spend` 不满足（如缺少指定消耗物品/币/经验）。
- 关闭开关则保留原有行为（仅按配置的回调处理，不额外弹提示）。
```

### 1. 限制条件（Limit）

```yaml
#示例：每日答题集卡，每天最多能够回答15次
exc_ny2022_card_answer:
  limit:
    cycle: daily
    max: 15
    count: "ny2022.answer.daily-count"
    last: "ny2022.answer.last"
```

- cycle：周期
    - none
    - daily
    - weekly
    - monthly
    - yearly
- max：最大限制次数
- count：记录次数的merchandise
- last：记录上次操作时间戳的merchandise（用于周期重置）

### 2. 兑换价格（Price）（数据结构为ExchangePrice）

```yaml
#示例：消费100点券兑换
exc_test:
	price:
		type: "wallet_balance",
		currency: "credits",
		amount: 100
  gain:
		#此处省略，具体请看下方
```

### 3. 兑换消费（Spend）（数据结构为ExchangeContent）

```yaml
#示例：集卡需要1～4的卡片，各1个
exc_ny2022_card_merge:
  spend:
    merchandises:
      - "ny2022.card.1:1"
      - "ny2022.card.2:1"
      - "ny2022.card.3:1"
      - "ny2022.card.4:1"
	gain:
		#此处省略，具体请看下方
```

- EC币

    ```yaml
    coin: 100
    ```

- EC钻石

    ```yaml
    diamond: 100
    ```

- merchandise组

    ```yaml
    merchandises:
    	- "ny2022.card.1:1"
    	- "ny2022.card.2:1"
      - "ny2022.card.3:1"
      - "ny2022.card.4:1"
    ```


### 4. 兑换获得（Gain）

数据结构为ExchangeContent数组（因为支持按照权重，进行随机）

获得时，会自动通过message显示给玩家（恭喜获得了xxxx × n）

```yaml
#示例：集卡时，根据权重随机获得一张卡片
exc_ny2022_card_get:
  gain:
    - merchandises:
        - "ny2022.card.1:1"
      weight: 20
    - merchandises:
        - "ny2022.card.2:1"
      weight: 30
    - merchandises:
        - "ny2022.card.3:1"
      weight: 30
    - merchandises:
        - "ny2022.card.4:1"
      weight: 10
```

```yaml
#示例：集卡需要1～4的卡片各1个，接着能够合成以下物品：
exc_ny2022_card_merge:
  spend:
    merchandises:
      - "ny2022.card.1:1"
      - "ny2022.card.2:1"
      - "ny2022.card.3:1"
      - "ny2022.card.4:1"
  gain:
    - coin: 100
      diamond: 5
      merchandises:
        - "key.ny2022:1"
```

可在gain中指定调用其他的exchange：

```yaml
exec_main:
	gain:
		- subExchanges: "exec_sub1"
      weight: 20
		- subExchanges: "exec_sub2"
      weight: 80
exec_sub1:
	gain: "ny2022.card.1:1"
exec_sub2:
	gain: "ny2022.card.2:1"
```

也可以在gain中指定condition，不符合条件的gain不会执行：

```yaml
exc_test:
	gain:
		- condition: "{test.value} < 4"
			weight: 100
			subExchanges: "exc_sub1"
		- condition: "{test.value} < 4"
			weight: 20
			subExchanges: "exc_sub2"
...
```

condition中可以用`{merchandiseId}`来获取玩家的merchandise，`%time`可以获取当前服务器时间（以秒为单位）

condition支持的操作符有：`+ - * / % ! && || ?: == != < <= > >=`，可使用`true`或`false`来表示真假值，可以用`()`来组合更复杂的表达式，例如：

```
{test.expireTime} < %time ? ({test.x} + {test.y}) * 2 <= 10 : {test.z} != 0
```

需要注意condition优先于weight执行，如果条件不符合则对应的gain将不参与权重

### 5. 回调（suc、failure、failureLimit都相同）

```yaml
#示例：大厅收集礼盒，每收集到2个，都会自动兑换1个钥匙
exc_ny2022_collect_get_1:
	# 限制每个礼盒，都只能开启1次
	limit:
    max: 1
    count: "ny2022.lobby-collect.1"
	# 记录收集到的礼盒+1
  gain:
    merchandises:
      - "ny2022.lobby-collect:1"
	# 成功时，进行一组回调操作
  suc:
		# 发送title
    - type: title
      title: "{bold}太棒了！"
      sub: "你收集到了一个大厅礼盒～"
		# 发送message
    - type: msg
      text: "{icon-ec-mission} 每找到2个礼盒，就送一个抽奖箱钥匙哦！"
    # 发射烟花🎉
		- type: fireworks
      lifeTime: 10 
		# 执行另一个exchange（用于自动每2个礼盒，兑换1个钥匙）
    - type: exchange
      exchange: "exc_ny2022_collect_exchange"
		# 本质上与gain相同，对某个merchandise进行add，但是不会显示给玩家（恭喜得到了xxxx）
    - type: merchandise.add
      merchandise: "ny2022.lobby-collect.total:1"
	# 重复开启已经找到的礼盒时，进行相应提示
  failureLimit:
    - type: title
      title: "{bold}这个礼盒已经被你打开了"
      sub: "{yellow}赶紧去找找其他礼盒吧"
    - type: sound
      sound: "note.bass"
```

## 代码中

### 代码中注册

```java
// 注册Exchange
ExchangeManager.register(ExchangeConfig config);
// 从配置文件中，注册Exchange
ExchangeManager.register(Config config);
```

### 代码中调用

```java
// 如需使用Exchange，需要通过以下方法对ExchangeConfig进行实例化（为了进行callback而设计）
ExchangeInstance exc = ExchangeManager.instance(String key);
// 直接执行这个Exchange，对应
exc.execute(ECPlayer player);
```

### 代码中为ExchangeInstance传入参数

```java
// 传入额外的Exchange的args参数，将和配置文件中配置的args合并
Map<String, Object> args = new HashMap<>();
// 传入折扣
ExchangeDiscount discount = ExchangeDiscount.EMPTY;
// Exchange批量购买的数量
int batchQuantity = 1;
// 构造ExchangeArguments
ExchangeArguments exchangeArguments = new ExchangeArguments(args, discount, batchQuantity);
// 实例化Exchange
ExchangeInstance exc = ExchangeManager.instance(key, exchangeArguments);
```

### 代码中 ，支持补充回调

- onSuc
- onFailure
- onFailureLimit
- onFailurePrice

```java
ExchangeInstance exc = ExchangeManager.instance(String key);
exc
	.onSuc((player, result) -> {
		// result中包含这次玩家通过gain获取到的内容
		// 可以进行一些兑换成功的成功界面提示
	})
	.onFailure((player, result) -> {
		// result中包含这次玩家所欠缺的spend的内容
    // 可以进行一些对欠缺物品的详细提示
	})
	.onFailureLimit(player -> {
		//这个没有result
	})
	.onFailurePrice(player -> {
		//这个没有result
	})
	.execute(ecPlayer);
```
