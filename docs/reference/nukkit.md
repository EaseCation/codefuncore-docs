More information to come

---

# Aquatic Update Overview

Nukkit现在使用LevelDB存档格式, **可直接导入或导出基岩版存档**. 支持`1.2.13`后更新的新方块以及**多层方块机制**

游戏特性版本可在`nukkit.yml`中的`base-game-version`设置, 此选项的作用与Bedrock的`BaseGameVersion`类似

另外现在规范了常量的命名, 大多使用identifier来命名

## APIs

Nukkit的`Level::getBlock`对应Bedrock的`BlockSource::getBlock`

Nukkit的`Level::getExtraBlock`对应Bedrock的`BlockSource::getExtraBlock`

Nukkit的`Level::setBlock`对应Bedrock的`BlockSource::setBlockSimple`**而不是**`BlockSource::setBlock`

Nukkit的`Level::setExtraBlock`对应Bedrock的`BlockSource::setExtraBlockSimple`**而不是**`BlockSource::setExtraBlock`
