# ECNPC 配置文件

## **NPC容器配置 (`ECNPCContainer`)**

1. **reference** (**`string`**): 引用另一个已注册的NPC容器的键名。

    ```jsx
    reference: "anotherContainerKey"
    ```

2. **dialogue** (**`ConfigSection`**): 定义NPC的对话内容的配置部分。
3. **hook** (**`ConfigSection`**): 定义NPC的特定行为和交互的配置部分。
4. **skin** (**`List`**): 包含一系列NPC皮肤的列表。
    - 这里为目前默认注册的一批皮肤，可以直接使用

      > CodeFunCore/src/main/resources/net/easecation/codefuncore/skin/defaultskin.yml
      >

        ```yaml
        skin:
          - skinId: empty
            skinData: res://net/easecation/codefuncore/skin/empty.png
          - skinId: all_empty
            geometryName: geometry.empty
            geometryData: res://net/easecation/codefuncore/skin/empty.geo.json
            skinData: res://net/easecation/codefuncore/skin/empty.png
          - skinId: unknown
            skinData: res://net/easecation/codefuncore/skin/unknown.png
          - skinId: py
            skinData: res://net/easecation/codefuncore/skin/py.png
          - skinId: py-sb
            skinData: res://net/easecation/codefuncore/skin/py-sb.png
          - skinId: py-christmas
            skinData: res://net/easecation/codefuncore/skin/py-christmas.png
          - skinId: py-zhj
            skinData: res://net/easecation/codefuncore/skin/py-zhj.png
          - skinId: py-sg
            skinData: res://net/easecation/codefuncore/skin/py-sg.png
          - skinId: py-football
            skinData: res://net/easecation/codefuncore/skin/py-football.png
          - skinId: py-ny
            skinData: res://net/easecation/codefuncore/skin/py-ny.png
          - skinId: hzmn
            skinData: res://net/easecation/codefuncore/skin/hzmn.png
          - skinId: bedrock.alex
            skinPack: res://net/easecation/codefuncore/skin/Alex.zip
          - skinId: bedrock.ari
            skinPack: res://net/easecation/codefuncore/skin/Ari.zip
          - skinId: bedrock.efe
            skinPack: res://net/easecation/codefuncore/skin/Efe.zip
          - skinId: bedrock.kai
            skinPack: res://net/easecation/codefuncore/skin/Kai.zip
          - skinId: bedrock.makena
            skinPack: res://net/easecation/codefuncore/skin/Makena.zip
          - skinId: bedrock.noor
            skinPack: res://net/easecation/codefuncore/skin/Noor.zip
          - skinId: bedrock.steve
            skinPack: res://net/easecation/codefuncore/skin/Steve.zip
          - skinId: bedrock.sunny
            skinPack: res://net/easecation/codefuncore/skin/Sunny.zip
          - skinId: bedrock.zuri
            skinPack: res://net/easecation/codefuncore/skin/Zuri.zip
          - skinId: sbpy
            skinPack: res://net/easecation/codefuncore/skin/sbpy.zip
          - skinId: christmas
            skinPack: res://net/easecation/codefuncore/skin/christmas.zip
          - skinId: snowdrift
            skinData: res://net/easecation/codefuncore/skin/snowdrift/snowdrift.png
            geometryName: geometry.snowdrift
            geometryData: res://net/easecation/codefuncore/skin/snowdrift/snowdrift.geo.json
          - skinId: boybook
            skinPack: res://net/easecation/codefuncore/skin/boybook.zip
          - skinId: boatnpc
            skinPack: res://net/easecation/codefuncore/skin/boatnpc.zip
          - skinId: callboard
            skinData: res://net/easecation/codefuncore/skin/callboard/callboard.png
            geometryName: geometry.callboard
            geometryData: res://net/easecation/codefuncore/skin/callboard/callboard.geo.json
          - skinId: callboard_huge
            skinData: res://net/easecation/codefuncore/skin/callboard/callboard_huge.png
            geometryName: geometry.callboard_huge
            geometryData: res://net/easecation/codefuncore/skin/callboard/callboard_huge.geo.json
          - skinId: punk
            skinPack: res://net/easecation/codefuncore/skin/punk.zip
          - skinId: villagehead
            skinData: res://net/easecation/codefuncore/skin/villagehead.png
          - skinId: coppie
            skinPack: res://net/easecation/codefuncore/skin/Coppie.zip
          - skinId: joseph
            skinPack: res://net/easecation/codefuncore/skin/Joseph.zip
          - skinId: ai-robot
            skinPack: res://net/easecation/codefuncore/skin/ai-robot.zip
          - skinId: ec-girl
            skinPack: res://net/easecation/codefuncore/skin/ec-girl.zip
          - skinId: grandpa
            skinData: res://net/easecation/codefuncore/skin/grandpa.png
          - skinId: littlegirl
            skinData: res://net/easecation/codefuncore/skin/littlegirl.png
          - skinId: dragon_girl
            skinData: res://net/easecation/codefuncore/skin/dragon_girl.png
          - skinId: shopClerk
            skinData: res://net/easecation/codefuncore/skin/shopClerk.png
          - skinId: sport
            skinData: res://net/easecation/codefuncore/skin/sport.png
          - skinId: starbuck
            skinData: res://net/easecation/codefuncore/skin/starbuck.png
          - skinId: tailor
            skinData: res://net/easecation/codefuncore/skin/tailor.png
          - skinId: vip
            skinData: res://net/easecation/codefuncore/skin/vip.png
          - skinId: zhangyuchu
            skinData: res://net/easecation/codefuncore/skin/zhangyuchu.png
          - skinId: grandma
            skinData: res://net/easecation/codefuncore/skin/grandma.png
          - skinId: zhangyunde
            skinData: res://net/easecation/codefuncore/skin/zhangyunde.png
          - skinId: zhangyunhao
            skinData: res://net/easecation/codefuncore/skin/zhangyunhao.png
          - skinId: adawong
            skinData: res://net/easecation/codefuncore/skin/adawong.png
          - skinId: azhi
            skinData: res://net/easecation/codefuncore/skin/azhi.png
          - skinId: chuishiyuan
            skinData: res://net/easecation/codefuncore/skin/chuishiyuan.png
          - skinId: dragongirl
            skinData: res://net/easecation/codefuncore/skin/dragongirl.png
          - skinId: hotel-npc
            skinData: res://net/easecation/codefuncore/skin/hotel-npc.png
          - skinId: liuyun
            skinData: res://net/easecation/codefuncore/skin/liuyun.png
          - skinId: lurenjia
            skinData: res://net/easecation/codefuncore/skin/lurenjia.png
          - skinId: lurenyi
            skinData: res://net/easecation/codefuncore/skin/lurenyi.png
          - skinId: lvzhi
            skinData: res://net/easecation/codefuncore/skin/lvzhi.png
          - skinId: nmbb
            skinData: res://net/easecation/codefuncore/skin/nmbb.png
          - skinId: ny2024-qf-liuyannpc
            skinData: res://net/easecation/codefuncore/skin/ny2024-qf-liuyannpc.png
          - skinId: replay
            skinPack: res://net/easecation/codefuncore/skin/replay.zip
          - skinId: qiming
            skinData: res://net/easecation/codefuncore/skin/qiming.png
          - skinId: sportman
            skinData: res://net/easecation/codefuncore/skin/sportman.png
          - skinId: xuanyu
            skinData: res://net/easecation/codefuncore/skin/xuanyu.png
          - skinId: younaixin
            skinData: res://net/easecation/codefuncore/skin/younaixin.png
          - skinId: cook
            skinData: res://net/easecation/codefuncore/skin/cook.png
          - skinId: fruitman
            skinData: res://net/easecation/codefuncore/skin/fruitman.png
          - skinId: snowman
            skinData: res://net/easecation/codefuncore/skin/snowman.png
          - skinId: letter
            skinData: res://net/easecation/codefuncore/skin/letter/letter.png
            geometryName: geometry.letter
            geometryData: res://net/easecation/codefuncore/skin/letter/letter.geo.json
          - skinId: awenbaba
            skinData: res://net/easecation/codefuncore/skin/awenbaba.png
          - skinId: store_billboard_awen
            skinData: res://net/easecation/codefuncore/skin/store_billboard_awen.png
            geometryName: geometry.store_billboard_awen
            geometryData: res://net/easecation/codefuncore/skin/store_billboard_awen.geo.json
          - skinId: store_billboard_ebucks
            skinData: res://net/easecation/codefuncore/skin/store_billboard_ebucks.png
            geometryName: geometry.store_billboard_ebucks
            geometryData: res://net/easecation/codefuncore/skin/store_billboard_ebucks.geo.json
          - skinId: guide
            skinData: res://net/easecation/codefuncore/skin/guide.png
          - skinId: vilrot
            skinData: res://net/easecation/codefuncore/skin/vilrot.png
          - skinId: fanghao
            skinData: res://net/easecation/codefuncore/skin/fanghao.png
          - skinId: junjie
            skinData: res://net/easecation/codefuncore/skin/junjie.png
          - skinId: youjun
            skinData: res://net/easecation/codefuncore/skin/youjun.png
          - skinId: yuxin
            skinData: res://net/easecation/codefuncore/skin/yuxin.png
          - skinId: guzhi
            skinData: res://net/easecation/codefuncore/skin/guzhi.png
          - skinId: lihefanmaiyuan
            skinData: res://net/easecation/codefuncore/skin/lihefanmaiyuan.png
          - skinId: fuhuaAlex
            skinData: res://net/easecation/codefuncore/skin/fuhuaAlex.png
          - skinId: fuhuaSteve
            skinData: res://net/easecation/codefuncore/skin/fuhuaSteve.png
          - skinId: mom_summer
            skinData: res://net/easecation/codefuncore/skin/mom_summer.png
          - skinId: shenjia_summer
            skinData: res://net/easecation/codefuncore/skin/shenjia_summer.png
          - skinId: yingyi_summer
            skinData: res://net/easecation/codefuncore/skin/yingyi_summer.png
          - skinId: guide_summer
            skinData: res://net/easecation/codefuncore/skin/guide_summer.png
          - skinId: littergirl_summer
            skinData: res://net/easecation/codefuncore/skin/littergirl_summer.png
          - skinId: liukang_summer
            skinData: res://net/easecation/codefuncore/skin/liukang_summer.png
          - skinId: mxsj
            skinData: res://net/easecation/codefuncore/skin/mxsj.png
            geometryName: geometry.mxsj
            geometryData: res://net/easecation/codefuncore/skin/mxsj.geo.json
          - skinId: fengmeng
            skinData: res://net/easecation/codefuncore/skin/fengmeng.png
          - skinId: lixin
            skinData: res://net/easecation/codefuncore/skin/lixin.png
          - skinId: mika
            skinData: res://net/easecation/codefuncore/skin/mika.png
          - skinId: ran
            skinData: res://net/easecation/codefuncore/skin/ran.png
          - skinId: shadow
            skinData: res://net/easecation/codefuncore/skin/shadow.png
          - skinId: mikablack
            skinData: res://net/easecation/codefuncore/skin/mikablack.png
          - skinId: panderpan
            skinData: res://net/easecation/codefuncore/skin/panderpan.png
          - skinId: candy
            skinData: res://net/easecation/codefuncore/skin/candy.png
          - skinId: xiuxiu
            skinData: res://net/easecation/codefuncore/skin/xiuxiu.png
          - skinId: shoupiaoyuan
            skinData: res://net/easecation/codefuncore/skin/shoupiaoyuan.png
          - skinId: jinianpin
            skinData: res://net/easecation/codefuncore/skin/jinianpin.png
          - skinId: yindaoyuan
            skinData: res://net/easecation/codefuncore/skin/yindaoyuan.png
          - skinId: shizhengyindaoyuan
            skinData: res://net/easecation/codefuncore/skin/shizhengyindaoyuan.png
          - skinId: efcdianyuan
            skinData: res://net/easecation/codefuncore/skin/efcdianyuan.png
          - skinId: yvdianwangzhan
            skinData: res://net/easecation/codefuncore/skin/yvdianwangzhan.png
          - skinId: architect
            skinData: res://net/easecation/codefuncore/skin/architect.png
          - skinId: designer
            skinData: res://net/easecation/codefuncore/skin/designer.png
        
        ```

    - 这里是主大厅可用的一批皮肤

      > MainLobbyPlugin/src/main/resources/skin/skin.yml
      >

        ```yaml
        skin:
          - skinId: lobby_sw_activity
            skinData: res://skin/lobby_sw_activity.png
            geometryName: geometry.lobby_sw_activity
            geometryData: res://skin/lobby_sw_activity.geo.json
            persona: true
          - skinId: newyearpy
            skinData: res://skin/newyearpy.png
            geometryName: geometry.newyearpy
            geometryData: res://skin/newyear.geo.json
            persona: true
        ```

5. **npc** (**`List`**): 包含多个**`ECNPCPrefab`**配置的列表，详见 [**NPC预制实体配置 (`ECNPCPrefab`)**](https://www.notion.so/NPC-ECNPCPrefab-7fae472d12d04f9da22d15985cf79f99?pvs=21)

## **NPC预制实体配置 (`ECNPCPrefab`)**

1. **npcTag** (**`string`**): 用于在代码中引用Container内的某一（多）个特定的NPC。

    ```yaml
    npcTag: "npc1"
    ```

2. **pos** (**`string`**): NPC的位置，格式为 `X:Y:Z:Yaw:Pitch`，同时也可以省略Yaw和Pitch `X:Y:Z`，表示yaw和pitch都为0。

    ```yaml
    pos: "100:64:200:90:0"
    pos: "100:64:200"
    ```

3. **posOffset** (**`string`**): 对NPC位置的偏移量，格式同**`pos`**。

    ```yaml
    posOffset: "0:1:0"
    ```

4. **posOverride** (**`string`**): 用于覆盖NPC的具体位置坐标，格式为`X:Y:Z:Yaw:Pitch`，使用 `~` 表示保留原始数值

    ```yaml
    posOverride: "~:64:~:90:45"
    posOverride: "~:64:~"
    ```

5. **skin** (**`string`**): 指定NPC的皮肤（只有在type为human时生效）

   皮肤需要先注册，参考[**skin** (**`List`**): 包含一系列NPC皮肤的列表。](https://www.notion.so/skin-List-NPC-8ccb6bd5e93f461494ec873508cce8fa?pvs=21)

    ```yaml
    skin: py
    ```

6. **animation** (**`string`**): 指定NPC播放的实体动画（只适用于type为human的类型）

   animation在推送给玩家的材质包中，通过xxxx.animation.json定义。

   但是应该播放一个循环动画，而不是一次性动画，这样才能始终显示。

    ```yaml
    # 以下列出一批目前可用的持续循环动画
    animation: animation.easecation.cheer1 #欢呼1（siren做的一个欢呼）
    animation: animation.easecation.cheer2 #欢呼2（siren做的另一个欢呼）
    animation: animation.easecation.sitting #坐下
    ```

7. **type** (**`string`**): 定义NPC的类型。

    ```yaml
    # 玩家实体的NPC，可以通过skin设置皮肤
    type: human
    skin: py #skin的皮肤可参考上方skin字段
    ```

    ```yaml
    # 客户端原生实体，需要通过id字段指定生物类型
    type: creature
    id: easecation:npc
    # easecation:npc 其实是ec的材质包中，新定义了一个和玩家实体一样的自定义实体
    # 并且预置了一批皮肤（但是这些皮肤贴图定已经死在了材质包中），需要通过skinId字段来设置
    skinId: 1
    ```

    ```yaml
    # 生成为EC的宠物，pet字段指定了生成哪种宠物（可以在全商品表里找到）
    type: pet
    pet: rabbitgirl
    ```

    ```yaml
    # 浮空字，只会显示一个浮空的名字，样式同玩家头顶名字，可以被穿墙看到
    type: text
    text: 你好呀
    ```

    ```yaml
    # 游戏入口头顶的名称，包含人数显示。实际使用时需要搭配 game-billboard 的hook使用，才能正确刷新人数。
    type: billboard
    # 始终朝向相机（默认为true）设置为false后，变为正常的朝向
    billboard_face_camera: true
    # 黑色边框的宽度（16=实际1格方块）
    billboard_width: 40
    # 显示的游戏名称，通过skinId来控制
    skinId: 0
    ```

    ```yaml
    # 无任何实体（一般用于只需要hook的场景，比如在某坐标产生 粒子、音效）
    type: empty
    ```

8. **skinId** (**`int`**): 定义NPC使用的皮肤ID。

   实际多用于自定义实体（creature）类型的NPC，通过在资源包中定义如何根据这个数值来实际渲染、动画等。

    ```yaml
    # 当type为creatrue，id为easecation:npc时，预先注册了一系列的预置皮肤。
    skinId: 1
    # 当然还有一些其他的自定义实体，页使用了这个数值，来控制显示的皮肤，例如游戏头顶的实时人数显示，不同的id表示不同的小游戏名称。
    ```

9. **scale** (**`float`**): 定义NPC的缩放比例，默认为1。

    ```yaml
    scale: 1.5
    ```

10. **width** (**`float`**): 定义NPC的碰撞箱宽度（影响玩家点击NPC的有效区域）

    可设置为0来让玩家点不到NPC

    ```yaml
    width: 0.6
    ```

11. **height** (**`float`**): 定义NPC的高度（影响玩家点击NPC的有效区域）

    可设置为0来让玩家点不到NPC

    ```yaml
    height: 1.8
    ```

12. **name** (**`string`**): NPC显示的名称。

    ```yaml
    name: "NPC名称"
    ```

13. **nameTagVisible** (**`bool`**): 是否显示NPC的名称标签。

    ```yaml
    nameTagVisible: true
    ```

14. **scoreTag** (**`string`**): NPC的分数标签（其实也是个nameTag，但是在名字下方一行，并且在距离远时自动隐藏）

    ```yaml
    scoreTag: "score:100"
    ```

15. **variant** (**`int`**): 实体的变体编号

    实际多用于自定义实体（creature）类型的NPC，通过在资源包中定义如何根据这个数值来进行实际渲染、控制动画等。具体需要涉及到addons中的渲染控制器、动画控制器等。

    ```yaml
    variant: 2
    ```

16. **markVariant** (**`int`**): 实体的另一个变体编号

    同variant

    ```yaml
    markVariant: 2
    ```

17. **dancing** (**`bool`**): 是否使NPC跳舞（经过试验，发现此属性无效）

    ```yaml
    dancing: true
    ```

18. **sitting** (**`bool`**): 是否使NPC坐下（经过试验，发现此属性无效）

    ```yaml
    sitting: true
    ```

19. **sneaking** (**`bool`**): 是否使NPC潜行（一般来说只对human类型的NPC生效）

    ```yaml
    sneaking: true
    ```

20. **light** (**`int`**): NPC发出的光亮强度（通过在NPC位置放置了一个光源方块实现）

    ```yaml
    light: 10 #范围0～15
    ```

21. **dialogue** (**`object`**): 定义NPC的对话内容的配置部分。
22. **hook** (**`List`**): 定义NPC的行为钩子的列表。详见：[**NPCHook配置**](https://www.notion.so/NPCHook-3db02e171cd14272ac00b06d7d3d9577?pvs=21)

    ```yaml
    hook:
    	- lookat # 一个预置的简单的看向玩家的hook
    	- type: lookat # 可自定义距离的看向玩家
    		distance: 20
    	- type: touch # 玩家点击NPC后进行的操作
    		callback:
    			- type: XXX # 这边是PlayerAction，而不是hook了，虽然都是type，但是本质上是两套东西
      - type: touch.exchange
    		exchange: 
    ```

23. **canSeeRegion** (**`string`**): 定义玩家所处什么区域时能看到NPC，格式为 `X1:Y1:Z1:X2:Y2:Z2`。

    ```yaml
    canSeeRegion: "0:0:0:10:10:10"
    ```

24. **extraCanSee** (**`List`**/**`string`**): 定义NPC能被玩家看到的条件，内容为[ECCondtion 表达式](https://www.notion.so/ECCondtion-ccd80f144cf24260aa903cfd1723aca4?pvs=21)

    ```yaml
    # 在玩家的 Merchandise 符合 activity.xxxx > 0 时，NPC才可见
    extraCanSee: "{activity.xxxx > 0}"
    # 在当前时间大于 2024-01-01 00:00:00 时，NPC可见（这个时间戳为UNIX时间戳到现在的秒数，可网上搜索“时间戳”，来在线转换）
    extraCanSee: "%time > 1704038400"
    ```

25. **viewDistance** (**`double`**): 定义NPC可被玩家看到的距离（防止渲染给玩家过多的实体导致客户端性能问题）。

    ```yaml
    viewDistance: 50.0
    ```

26. **ornaments** (**`List`**): 定义NPC的装饰物（4D装扮）列表。（注：只支持human类型的NPC）

    ```yaml
    ornaments:
    	- head.liwu
      - body.tangguo
    ```


## **NPCHook配置**

NPCHook用于定义NPC的特定行为和与玩家的交互。以下是一些常见的钩子类型及其配置：

1. **lookat**: NPC主动看向玩家的行为。可以配置一个可选的距离参数，以限制触发距离。

    ```yaml
    type: lookat
    distance: 20 # 可选，单位为方块
    ```

2. **touch**: 当玩家接触NPC时触发的行为。它可以配置一系列的回调操作（PlayerAction）。

    ```yaml
    type: touch
    callback:
      - type: XXX # 这里是PlayerAction的类型
    ```

3. **touch.exchange** / **exchange**: 玩家点击NPC时，触发exchange：[Exchange 兑换](https://www.notion.so/Exchange-a18a956d95d4412c948de6cf7d8ec1fc?pvs=21)

    ```yaml
    type: touch.exchange
    exchange: # 交换的具体配置
    ```

4. **animation**: 控制NPC随机播放实体动画

    ```yaml
    type: animation
    # animation字段可以是一个string
    animation: animation.easecation.look_around
    # animation字段还可以时一个List，表示从这几个动画中随机播放
    animation:
    	- animation.easecation.look_around
    	- animation.easecation.hey
    duration: 5000 # 动画的间隔时间（毫秒）
    ```

    ```yaml
    # 以下列出一批目前可用的动画
    animation.easecation.hey #招手
    animation.easecation.cheer #欢呼（这个是最早的一个欢呼）
    animation.easecation.cheer1 #欢呼1（siren做的一个欢呼）
    animation.easecation.cheer2 #欢呼2（siren做的另一个欢呼）
    animation.easecation.sitting #坐下
    animation.easecation.look_around #间歇性、若无其事地看向周围
    ```

5. **sound:** 控制NPC随机播放声音。可以包括声音名称和持续时间。

    ```yaml
    type: sound
    # 声音列表
    sound: 
    	- "sound1"
    	- "sound2"
    duration: 3000 # 声音的间隔时间（毫秒）
    ```

6. **touch.sound**: 玩家点击NPC时播放声音，一般用于NPC“啊哈”的叫声。

    ```yaml
    type: touch.sound
    sound: 
    	- "sound1"
    	- "sound2"
    ```

7. **touch.particle**: 玩家点击NPC时产生粒子效果的配置。

    ```yaml
    type: touch.particle
    # particle字段可以是一个string，也可以是一个List，表示点击NPC时同时生成多个粒子
    particle: xxxx
    ```

8. **touch.particle.mobspawn:** 一个预置的点击NPC时生成mobspawn粒子的hook

    ```yaml
    type: touch.particle.mobspawn
    ```

9. **dialogue**: 定义NPC与玩家交谈时的对话及相关配置。

    ```yaml
    type: dialogue
    key: xxxx #可以直接复用在外层注册的dialogue
    condition: "{activity.xxx} == 0" #使用condition判断dialogue是否启用（可选）
    ```

   NPC对话中可以用param来嵌入任意ECCondition的执行结果

    ```yaml
    type: dialogue
    # 定义自定义参数
    param:
    	# 在这里定义文本替换的key，下面的ECCondition为计算后的替换文本
    	# 注意下面文本的引号（"未参加"左右的引号）为ECCondition的字符串常量，如果使用YAML单行字符串语法的话需要转义，建议使用下面的多行语法
    	point: |
    		{activity.xxx.point} == 0 ? "未参加" : {activity.xxx.point} + "分"
    # 对话内容
    # 注意这里{point}为TranslateMessage中的文本替换key，不要和ECCondition搞混了哦
    dialogue: "玩家当前分数：{point}"
    ```

    - 老版本的基本NPC对话（dialogue）语法，已折叠，请使用下面的新版本语法

        ```yaml
        type: dialogue
        # 触发对话的条件判断
        condition: "{activity.xxx} > 0"
        # 对话内容
        dialogue: 对话内容
        button:
        	- buttonName: 按钮1
        		condition: "{activity.xxx} > 0" #按钮也可以设置condition，从而控制按钮是否显示
        		forceCloseOnClick: true #点击按钮后是否关闭对话弹窗。一般除了继续对话的情况，其他都需要设为true
        		handler:
        			- type: dialogue #继续对话
        			  # 下方就是dialoguehook一样的内容了
        			- type: action #触发PlayerAction
        				callback:
        					- type: XXX #这个是触发到了PlayerAction，并不是Hook，不要搞混哦
        						xxxx: xxxxx #PlayerAction的相关配置
        			- type: random
        				handler:
        					- weight: 10 #随机权重
        						handler:
        							type: XXXX #同上，都是handler了
        					- weight: 20
        						handler:
        							type: XXXX
        		
        # 开始对话时，NPC播放动画，玩家可以在对话弹窗左侧看到NPC的动画
        animation: animation.easecation.hey
        # 开始对话时，播放音效
        sound: sound.ec.hohoho
        # 对话弹窗左侧的NPC模型的放大倍率，默认1.75
        portraitScale: 1.75
        # 对话弹窗左侧的NPC模型的位置平移，是一个List（元素数必须为3），默认为[0, 0, 0]
        profileOffset: [0, 0, 0]
        
        ```


    ```yaml
    type: dialogue
    # 触发对话的条件判断
    condition: "{activity.xxx} > 0"
    # 对话内容
    dialogue: 对话内容
    button:
    	- buttonName: 按钮1
    		condition: "{activity.xxx} > 0" # 按钮也可以设置condition，从而控制按钮是否显示
    #		forceCloseOnClick: true # 不再需要使用forceCloseOnClick来关闭对话框
    #		handler: # 老版本的配置handler的语法仍然有效，但不再建议使用
    			# 和老版本语法一样
    		continue: # 继续对话，这里等于老版本 type: dialogue 的缩写
    			# 下方就是dialoguehook一样的内容了
    		callback: # 触发PlayerAction，这里等于老版本 type: action 的缩写
    			- type: XXX #这个是触发到了PlayerAction，并不是Hook，不要搞混哦
    				xxxx: xxxxx #PlayerAction的相关配置
    		action: # 同样等于老版本 type: action 的缩写，不过支持更多配置选项
    			callback: # 同上
    			condition: # 触发条件
    			delay: # 延迟执行action，以tick为单位，1秒等于20tick
    		random: # 这里等于老版本 type: random 的缩写
    			handler:
    				- weight: 10 #随机权重
    					handler:
    						type: XXXX #同上，都是handler了
    				- weight: 20
    					handler:
    						type: XXXX
    			
    # 开始对话时，NPC播放动画，玩家可以在对话弹窗左侧看到NPC的动画
    animation: animation.easecation.hey
    # 开始对话时，播放音效
    sound: sound.ec.hohoho
    # 对话弹窗左侧的NPC模型的放大倍率，默认1.75
    portraitScale: 1.75
    # 对话弹窗左侧的NPC模型的位置平移，是一个List（元素数必须为3），默认为[0, 0, 0]
    profileOffset: [0, 0, 0]
    
    ```

10. **game**: 用于游戏相关的NPC行为配置。

    ```yaml
    type: game
    name: "$$game.name.mm$$"
    # 是否禁用名字刷新（默认false），如果禁用，则下方获取人数相关的设置将无意义
    disableNameTag: false
    
    # 获取人数信息的方式：以下3个，一般不共存
    
    # 从GameCenter系统获取注册的一级或二级游戏内的所有游玩人数
    gameCenterType: mm
    # 获取指定Stage的人数
    stageTypes:
    	- "mm"
    	- "color"
    # 获取指定Lobby的人数
    lobbyTypes:
    	- "parkourugc"
    
    # 点击NPC后触发什么
    joinLobby: "mw" #进入大厅
    joinStage: "mw" #进入小游戏房间
    openGameCenter: "mw" #打开小游戏中心的二级UI
    teleport: "0:60:0" #点击后传送到同一世界的另一坐标
    ```

11. **game-list-text**: 显示详细游戏列表的浮空字（hook做的只是设置NameTag）。用于包含一堆子游戏的NPC，玩家接近时会显示对应GameCenter二级分类中的所有子游戏的名称。

    ```yaml
    type: game-list-text
    gameCenterType: bedwars
    ```

12. **game-billboard**: NPC头顶在线人数相关的人数刷新hook。需要搭配billboard使用。

    ```yaml
    type: game-billboard
    gameCenterType: mw
    # 也可以单独设定详细的游戏类型列表
    stageTypes:
      - mw
    	- mw-duel
    	- mw-match
    lobbyTypes:
    	- mw
    ```

13. **move**: 控制NPC移动行为的配置。

    为了节省性能，这个hook并没有使用寻路机制，也没有计算碰撞箱，而是简单地在给定的坐标之间进行差值移动。

    注意，因为不计算碰撞箱，所以当需要上坡时，需要进行锯齿状选点，不然会沿着斜线往上飞

    ```yaml
    type: move
    # 移动速度（可选）默认0.1（玩家正常走路的速度）
    speed: 0.1
    # 是否循环（可选）默认false
    loop: true
    # 最大旋转速度每tick（可选）如果NPC转弯过于生硬，可以设置的很小，比如1，这样能平滑转弯
    maxRotationSpeed: 180
    # 是否自动生成反向路径（可选）默认false（比如一个NPC沿着一条路径来回走，设置为true后，就可以只选一遍路径点，然后会自动沿着这条路径来回走
    insertReverse: true
    # 路径点，是一个坐标List
    points:
    	- "0:60:0"
    	- "5:60:10"
    	- to: "10:60:10"
    		duration: 1000 #可以手动规定一段路径的用时（默认则是根据speed和路径长度自动计算的）
    	- from: "0:60:0" # 当手动规定form时，NPC会被瞬移到form的坐标然后往to运动
    		to: "5:60:10"
    		duration: 1000
    ```

14. **touch.condition**: 根据条件表达式触发hook。

    该hook提供多种条件判断模式，支持if-else基础判断、when-case多条件判断、always无条件执行以及callback快捷调用等功能。可通过嵌套组合实现复杂的条件逻辑。

    特点：

    - 支持ECCondition表达式（如`{activity.test}`）
    - 支持多层嵌套条件判断
    - 提供多种执行块（then/else/always/callback）满足不同场景需求
    - 可与PlayerAction和其他ECNPCHook无缝结合

    ```yaml
    # If Expression
    # 仅当条件为真时执行then快，否则执行else块
    type: touch.condition
    if: "{activity.test} == 1"
    then:
      - type: dialogue
        dialogue: TEST 1
    else:
      - type: dialogue
        dialogue: TEST 2
    ```

    ```yaml
    # When Expression
    # 多个条件从上往下顺序判断，直到有一个条件为真，或者没有条件为真时执行默认条件
    type: touch.condition
    when:
      - case: "{activity.test} == 0"
        then:
          - type: dialogue
            dialogue: TEST 1
      - case: "{activity.test} == 1"
        then:
          - type: dialogue
            dialogue: TEST 2
      - default:
          - type: dialogue
            dialogue: TEST 3
    ```

    ```yaml
    # Always Expression
    # 无论条件都会执行always块，调用ECNPCHook，用于结合Nested Expression使用
    type: touch.condition
    always:
      - type: dialogue
        dialogue: TEST 1
    ```

    ```yaml
    # Callback Expression
    # 无论条件都会执行callback块，用于快捷调用PlayerAction，而不需要嵌入到调用ECNPCHook里，用于结合Nested Expression使用
    type: touch.condition
    callback:
      - type: message
        text: TEST 1
    ```

    ```yaml
    # Nested Expression
    # 嵌套表达式，当任何填入回调Hook列表的地方（例如then或else块中），出现新的条件判断时（yaml类型为object而不为list），解析为嵌套表达式
    type: touch.condition
    if: "{activity.test1} == 1"
    then:
      if: "{activity.test2} == 1"
      then:
        - type: dialogue
          dialogue: TEST 1
      else:
        if: "{activity.test3} == 1"
        then:
          callback:
            - type: message
              text: TEST 2
      always:
        - type: dialogue
          dialogue: TEST 3
    else:
      when:
        - case: "{activity.test3} == 0"
          then:
            - type: dialogue
              dialogue: TEST 4
        - case: "{activity.test3} == 1"
          then:
            - type: dialogue
              dialogue: TEST 5
    always:
      - type: dialogue
        dialogue: TEST 6
    ```


## PlayerAction配置（`PlayerActionConfig`）

```yaml
type: dialogue
dialugue: 对话内容
button:
	- buttonName: 按钮1
		handler:
			- type: action #触发PlayerAction
				callback:
					- type: lock #这个是触发到了PlayerAction，并不是Hook，不要搞混哦
						xxxx: xxxxx #PlayerAction的相关配置
```

> 以下文档由AI生成，可能有不正确的地方！
>
1. **custom**: 自定义 action，允许开发者定义自己的 action 类型。

    ```yaml
    type: custom
    id: # 自定义类型
    args:
      # 自定义参数
    ```

2. **message**: 向玩家发送一条消息。

    ```yaml
    type: message
    text: # 消息内容
    ```

3. **title**: 向玩家显示一个标题和副标题。

    ```yaml
    type: title
    title: # 标题
    sub: # 副标题
    ```

4. **dialogue**: 向玩家显示一个NPC对话框。

    ```yaml
    type: dialogue
    # npc标签用于决定和哪一个npc进行对话，如果不提供npcTag会尝试和当前正在对话的npc继续对话，如果没有找到npc则会失败
    npcTag: # npc标签（可选）
    # 其他部分和NpcDialogueHook相同例如：
    key: xxxx #可以直接复用在外层注册的dialogue
    condition: "{activity.xxx} == 0" #使用condition判断dialogue是否启用（可选）
    ```

5. **form**: 向玩家显示一个表单。

    ```yaml
    type: form
    title: # 表单标题
    text: # 表单内容
    buttons:
      - # 按钮1
      - # 按钮2
    ```

6. **form.lottery**: 显示一个抽奖表单。

    ```yaml
    type: form.lottery
    lottery: # 抽奖类型
    ```

7. **form.addition-ticket**: 显示一个附加票券表单。

    ```yaml
    type: form.addition-ticket
    ```

8. **form.preview**: 显示一个预览表单。

    ```yaml
    type: form.preview
    category: # 预览类别
    ```

9. **form.preview.ornament**: 显示一个装饰品预览表单。

    ```yaml
    type: form.preview.ornament
    category: # 装饰品类别
    ```

10. **form.cdkey**: 显示一个 cdkey 表单。

    ```yaml
    type: form.cdkey
    ```

11. **form.player-service**: 显示一个玩家服务表单。

    ```yaml
    type: form.player-service
    ```

12. **form.mail**: 显示一个邮件表单。

    ```yaml
    type: form.mail
    ```

13. **form.sign-in**: 显示一个签到表单。

    ```yaml
    type: form.sign-in
    ```

14. **form.homeland**: 显示一个家园表单。

    ```yaml
    type: form.homeland
    ```

15. **ui.vip**: 显示 vip ui。

    ```yaml
    type: ui.vip
    ```

16. **merchandise.set**: 设置玩家的商品。

    ```yaml
    type: merchandise.set
    merchandise: # 商品配置
    ```

17. **merchandise.add**: 向玩家添加商品。

    ```yaml
    type: merchandise.add
    merchandise: # 商品配置
    ```

18. **merchandise.use**: 使用玩家的商品。

    ```yaml
    type: merchandise.use
    merchandise: # 商品配置
    ```

19. **globalkv.set** / **gkv.set**: 设置全局KV存储的值。全局KV是全服共享的整数键值对，存储在Redis中。

    ```yaml
    type: globalkv.set
    key: system.maintenance.mode # 全局KV的键名
    value: 1 # 要设置的整数值
    ```

20. **globalkv.add** / **gkv.add**: 增加全局KV存储的值（原子操作）。用于累加计数器等场景。

    ```yaml
    type: globalkv.add
    key: event.halloween.total-souls # 全局KV的键名
    delta: 10 # 增加的数值（可以是负数）
    ```

21. **gift**: 向玩家发送礼物。

    ```yaml
    type: gift
    gift:
      # 礼物配置
    ```

22. **record**: 记录玩家的事件，需要开发注册新的埋点。

    ```yaml
    type: record
    event: # 事件名称
    metadata: # 元数据
    rawdata: # 原始数据
    ```

23. **exchange**: 执行兑换操作。

    ```yaml
    type: exchange
    exchange: # 兑换配置
    gainmodui:
      title: # 标题
      closecallback:
        - # 回调配置
    ```

24. **form.exchange**: 显示一个兑换表单。

    ```yaml
    type: form.exchange
    title: # 标题
    content: # 内容
    exchanges:
      - # 兑换1
      - # 兑换2
    logexchange: # 是否记录兑换
    wallet:
      - # 钱包加载项
    ```

25. **firework**: 播放烟花效果。

    ```yaml
    type: firework
    lifetime: # 持续时间
    ```

26. **sound**: 播放音效。

    ```yaml
    type: sound
    sound: # 音效名称
    volume: # 音量
    pitch: # 音调mess
    ```

27. **effect**: 应用效果到玩家。

    ```yaml
    type: effect
    effect: # 效果名称
    visible: # 是否可见
    duration: # 持续时间
    amplifier: # 效果强度
    color:
      - # 红色
      - # 绿色
      - # 蓝色
    ```

28. **kick**: 踢出玩家。

    ```yaml
    type: kick
    reason: # 踢出原因
    ```

29. **mission**: 更新玩家的任务进度。

    ```yaml
    type: mission
    mission: # 任务名称
    process: # 进度
    ```

30. **tree.add**: 增加玩家的树进度。

    ```yaml
    type: tree.add
    add: # 增加量
    ```

31. **tree.milestone**: 触发树的里程碑。

    ```yaml
    type: tree.milestone
    ```

32. **tree.main**: 触发树的主任务。

    ```yaml
    type: tree.main
    ```

33. **teleport**: 传送玩家到指定位置。

    ```yaml
    type: teleport
    pos: # 位置
    ```

34. **workshop**: 打开个性工坊。

    ```yaml
    type: workshop
    tabid: # 标签id
    ```

35. **workshop.group**: 打开个性工坊的指定组。

    ```yaml
    type: workshop.group
    group: # 组名称
    ```

36. **netease.shop**: 打开网易商店。

    ```yaml
    type: netease.shop
    category: # 类别
    ```

37. **activity**: 触发活动。

    ```yaml
    type: activity
    id: # 活动id
    index: # 索引
    ```

38. **navigate**: 导航到指定位置。

    ```yaml
    type: navigate
    stop: # 是否停止导航
    target: # 目标位置
    sfx: # 音效路径
    ```

39. **modui.gain**: 显示获得物品的 ui。

    ```yaml
    type: modui.gain
    content: # 内容
    title: # 标题
    closecallback:
      - # 回调配置
    ```

40. **npc.touch**: 触发与 npc 的交互。

    ```yaml
    type: npc.touch
    npctag: # npc标签
    ```

41. **passcard**: 使用通行证。

    ```yaml
    type: passcard
    id: # 通行证id
    ```

42. **join-lobby**: 加入大厅。

    ```yaml
    type: join-lobby
    lobby: # 大厅id
    ```

43. **form.tasks**: 显示任务表单。

    ```yaml
    type: form.tasks
    title: # 标题
    content: # 内容
    tasks:
      - # 任务1
      - # 任务2
    ```

44. **join-stage**: 加入小游戏房间。

    ```yaml
    type: join-stage
    stage: # 小游戏房间id
    ```
