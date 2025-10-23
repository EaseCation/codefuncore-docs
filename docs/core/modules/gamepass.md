# GamePass 通行证

一种游戏奖励机制，通过做任务，得到积分，达到各通行证等级后，获取奖励。

多线并行，每条线的各等级中设定了奖励。可独立控制各线的解锁状态。

**基于：**ECMerchandise、ECTask、GamePassMission

```java
GamePassTool.registerPassLinesGroup(
	String id, 
	TranslateMessage name, 
	TranslateMessage intro, 
	TimestampGetter startTime, 
	TimestampGetter endTime, 
	int expPreLevel
);
```