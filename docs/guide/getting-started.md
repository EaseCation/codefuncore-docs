# 快速开始

本指南将帮助你快速开始使用 CodeFunCore。

## 安装

使用 npm 安装：

```bash
npm install codefuncore
```

使用 yarn 安装：

```bash
yarn add codefuncore
```

使用 pnpm 安装：

```bash
pnpm add codefuncore
```

## 基础使用

安装完成后，你可以在项目中引入并使用 CodeFunCore：

```javascript
import { CodeFunCore } from 'codefuncore'

const app = new CodeFunCore({
  // 配置选项
})

app.init()
```

## 配置选项

CodeFunCore 支持以下配置选项：

- `option1` - 选项 1 的说明
- `option2` - 选项 2 的说明
- `option3` - 选项 3 的说明

## 示例

这里是一个完整的示例：

```javascript
import { CodeFunCore } from 'codefuncore'

const app = new CodeFunCore({
  option1: 'value1',
  option2: 'value2'
})

app.init()
app.run()
```

## 下一步

- 查看 [API 参考](/api/) 了解更多功能
- 探索更多高级特性
