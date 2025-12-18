# 蠕虫逃脱微信小游戏

一个基于微信小游戏平台的益智游戏，玩家需要帮助所有蠕虫逃离矩阵。

## 项目结构

```
project/
├── game.js                 # 游戏主入口
├── game.json              # 游戏配置
├── config/
│   └── levels/            # 关卡配置文件夹
│       ├── level1.json
│       ├── level2.json
│       ├── level3.json
│       └── README.md
├── scenes/
│   ├── MenuScene.js       # 关卡选择场景
│   ├── GameScene.js       # 游戏主场景
│   └── ResultScene.js     # 结果展示场景
├── managers/
│   ├── LevelManager.js    # 关卡管理器
│   ├── AudioManager.js    # 音频管理器
│   ├── StorageManager.js  # 存储管理器
│   └── EffectManager.js   # 特效管理器
├── entities/
│   └── Worm.js            # 蠕虫实体类
└── utils/
    ├── PathFinder.js      # 路径查找算法
    └── CollisionDetector.js # 碰撞检测
```

## 游戏玩法

1. **目标**：让所有蠕虫成功逃离矩阵
2. **操作**：点击蠕虫身体的任意部位
3. **规则**：
   - 蠕虫只能向前移动（沿头部方向）
   - 如果蠕虫可以逃脱，会自动沿路径移动并消失
   - 如果蠕虫会撞到其他蠕虫身体，会高亮警示并复位，消耗一次失败机会
   - 每关有3次失败机会

## 快速开始

### 1. 环境准备

- 安装微信开发者工具
- 确保微信开发者工具版本支持小游戏开发

### 2. 导入项目

1. 打开微信开发者工具
2. 选择"小游戏"项目类型
3. 导入本项目目录
4. 填写AppID（可以使用测试号）

### 3. 运行项目

1. 点击"编译"按钮
2. 在模拟器中查看游戏效果

## 配置说明

### 关卡配置

关卡配置文件位于 `config/levels/` 目录，使用JSON格式。详细配置说明请参考 `config/levels/README.md`。

### 游戏配置

`game.json` 文件包含游戏的基本配置：
- `deviceOrientation`: 设备方向（portrait/landscape）
- `showStatusBar`: 是否显示状态栏
- `networkTimeout`: 网络超时配置

## 功能特性

- ✅ 关卡系统（可配置）
- ✅ 进度保存（本地存储）
- ✅ 音效系统（背景音乐和音效）
- ✅ 粒子特效（逃脱和胜利特效）
- ✅ 动画效果（移动、碰撞警示等）
- ✅ 屏幕适配（响应式布局）
- ✅ 碰撞检测
- ✅ 路径查找算法（BFS）

## 开发说明

### 添加新关卡

1. 在 `config/levels/` 目录下创建新的JSON文件，命名格式：`level{N}.json`
2. 按照配置格式填写关卡数据
3. 在 `LevelManager.js` 中更新 `getTotalLevels()` 方法返回正确的关卡总数

### 添加音效

1. 将音频文件放入 `audio/` 目录
2. 在 `AudioManager.js` 的 `getDefaultSoundPath()` 方法中添加音效路径映射

### 自定义样式

修改各个场景的 `render()` 方法中的绘制代码来改变视觉效果。

## 技术栈

- 微信小游戏API
- Canvas 2D渲染
- 本地存储API
- 音频API

## 注意事项

1. **音频资源**：需要准备以下音频文件（可选）：
   - `audio/click.mp3` - 点击音效
   - `audio/move.mp3` - 移动音效
   - `audio/collision.mp3` - 碰撞音效
   - `audio/escape.mp3` - 逃脱音效
   - `audio/victory.mp3` - 胜利音效
   - `audio/fail.mp3` - 失败音效
   - `audio/bgm.mp3` - 背景音乐

2. **文件路径**：确保关卡配置文件路径正确，微信小游戏中需要使用相对路径。

3. **性能优化**：在真机上测试性能，必要时优化渲染和算法。

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交Issue。

