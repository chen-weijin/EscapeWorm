# 关卡配置文件说明

## 文件格式
所有关卡配置文件使用JSON格式，存储在 `config/levels/` 目录下。

## 配置文件命名规则
- 格式：`level{关卡编号}.json`
- 示例：`level1.json`, `level2.json`, `level3.json`

## 配置数据结构

### 根对象字段
- `levelId` (number, 必需): 关卡编号，从1开始
- `matrix` (object, 必需): 矩阵大小配置
- `escapePoints` (array, 必需): 逃脱点位置数组
- `worms` (array, 必需): 蠕虫配置数组

### matrix 对象
- `width` (number): 矩阵宽度（格子数）
- `height` (number): 矩阵高度（格子数）

### escapePoints 数组元素
- `x` (number): 逃脱点X坐标（矩阵边界，0到width-1或0到height-1）
- `y` (number): 逃脱点Y坐标

### worms 数组元素
- `id` (number): 蠕虫唯一标识
- `segments` (array): 蠕虫身体段坐标数组
  - 第一个元素为头部位置
  - 最后一个元素为尾部位置
  - 中间元素为身体段位置
- `direction` (string): 蠕虫朝向，可选值：
  - `"up"`: 向上
  - `"down"`: 向下
  - `"left"`: 向左
  - `"right"`: 向右
- `color` (string): 蠕虫颜色，使用十六进制颜色码（如 `"#FF5733"`）

## 坐标系统
- 坐标原点 (0, 0) 位于矩阵左上角
- X轴向右递增
- Y轴向下递增
- 所有坐标必须在矩阵范围内：`0 <= x < width`, `0 <= y < height`

## 逃脱点规则
- 逃脱点必须位于矩阵边界上
- 对于水平边界：`x = 0` 或 `x = width - 1`
- 对于垂直边界：`y = 0` 或 `y = height - 1`

## 蠕虫配置规则
1. 蠕虫的segments数组必须至少包含2个元素（头部和尾部）
2. segments中的坐标必须连续（相邻段必须相邻）
3. 蠕虫的direction必须与segments的排列方向一致
4. 不同蠕虫的segments不能重叠
5. 蠕虫不能超出矩阵范围

## 示例文件
- `level1.json`: 简单关卡，3条蠕虫，10x10矩阵
- `level2.json`: 中等难度，5条蠕虫，12x12矩阵
- `level3.json`: 困难关卡，7条蠕虫，15x15矩阵

## 验证
在加载关卡配置时，应该验证：
1. JSON格式正确性
2. 必需字段存在
3. 坐标范围有效性
4. 蠕虫segments连续性
5. 蠕虫之间无重叠
6. 逃脱点位置有效性

