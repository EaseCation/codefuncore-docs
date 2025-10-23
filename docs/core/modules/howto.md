# HowToDo 快捷打开（商品获取方式配置）

## 配置**格式和支持的行为**

- **`stage:<stageType>`**：加入指定类型的房间。例如，**`stage:mw`** 表示加入 **`mw`** 类型的房间。
- **`lobby:<lobbyType>`** 或 **`hub:<lobbyType>`**：加入指定类型的大厅。例如，**`lobby:main`** 表示加入 **`main`** 类型的大厅。
- **`games`**：打开小游戏中心。
- **`games:<gameType>`**：打开小游戏中心并跳转至某分类的游戏。例如，**`games:bedwars`** 表示打开小游戏中心并跳转至起床战争分类。
- **`party`**：显示组队主界面。
- **`lottery`**：打开抽奖界面。
- **`lottery:<lotteryType>`**：打开指定类型的抽奖箱界面。例如，**`lottery:main_gold`** 表示打开镀金黑石盒的抽奖界面。
    - **注意抽奖箱id（main_gold）需要注册，不能随便填。如需新增请联系开发。**
    - **目前支持：rl1、rl2、rl3、rl4、main_act_2024_idol、main_act_2024_newyear、main_act_2024_joker、main_act_2024_panda、main_act_2025_newyear、main_wood、main_stone、main_iron、main_gold、main_diamond、bedwars-remake、mm、sw、mw**
- **`homeland`**：显示加入家园的UI。
- **`neteaseshop:<shopType>`**：请求打开网易商店界面，并跳转至指定类型。
    - **因为点券系统上线，网易商店基本不使用。**
- **`neteaseshopitem:<itemName>`**：请求打开网易商店界面，并跳转至指定物品。
    - **因为点券系统上线，网易商店基本不使用。**
- **`passcard:<passcardType>`**：尝试打开通行证界面。例如，**`passcard:s5`** 表示打开S5通行证界面。
    - **注意通行证id（s5）需要注册，不能随便填。如需新增请联系开发。**
- **`ranking:<rankingType>`**：打开指定小游戏类型的排位界面。例如，**`ranking:bedwars`** 表示打开起床战争排位界面。
    - **注意只有部分游戏能通过此方法打开排位界面。如需新增请联系开发。**
    - **目前支持：mw、mm、bedwars**
- **`activity:<activityName>`**：尝试打开指定里程碑活动界面。例如，**`activity:act_2023_xrpd`** 表示打开2023夏日派对里程碑活动界面。
    - **注意这里的id（act_2023_xrpd）需要注册，不能随便填。如需新增请联系开发。**
- **`workshop`**：显示个性工坊界面。
- **`scoretop`**：显示所有游戏的分数排行榜界面。