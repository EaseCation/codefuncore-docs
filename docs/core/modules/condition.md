# ECCondtion 表达式

### Operator

- 数值计算：`+ - * / %`
- 布尔值计算：`! ≤ ≥ < > == != && ||`
- 条件判断：`? :`

### Terms

- Merchandise：{category.iditem} （玩家维度的变量，对于每个玩家独立，且会保存至数据库，**注意前缀的category部分为系统预缓存玩家数据的根据，使用新的category需要联系开发去注册，否则无法正常使用。iditem部分可自由命名，但不可超过32字符，变量命名规范使用点号(.)间隔**）
- 变量：%variable（主要用于可以直接获取的值，例如 %pc）
- 外部值：$extern（主要用于需要额外计算的值，例如 $task.completed.s5.daily.2）
- 全局KV：@key（全服共享的整数值，存储在Redis中，所有玩家访问同一个值，例如 @event.halloween.total-souls）

### 支持的变量

在表达式实例初始化时确定的值

- %time: int（unixtime，以秒为单位，时区为UTC-0，**注意此值为创建ECCondition实例的时间，如果Java内部缓存了ECCondition实例，则不等于当前时间，获取当前时间建议使用$system.time**）
- %pc : boolean 是否是PC客户端
- %test : boolean 是否是测试环境（包含公开测试服、内部测试服、本地环境等）

### 支持的外部值

在表达式实例运行时确定的值

- $system.time : int（获取当前unixtime，以秒为单位，时区为UTC-0）
- $task.data.category.idTask : int（获取玩家Task的data）
- $task.completed.category.idTask : boolean（获取玩家Task是否已完成）
- $task.awarded.category.idTask : boolean（获取玩家Task是否已领取奖励）
- $task.startTime.category.idTask : int（获取玩家Task开始时间的unixtime）
- $task.endTime.category.idTask : int（获取玩家Task结束时间的unixtime）
- $task.lastTime.category.idTask : int（获取玩家Task完成时间的unixtime）
- $ecvip.cached : boolean （获取玩家的ECVP数据缓存是否已加载完成）
- $ecvip.level : int（获取玩家当前缓存的ECVIP的level）
- $party.in : boolean（玩家是否在小队中）
- $party.members : int（玩家小队人数）
- $party.isleader : boolean（玩家是否是小队队长）
- $exp.level : int（玩家的大厅等级）

### 示例

**基础条件判断：**
- {cm2023.npc.yang.count} > 0
- (\$task.completed.s5.daily.2) && ($system.time < 1702620736) && (%pc)

**全局KV使用：**
- @event.halloween.total-souls >= 10000  （全服万圣节灵魂收集目标是否达成）
- @system.maintenance.mode == 1  （系统是否处于维护模式）
- @test.counter * 100 / 500  （计算全局计数器的完成百分比）

```yaml
# NPC测试
- pos: "-144.5:58:-20.5:135:0"
  type: human
  skin: grandpa
  name: NPC测试
  hook:
    - type: dialogue
      param:
        var1: |
          "现在unix时间是 " + $system.time
        var2: |
          {ny2024.dragon-collect.collect.eagle}
        cond: |
          {ny2024.dragon-collect.collect.eagle} == 1 ? "鹰爪已收集" : "鹰爪未收集"
        vip: |
          $ecvip.cached ? $ecvip.level : "未缓存完成"
      dialogue: |
        玩家：{player}，时间：{var1}，数据值：{var2}，条件计算：{cond}，VIP：{vip}

# 全局KV示例
- pos: "-37.5:61:64.5:0"
  type: human
  skin: zombie
  name: 活动进度查看
  hook:
    - type: dialogue
      param:
        souls: |
          @event.halloween.total-souls
        progress: |
          @event.halloween.total-souls * 100 / 10000
        status: |
          @event.halloween.total-souls >= 10000 ? "§a已达成！" : "§c未达成"
      dialogue: |
        §l§6万圣节活动进度§r

        §7当前收集灵魂总数：§d{souls}§r§7 / §d10000§r
        §7完成进度：§e{progress}%§r
        §7目标状态：{status}§r
```
