# SimpleStateMachine使用文档

SimpleStateMachine是CodeFunCore中的轻量级状态机框架，适用于游戏逻辑状态管理。

## 核心概念

### State（状态）
实现`State`接口的枚举或类，表示状态机的各个状态。

### StateHandler（状态处理器）
用于配置状态的行为，支持：
- `onEnter()` - 进入状态时执行
- `onExit()` - 退出状态时执行
- `onUpdate()` - 每次tick时执行
- `transitionTo()` - 定义状态转换条件

## 快速使用

### 1. 定义状态枚举
```java
public enum GameState implements SimpleStateMachine.State {
    WAITING,
    GAMING,
    ENDED
}
```

### 2. 构建状态机
```java
SimpleStateMachine stateMachine = SimpleStateMachine.builder()
    .startWith(GameState.WAITING)
    .addState(GameState.WAITING, handler -> handler
        .onEnter(() -> player.sendMessage("等待开始"))
        .onUpdate(() -> checkPlayerCount())
        .transitionTo(GameState.GAMING, sm -> playerCount >= 2))
    .addState(GameState.GAMING, handler -> handler
        .onEnter(() -> startGame())
        .onUpdate(() -> updateGame())
        .afterMillis(GameState.ENDED, 300000)) // 5分钟后结束
    .addState(GameState.ENDED, handler -> handler
        .onEnter(() -> endGame()))
    .build();
```

### 3. 运行状态机
```java
// 每个游戏tick调用
stateMachine.onTick();

// 手动切换状态
stateMachine.transitionTo(GameState.ENDED);

// 获取当前状态
GameState current = (GameState) stateMachine.getCurrentState();
```

## 常用功能

### 时间条件转换
```java
.afterMillis(NextState.TARGET, 5000) // 5秒后转换
```

### 自定义条件转换
```java
.transitionTo(NextState.TARGET, sm -> {
    long elapsed = System.currentTimeMillis() - sm.getStateStartTime();
    return elapsed > 3000 && someCondition;
})
```

### 立即转换
```java
.onEnter(() -> {
    if (shouldSkip) {
        handler.transitionNow(NextState.TARGET);
    }
})
```

### 获取状态时间
```java
long stateTime = stateMachine.getStateStartTime();
long elapsed = System.currentTimeMillis() - stateTime;
```

## 最佳实践

1. **状态定义清晰** - 使用描述性的状态名称
2. **避免复杂逻辑** - 在onUpdate中保持简单的检查
3. **合理使用时间** - 利用afterMillis处理时间相关转换
4. **错误处理** - 状态机会自动处理未定义状态的错误
5. **性能考虑** - 避免在状态回调中执行耗时操作

## 注意事项

- 状态机是线程安全的，但回调函数需要自行处理并发
- 状态转换在下一次onTick时生效
- 手动转换（transitionTo）会立即生效
- 未定义的状态会记录错误日志但不会崩溃