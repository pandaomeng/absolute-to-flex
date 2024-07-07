# 目录
- [简介](#简介)
- [核心处理文件](#核心处理文件)
- [TodoList](#TodoList)
- [BUG](#BUG)
- [自动化修改源代码中的样式](#自动化修改源代码中的样式)

## 简介
将 absolute 布局转换为 flex 布局
在线地址：[http://absolute2flex.s3-website-us-east-1.amazonaws.com](http://absolute2flex.s3-website-us-east-1.amazonaws.com)
- /src/testcases 下存放测试用例，路由根据 testcases 下的页面自动生成

## 核心处理文件
这是该项目的核心处理文件，负责将绝对定位转换为 Flex 布局。
[核心处理文件 convertAbsoluteToFlex.ts](https://github.com/pandaomeng/absolute-to-flex/blob/master/src/utils/convertAbsoluteToFlex.ts)


## TodoList
- [ ] 判断一个区域内是否有重叠的 absolute，如果有的话，则无法转为 flex 布局
- [x] 将需要处理区域的所有元素都拆分到 flex row 中，要求每个 flex row 互不重叠
- [x] 行与行之间通过原有的 position 信息设置正确的 margin-top
- [x] 行内 通过他们原来的 position 信息为他们设置正确的 margin-left
- [x] 如果行内元素高低不齐，对他们做特殊处理
- [x] 递归处理 absolute 中的 absolute 元素
- [x] 处理 absolute 和非 absolute 元素并存的问题
- [ ] 如果一个 flex 中只有两个元素，并且他们在容器的两头，设置 justify-content 为 space-between

## BUG
- [ ] 转换为 flex 布局后，会有 1px 的偏移，优化 border 的处理 

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
