# 蠕虫逃脱 - Cocos Creator 3.8

## 项目说明

这是一个从微信小游戏迁移到 Cocos Creator 3.8 的益智游戏。玩家需要点击蠕虫，让它们按照正确的顺序逃出网格区域。

## 项目结构

```
NewProject/
├── assets/
│   ├── prefab/                    # 预制体
│   ├── resources/                 # 资源文件夹
│   │   ├── images/               # 蠕虫图片资源
│   │   │   ├── worm_head.png     # 蠕虫头部
│   │   │   ├── worm_body.png     # 蠕虫身体
│   │   │   └── worm_tail.png     # 蠕虫尾部
│   │   └── levels/               # 关卡配置
│   │       ├── level1.json       # 第1关
│   │       ├── level2.json       # 第2关
│   │       └── level3.json       # 第3关
│   ├── scene/                    # 场景文件
│   │   ├── LaunchScene.scene     # 启动场景
│   │   └── GameScene.scene       # 游戏场景
│   └── scripts/                  # TypeScript 脚本
│       ├── Main.ts               # 主入口脚本
│       ├── GameController.ts     # 游戏控制器
│       ├── entities/
│       │   └── Worm.ts           # 蠕虫实体类
│       ├── managers/
│       │   ├── AudioManager.ts   # 音频管理器
│       │   ├── EffectManager.ts  # 特效管理器
│       │   ├── LevelManager.ts   # 关卡管理器
│       │   └── StorageManager.ts # 存储管理器
│       ├── ui/
│       │   ├── GameSceneController.ts  # 游戏场景控制器
│       │   ├── LaunchController.ts     # 启动控制器
│       │   ├── MenuController.ts       # 菜单控制器
│       │   └── ResultController.ts     # 结果控制器
│       └── utils/
│           ├── CollisionDetector.ts    # 碰撞检测
│           └── PathFinder.ts           # 路径查找
├── package.json
├── settings/
└── tsconfig.json
```

## 配置步骤

### 1. 打开项目

使用 Cocos Creator 3.8 打开 `NewProject` 文件夹。

### 2. 配置 LaunchScene（启动场景）

1. 打开 `assets/scene/LaunchScene.scene`
2. 选择 `Canvas` 节点
3. 在属性检查器中添加 `Main` 脚本组件
4. 将 `btnStart` 节点拖拽到 `Main` 组件的 `Start Button` 属性
5. 将 `btnSetting` 节点拖拽到 `Main` 组件的 `Setting Button` 属性

### 3. 配置 GameScene（游戏场景）

1. 打开 `assets/scene/GameScene.scene`
2. 在 `Canvas` 节点下创建一个空节点，命名为 `GameArea`
3. 给 `GameArea` 节点添加以下组件：
   - `UITransform`：设置合适的大小（如 600 x 800）
   - `Widget`：设置居中对齐
4. 选择 `Canvas` 节点
5. 添加 `GameSceneController` 脚本组件
6. 将 `GameArea` 节点拖拽到脚本的 `Game Area` 属性

### 4. 创建 UI 元素（可选）

在 GameScene 中创建以下 UI 元素：
- **关卡标签**：创建 Label 节点显示当前关卡
- **红心节点**：创建 3 个节点表示剩余生命
- **返回按钮**：用于返回主菜单
- **重新开始按钮**：用于重新开始当前关卡

### 5. 构建设置

1. 打开 `项目 -> 项目设置 -> 构建发布`
2. 设置启动场景为 `LaunchScene`
3. 选择目标平台（Web/原生/小游戏等）

## 游戏玩法

1. 点击蠕虫，它会沿着头部方向移动
2. 蠕虫需要离开网格区域才算逃脱成功
3. 如果蠕虫撞到其他蠕虫，会返回原位并失去一条生命
4. 所有蠕虫都逃脱后关卡通关
5. 失去所有生命后游戏失败

## 关卡配置格式

关卡配置文件是 JSON 格式，包含以下字段：

```json
{
  "levelId": 1,
  "matrix": {
    "width": 15,
    "height": 19
  },
  "escapePoints": [
    { "x": -1, "y": 3 }
  ],
  "worms": [
    {
      "id": 1,
      "segments": [
        { "x": 3, "y": 4 },
        { "x": 2, "y": 4 },
        { "x": 1, "y": 4 }
      ],
      "direction": "right",
      "color": "#FF5733"
    }
  ]
}
```

## 扩展说明

### 添加新关卡

1. 在 `assets/resources/levels/` 目录下创建新的 JSON 文件
2. 按照上述格式配置关卡数据
3. 在 `LevelManager.ts` 中更新 `getTotalLevels()` 返回值

### 添加音效

1. 将音效文件放入 `assets/resources/audio/` 目录
2. 在 `AudioManager.ts` 的 `getDefaultSoundPath()` 方法中配置路径

## 注意事项

- 确保使用 Cocos Creator 3.8.x 版本打开项目
- 首次打开项目时需要等待编译 TypeScript
- 如果遇到类型错误，检查 `tsconfig.json` 配置

