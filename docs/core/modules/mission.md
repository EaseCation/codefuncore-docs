# Mission 可复用任务框架

### 组成部分（对应两类配置文件）

- MissionConfig：能够「直接复用的任务」及其「默认属性」
    - 触发（行为，主要是missionId决定，需要去到插件中的事件监听器，主动调用）
    - 数值（默认的task要求数值）
    - 是否显示进度（默认的是否现实进度的开关，由任务属性决定，如放置方块之类的任务，就不需要显示进度）
- MissionTask：实际活动中，需要注册的ECTask
    - 目的是，可以同时进行多个活动，复用同一个任务，这时候，不同的活动需要有不同的taskCategory和taskId，用于储存任务进度，接近于Mission的实例
    - 部分情况下，需要保留MissionConfig的 `触发`、`是否显示进度`，但是需要另外设置任务数值
        - 比如A活动中，要求杀敌5个；B活动中，要求杀敌10个
    - 通过配置文件，快速批量注册ECTask

## MissionConfig

一般统一注册，在`CodeFunCore/src/main/resource/net/easecation/mission/mission.yml`

对应Notion中的[](https://www.notion.so/00050d8c93fa4952ac4f03156ac868e6?pvs=21)

```yaml
# 直接是个map，往下列MissionConfig的默认配置（total和showProgress）
missionId-xxxx:
	total: 3000
	showProcess: false
missionId-xxxx:
	total: 10
	showProcess: true
```

语言配置，需要在cfgLanguageMerchandise表中，自己配置

| key | zh |
| --- | --- |
| mission.xxx | 任务名称 |
| mission.xxx.intro | 任务详细介绍 |

在代码中注册MissionConfig，以及触发Mission

```java
// 注册MissionConfig
MissionManager.registerMission(String id, ConfigSection section);
MissionManager.registerMission(MissionConfig config);

// 任务触发，一般都统一写在 MissionTriggerListener 中，
// 除非需要监听的插件不在CodeFunCore的依赖之中，如跑酷天堂。
MissionManager.get(missionId).process(player, add);

```

---

## MissionTask

每个活动，对应一个配置

（包含通行证，但是已经融入到通行证配置中）

### Period 任务周期

储存了form和to的两个方法，能够实现：

- 自定义起止时间（xxxx～xxxx）
- 按照某个周期进行循环（每日、每周、每月、每年）

支持从配置文件中读取，然后就可以在MissionTask中快速复用

```yaml
# 定义自定义周期
period:
	ss1_w1:
		from: '2021-09-30 18:00:00'
		to: '2022-01-31 00:00:00'
	ss1_w2:
		from: '2021-10-2 18:00:00'
		to: '2022-01-31 00:00:00'

# 注册MissionTask
missions:
	- task: "ss1.1-1" # 格式为 category.idTask
		mission: missionId # 已注册的MissionConfig
		period: "ss1_w1" # 使用上方注册的有效时间/周期
		gain: # 完整写法
			merchandises:
				- ""
			callbacks:
				- type: exchange
					exchange: "xxxxxx"
		gain: "ss2.xxxx.xxxx:2000" # 单merchandise简单写法
	- task: "ss1.1-2"
		missionId: missionId
		period: "daily" # 使用预置的周期
		total: 4000 # 覆盖默认配置，单独制定total
		
```

```yaml
# 在GamePass中，对应的周，需要与注册的任务周期对应上，
# 才能在通行证UI中正常按周显示任务列表。
weekPeriod:
	1: ss1_w1
	2: ss1_w2
	3: ss1_w3
	4: ss1_w4
	5: ss1_w5
```
