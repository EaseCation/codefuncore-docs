# API 参考

这里是 CodeFunCore 的 API 参考文档。

## 核心 API

### CodeFunCore

主要的核心类，用于创建和管理应用实例。

#### 构造函数

```typescript
new CodeFunCore(options?: CodeFunCoreOptions)
```

**参数:**

- `options` (可选) - 配置选项对象

**返回值:**

- `CodeFunCore` 实例

#### 方法

##### init()

初始化应用。

```typescript
init(): void
```

##### run()

运行应用。

```typescript
run(): Promise<void>
```

##### stop()

停止应用。

```typescript
stop(): Promise<void>
```

## 工具函数

### utils

提供各种实用工具函数。

```typescript
import { utils } from 'codefuncore'
```

#### utils.format()

格式化字符串。

```typescript
utils.format(template: string, ...args: any[]): string
```

## 类型定义

### CodeFunCoreOptions

```typescript
interface CodeFunCoreOptions {
  option1?: string
  option2?: number
  option3?: boolean
}
```

更多 API 文档正在完善中...
