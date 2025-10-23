# 快速开始

::: warning 安全提示
本文档中所有涉及密码、密钥、Token 等敏感信息的配置项均已替换为占位符（如 `your_database_password`、`your_access_key` 等）。

**请务必：**
- 使用强密码替换所有占位符
- 不要将真实的密钥和密码提交到版本控制系统
- 生产环境配置文件应通过环境变量或密钥管理系统加载
- 定期轮换密钥和密码
:::

## 项目搭建
我们使用了Gradle对项目进行整理与管理。将项目从git中clone下来后，IDE应该会自动识别项目并进行导入。下面是几个注意事项：
> 1. 使用 `git Windows 2.17.0` clone项目的时候，只能输入一次账号密码，输错之后不会再提示重新输入，请到控制面板-用户账户-凭据管理器，修改对应Windows凭据

在git项目中，包含众多子项目，主要的核心子项目包括：
> 1. Nukkit（服务端核心） ```https://github.com/EaseCation/Nukkit.git```
> 2. Ghosty（玩家运动重放插件） ```https://github.com/EaseCation/Ghosty.git```
> 3. Actaeon（生物AI插件） ```https://github.com/EaseCation/Actaeon.git```
> 4. SynapseAPI（服务端代理插件API） ```https://github.com/EaseCation/SynapseAPI.git```
> 5. Nemisys（网络代理服务端） ```https://github.com/EaseCation/Nemisys.git```
> 6. Network（网络底层库） ```https://github.com/EaseCation/Network.git```

_请先使用 ```git submodule init``` 以及 ```git submodule update``` 导入所有子项目，可能需要额外配置Coding账号_

在Nukkit子项目中，也包含一个子项目：```https://github.com/Nukkit/Languages.git```
_需要首先cd到Nukkit目录下，再依次使用 ```git submodule init``` 以及 ```git submodule update``` 导入这个项目。_

**项目中，我们需要将本地jar包安装到本地库中：** _Gradle会自动处理依赖导入_
> 1. ```com.netease.mc:authlib``` - 网易中国版验证包 - ```lib/authlib-test.jar```
> 2. ```com.mcrmb:MCRMB``` - MCRMB 国际服充值接口 - ```CodeFunCore/lib/MCRMB-UTF8-1.0.9-SNAPSHOT.jar```

## 数据库结构搭建

**推荐方式：本地搭建**

数据库结构为 `database/ec2017.sql` 文件，直接使用 `MySQL 5.7+` 运行该脚本即可搭建完数据库结构。
导入相关配置数据 `database/configs.sql`

**数据库要求：**
- MySQL 5.7 或更高版本
- 建议创建独立的数据库用户，仅授予必要权限
- 生产环境请使用强密码

## 拉取地图文件
在根目录拉取```https://e.coding.net/easecation/EaseCationMaps/LevelDB.git```，重命名```LevelDB```为```maps```

## 编译与运行

为了方便本地测试与开发，Gradle在编译时会自动在本地目录下创建5个测试用工作目录并自动将编译完成的包放入其中：
- ```_api``` _API中央控制服务端_
- ```_proxy0``` _登录服网络代理_
- ```_proxy``` _游戏服网络代理_
- ```_login``` _登录服Nukkit服务端_
- ```_server``` _游戏服Nukkit服务端_

**架构说明：**
- **ECMaster**: 独立的API服务器，生成`ECMaster.jar`，包含完整依赖，可独立运行
- **CodeFunCore**: Nukkit插件版本，生成`CodeFunCore.jar`，部署到Nukkit服务器插件目录
- 两个模块共享相同的核心代码，但针对不同部署场景进行了依赖优化

### 本地开发运行

一般本地开发时，只需要运行 `_api`（API）、`_proxy`（Nemisys）、`_server`（Nukkit） 这三个项目即可正常进入游戏进行测试。

### 主要构建命令

**项目为多模块Gradle项目**，使用Gradle可对所有子模块进行编译和部署！

#### 通用构建命令
- ```./gradlew shadowJar``` - 编译所有模块并打包依赖（一般不直接使用这个命令）
- ```./gradlew copyShadowJar``` 编译和打包所有项目，并将编译产物复制到本地 _api, _proxy, _server 等工作目录，用于本地测试
- ```./gradlew copyToDeploy``` - 复制编译产物到deploy目录
- ```./gradlew copyToDeployTest``` - 复制编译产物到deploytest目录  
- ```./gradlew clean``` - 清理编译产物

#### ECMaster独立API服务器构建命令
- ```./gradlew :ECMaster:shadowJar``` - 构建ECMaster.jar独立API服务器
- ```./gradlew :ECMaster:copyShadowJar``` - 构建并复制ECMaster.jar到_api目录
- ```./gradlew :ECMaster:copyToDeployTest``` - 构建并复制ECMaster.jar到deploytest目录
- ```./gradlew :ECMaster:copyToDeploy``` - 构建并复制ECMaster.jar到deploy目录

使用Gradle构建时，所有核心任务都归类在 ```_ec``` 分组下，可以通过 ```./gradlew tasks --group="_ec"``` 查看所有可用的构建任务。

**构建示例：**
```
$ ./gradlew shadowJar
Configuration on demand is an incubating feature.
> Task :nukkit:shadowJar
> Task :Actaeon:shadowJar
> Task :BorderAPI:shadowJar
> Task :ECFireworks:shadowJar
> Task :AuthLibPackage:shadowJar
> Task :SynapseAPI:shadowJar
> Task :NoteBlockAPI:shadowJar
> Task :NuclearMusicPro:shadowJar
> Task :ECPet:shadowJar
> Task :CodeFunCore:shadowJar
> Task :nemisys:shadowJar
> Task :Ghosty:shadowJar
> Task :MagicGuns:shadowJar
... (更多模块编译信息)

BUILD SUCCESSFUL
```

## 插件资源配置
> #### 手动复制所有lib/nbs下的音乐nbs文件，到以下目录：
> #### _server/plugins/NuclearMusicPro/tracks ```大厅播放的红石音乐nbs文件```
> #### _server/plugins/ECColorBlindness/tracks ```色盲派对播放的红石音乐nbs文件```
>
> #### _login/worlds/login ```登录服大厅地图```: 请将 ```maps/login``` 文件夹复制到 ```_login/worlds``` 中。
> #### 除此之外，需要将文件 `lib/GeoLite2-Country.mmdb` 复制至 `_server` 以及 `_login` 目录下，用以根据玩家IP查询玩家地址。

## 配置文件编写
共有如下配置文件需要修改：
### _api/server.properties ```API中央控制服务端 主配置文件```
```
#Properties Config file
server-ip=0.0.0.0
server-port=1099
database-server=localhost
database-port=3306
database-user=your_database_user
database-password=your_database_password
http=on
http-port=8080
client=off
client-server=0.0.0.0
client-port=1099
log-player-count=off
log-player-event=off
```

### _proxy/server.properties ```主代理服 基础配置```
```
#Properties Config file
motd=Nemisys Proxy: Minecraft PE Server
synapse-ip=0.0.0.0
synapse-port=10305
password=your_synapse_password
lang=eng
async-workers=auto
enable-profiling=off
profile-report-trigger=20
max-players=2000
dynamic-player-count=off
enable-query=on
enable-rcon=off
rcon.password=your_rcon_password
debug=0
plus-one-max-count=off
enable-synapse-client=off
server-ip=0.0.0.0
server-port=19132
sub-motd=Powered by Nemisys
enable-upnp=off
bug-report=on
xbox-auth=on
enable-jmx-monitoring=off
enable-network-encryption=on
network-compression-level=7
packet-recorder-capability=off
```
### _proxy/plugins/ECNemisys/config.yml ```主代理服 插件配置```
```
api-server: 127.0.0.1
database-password: your_database_password
database-server: localhost
database-user: your_database_user
netease: true
player-login-log: true
alilog:
  endpoint: your-region.log.aliyuncs.com
  accessId: your_aliyun_access_id
  accessKey: your_aliyun_access_key
  project: your_project_name
```

### _server/nukkit.yml ``` Nukkit相关设置 ```
启动一次Nukkit，之后更改配置文件中的：
```
level-settings:
 #始终保持玩家Tick
 always-tick-players: true
```
更改后才能确保正常进入主服务端

### _server/server.properties ```主游戏服 基础配置```
```
#Properties Config file
motd=EaseCation
#玩家不通过该端口进入，设置为一个不被使用的端口即可
server-port=19134
server-ip=0.0.0.0
view-distance=6
white-list=off
announce-player-achievements=off
spawn-protection=3
max-players=2000
allow-flight=off
spawn-animals=off
spawn-mobs=off
gamemode=2
force-gamemode=off
hardcore=off
pvp=on
difficulty=1
generator-settings=
#默认地图设置为world，类型为超平坦
level-name=world
level-seed=
#默认地图设置为world，类型为超平坦
level-type=FLAT
enable-query=on
enable-rcon=off
rcon.password=your_rcon_password
auto-save=on
achievements=on
force-resources=off
bug-report=on
sub-motd=Powered by Nukkit
```

以下内容，请将```/deploytest```下所有文件夹（不包括根目录文件）全部复制到```_server/plugins```中，特别修改如下文件。
### _server/plugins/CodeFunCore/config.yml ```主游戏服 主插件配置```
```
china: true
restart: 120
restart-offset: 30
mapsPath: "../maps/"
api-server: 127.0.0.1:1099
database-server: "localhost"
database-user: "your_database_user"
database-password: "your_database_password"
netease: true
bot: false
order-test: true
stage-test: true
helper-broadcast: true
easechat: ws://127.0.0.1:6500
hack-antifly: false
hack-aimbot: false
hack-fastmove: true
hack-noclip: false
auto-hack: false
auto-hack-highjump: false
ignore-prism: false
always-send-confirm: false
http-url-broadcast: "https://your-domain.com/broadcast.json"
# 公告系统配置（可选，使用飞书多维表格）
announcement:
 spark-app-id: your_feishu_app_id
 spark-app-secret: your_feishu_app_secret
 spark-app-token: your_feishu_app_token
 table-id: your_table_id
redis.ip: "localhost"
notion-secret: "your_notion_secret"
oss:
 endpoint: oss-your-region.aliyuncs.com
 keyid: your_oss_access_key_id
 keysecret: your_oss_access_key_secret
 bucket-suffix: -test
rankmatcher:
 host: "ws://localhost:12310"
 arenas:
  bedwars-remake: 2
  buhc_nor: 2
alilog:
 endpoint: your-region.log.aliyuncs.com
 accessId: your_aliyun_access_id
 accessKey: your_aliyun_access_key
 project: your_project_name
netease-platforms:
 - "pe"
 - "pc"
```
> 若不开启登录服，以下配置可以忽略
### _login/server.properties ```登录服Nukkit服务端 基础配置```
```
#Properties Config file
#默认，玩家看不到此入口名称
motd=EaseCation
#选择一个不被占用的端口即可，玩家不从此入口进入
server-port=19130
server-ip=0.0.0.0
view-distance=4
white-list=off
announce-player-achievements=off
spawn-protection=0
max-players=2000
allow-flight=off
spawn-animals=on
spawn-mobs=on
gamemode=2
force-gamemode=off
hardcore=off
pvp=off
difficulty=0
generator-settings=
#登录服大厅目录（需要手动将登录服大厅地图命名为login放入_login/worlds）
level-name=login
level-seed=
level-type=FLAT
enable-query=on
enable-rcon=off
rcon.password=your_rcon_password
auto-save=off
achievements=off
force-resources=off
bug-report=on
sub-motd=Powered by Nukkit
```
### _login/plugins/SynapseAPI/config.yml ```登录服Nukkit Synapse代理配置```
```
#Synapse API for Nukkit: config
disable-rak: false
enable: true
autoCompress: true #启动自动压缩（必须开启）

entries:
  - server-ip: 127.0.0.1 #_proxy0/server.properties中的登录服代理服务端地址
    server-port: 10304 #_proxy0/server.properties中的登录服代理服务端端口
    isMainServer: true #设置为true，默认首选服务器
    password: your_synapse_password #_proxy0/server.properties中的登录服代理服务端密码（需与代理服一致）
    description: Synapse Nukkit Server #本服务器介绍，随便写
    autoConnect: true #设置为true，自动连接
```
### _login/plugins/StrangeLoginServer/config.yml ```登录服Nukkit 登录插件配置```
```
api-server: "127.0.0.1" #_api/server.properties中的RMI API服务端地址与端口
database-server: "localhost:3306" #数据库地址
database-user: "your_database_user" #数据库用户名
database-password: "your_database_password" #数据库密码
netease: false #是否为中国版模式，开启后将禁止国际版登录
proxy1: your-server-ip:19133 #_proxy/server.properties中设置的主代理服务端的地址与端口，玩家在登录成功后将跳转到该地址（注意！这个地址是用于客户端原生跨服跳转的地址，必须为服务端真实IP，不可为0.0.0.0或127.0.0.1等）
proxy2: your-server-ip-2:19133 #（可选，如果有多个游戏代理服务端，将随机跳转）
```
### _login/plugins/StrangeLoginServer/config.yml ```登录服完整配置示例```
```
china: true #是否为中国区模式
netease: true #是否启用网易中国版验证
api-server: "127.0.0.1:1099" #API服务端RMI地址
database-server: "localhost:3306" #数据库地址
database-user: "your_database_user" #数据库用户名
database-password: "your_database_password" #数据库密码

# 日志系统配置（可选）
alilog:
  endpoint: your-region.log.aliyuncs.com
  accessId: "your_aliyun_access_id"
  accessKey: "your_aliyun_access_key"
  project: "your_project_name"

# 游戏代理服务器列表（玩家登录成功后随机跳转）
proxy1: "your-server-ip-1:19133"
proxy2: "your-server-ip-2:19133"
proxy3: "your-server-ip-3:19133"
# ... 可配置更多代理服务器
```

## 资源包配置
项目包含丰富的资源包系统，主要资源包存放在 `_server/plugins/CodeFunCore/` 目录下：

### 核心资源包
- `ec_ui.zip` - 主要UI界面资源包
- `ec_nk_ui_res.zip` / `ec_nk_ui_beh.zip` - Nukkit UI模组资源包和行为包
- `ec_base_shader.zip` - 基础着色器包
- `ec_item.zip` - 物品资源包

### 游戏模式专用资源包
- `ec_gun_res.zip` / `ec_gun_beh.zip` - 枪战模式资源包
- `ec_team_pulse_res.zip` / `ec_team_pulse_beh.zip` - 团队脉冲模式资源包
- `ec_ze.zip` - 僵尸逃脱模式资源包
- `ec_rl.zip` - 符文传说模式资源包

### 排位等级配置
`ranklevel/` 目录包含各游戏模式的排位等级配置：
- `bedwars.yml` - 起床战争排位配置
- `mw.yml` - 巨型围墙排位配置
- `mm.yml` - 谋杀之谜排位配置
- `buhc.yml` - 建筑超级硬核排位配置

### ModUI界面配置
`modui/` 目录包含网易版客户端的界面配置：
- `game_end.json` - 游戏结束界面
- `hud.json` - HUD界面配置
- `gift_get.json` - 礼品获取界面
- `passcard_ss1.json` - 通行证界面

### additional目录
`additional/` 目录存放额外的资源包，主要为第三方材质包和准星包，用于为玩家提供个性化选择。

## 开发环境运行与测试
请按照如下顺序依次运行服务端，标*号为必选项

_也可以自行编写start.sh、start.cmd以方便开服_
### 聊天服务器 - ```EaseChat```
```
cd ease_chat
cargo run -p ease_chat_nexus
```
### *API中央控制服务端 - ```ECMaster```
```
cd _api
java -jar ECMaster.jar
```
如果使用Windows系统运行，可能出现Title输出异常而导致刷屏的状况。遇到此情况请使用 `java -jar ECMaster.jar -disableTitle`

**注意**: 从架构变更后，独立API服务器使用`ECMaster.jar`，插件版本使用`CodeFunCore.jar`
### 登录服代理服务端 - ```Nemisys```
```
cd _proxy0
java -jar nemisys.jar
```
如果使用Windows系统运行，可能出现Title输出异常而导致刷屏的状况。遇到此情况请使用 `java -jar nemisys.jar disable-ansi`
### 登录服 - ```Nukkit```
```
cd _login
java -jar nukkit.jar
```
### *游戏服代理服务端 - ```Nemisys```
```
cd _proxy
java -jar nemisys.jar
```
如果使用Windows系统运行，可能出现Title输出异常而导致刷屏的状况。遇到此情况请使用 `java -jar nemisys.jar disable-ansi`
### *游戏服 - ```Nukkit```
```
cd _server
java -jar nukkit.jar
```
_所有服务端已开启，可使用MCPE客户端进入19132端口。_
若要通过国际版和MC Studio进服，请修改以下文件
```./_proxy/server.properties```: 新增```xbox-auth=off```
```./_proxy/plugins/ECNemisys/config.yml```: 新增```offline-mode: true```
