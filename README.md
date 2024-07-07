# 目录
- [简介](#简介)
- [核心处理文件](#核心处理文件)
- [算法实现逻辑](#算法实现逻辑)
- [TodoList](#TodoList)
- [BUG](#BUG)
- [自动化修改源代码中的样式](#自动化修改源代码中的样式)

## 简介
将 absolute 布局转换为 flex 布局
在线地址：[https://absolute2flex.xyz/](https://absolute2flex.xyz/)
- /src/testcases 下存放测试用例，路由根据 testcases 下的页面自动生成

## 核心处理文件
这是该项目的核心处理文件，负责将绝对定位转换为 Flex 布局。
[核心处理文件 convertAbsoluteToFlex.ts](https://github.com/pandaomeng/absolute-to-flex/blob/master/src/utils/convertAbsoluteToFlex.ts)

## 算法实现逻辑
对元素 container 内的所有 absolute 布局，转换为 flex 布局
1. 考虑 container 中的所有子元素，获得并记录他们的 top/bottom/left/right 信息，这些子元素记作 elements, 对 elements 基于 top 排序，遍历 elements，如果下一个 element 的 top > 当前 element 的 bottom, 则他们应该被分到一个 flex 的行中。
2. 对于每个 flex row 中的所有元素，基于 left 排序，确保他们水平方向的顺序准确
3. 分析 flex row 中元素的间距是否相等，如果相等则依据是否紧贴父容器设置 justify-content 为 space-between 或 space-around, 否则设置为 flex-start, 如果为 flex-start，同时要根据元素的 left 信息，计算出 margin-left
4. 移除原元素的 absolute 相关属性，包括 top/bottom/left/right 属性
5. 递归处理每个元素，对于每个元素依次执行步骤 1-4

## TodoList
- [x] 将需要处理区域的所有元素都拆分到 flex row 中，要求每个 flex row 互不重叠
- [x] 行与行之间通过原有的 position 信息设置正确的 margin-top
- [x] 行内 通过他们原来的 position 信息为他们设置正确的 margin-left
- [x] 如果行内元素高低不齐，对他们做特殊处理
- [x] 递归处理 absolute 中的 absolute 元素
- [x] 处理 absolute 和非 absolute 元素并存的问题
- [x] 如果一个 flex 中只有多个元素，并且他们在容器中的距离相同，设置 justify-content 为 space-between，或者 space-around
- [x] 元素排序结合 top、left 排序
- [ ] 判断一个区域内是否有重叠的 absolute，如果有的话，使用 z-index 处理
- [ ] 补充如何判断主轴还是交叉轴的逻辑
- [ ] 子元素宽度是否可以从固定值改为 flex 自适应模式 ?
- [ ] 判断是否使用 flex-shrink、flex-warp

## BUG
- [x] 转换为 flex 布局后，会有 1px 的偏移，优化 border 的处理 

## 自动化修改源代码中的样式
### 实现思路
在 convertAbsoluteToFlex 函数中改变元素样式的地方，导出需要改变元素的定位信息，比如 className 和需要改变的 css 属性，
例如: 
```
[{
  classNames: ['items', 'items-1'],
  styles: {
    display: 'inline-block',
    boxSizing: 'border-box',
    top: '',
    right: '',
    bottom: '',
    left: '',
  }
}]
```
然后通过脚本根据 classNames 等信息去找源码中对应的位置进行替换，实现自动修改。
