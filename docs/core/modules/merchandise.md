# ECMerchandise 玩家物品数据

永久储存的 `玩家纬度` 的键值对，包含： `category` `idItem` `data`

玩家进服时，需要主动缓存某category的数据 `player.cacheMerchandise(String... category)`

### 使用方法

```java
ECMerchandise m = player.getMerchandiseItem(String category, String idItem);
m.setData(0);
m.add();
```

全自动保存到数据库，因此应用层设置数据后，不需要进行保存操作。