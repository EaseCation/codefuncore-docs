# ECTask EC任务

可定义的周期性（或无周期性）任务的基础部分

包含： `category` `idTask` `data` `time(上次完成时间)`

可定义： `gift(MailGift)` `autoAward(bool)`

```java
ECTaskFactory factory = (rawData, time, isNew) -> FunctionalTask.of();
ECTask.registerTask(factory);
```