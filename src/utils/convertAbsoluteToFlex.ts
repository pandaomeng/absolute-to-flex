interface Position {
  top: number
  bottom: number
  left: number
  right: number
}

type PositionedElement = {
  element: HTMLElement
} & Position

type FlexRow = {
  elements: PositionedElement[]
} & Position

/**
 * 传入一个 targetContainer, 将这个 targetContainer 下的所有 absolute 元素转为 flex
 * @param targetContainer 
 * @returns 
 */
export const convertAbsoluteToFlex = (targetContainer: HTMLElement): boolean => {

  // 处理非绝对定位元素的文本内容
  wrapTextWithSpan(targetContainer);

  // 给定一个 targetContainer 找到这个 targetContainer 下所有的子元素，只考虑第一层子元素
  const allChildNodes: NodeListOf<ChildNode> = targetContainer.childNodes;

  const positionedElements = getPositionedElement(allChildNodes)
  // 递归处理
  for (let currentNode of allChildNodes) {
    if (currentNode instanceof HTMLElement) {
      
      // 如果 currentNode 下全是文本节点，停止递归
      const textNodes: Node[] = Array.from(currentNode.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
      if (textNodes.length === currentNode.childNodes.length) {
        continue
      }

      convertAbsoluteToFlex(currentNode)
    }
  }

  const flexRows: FlexRow[] = getFlexRows(positionedElements)
  
  combineFlexRows(targetContainer, flexRows)

  return true;
};

/**
 * 组装 flexRows
 * @param container 
 * @param flexRows 
 */
const combineFlexRows = (container: HTMLElement, flexRows: FlexRow[]) => {
  // 把每个 flexRows 里的元素都组装成一个 flex 的 div 并重新设置他们的 position 属性
  // Clear the container's content and recreate flex rows
  const positionedContainer: PositionedElement = {
    element: container,
    ...getInnerBoundingClientRect(container)
  }

  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'flex-start';
  container.innerHTML = '';

  // 处理行与行的间距
  let currentBottom = positionedContainer.top
  for (let flexRow of flexRows) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.width = '100%';
    rowDiv.style.marginTop = `${flexRow.top - currentBottom}px`
    rowDiv.style.height = `${flexRow.bottom - flexRow.top}px`
    // 设置每一行是 flex-start 还是 space-between 还是 space-around
    let elementNum = flexRow.elements.length
    let firstGapWidth = elementNum >= 2 ? flexRow.elements[1].left - flexRow.elements[0].right : 0
    let i = 1;
    for (; i < elementNum; i++) {
      if (flexRow.elements[i].left - flexRow.elements[i-1].right !== firstGapWidth) {
        rowDiv.style.justifyContent = 'flex-start';
        break
      }
    }
    if (i == elementNum) {
      if (flexRow.elements[0].left === positionedContainer.left && flexRow.elements[elementNum - 1].right === positionedContainer.right) {
        rowDiv.style.justifyContent = 'space-between';
      } else {
        rowDiv.style.justifyContent = 'space-around';
      }
    }


    currentBottom = flexRow.bottom

    // 处理行类内每个元素的间距
    let currentRight = positionedContainer.left
    let rowTop = flexRow.top
    for (let positionedElement of flexRow.elements) {
      let element = positionedElement.element
      element.style.position = 'static';
      element.style.boxSizing = 'border-box';
      element.style.top = '';
      element.style.marginTop = `${positionedElement.top - rowTop}px`;
      element.style.right = '';
      element.style.bottom = '';
      element.style.left = '';
      if (rowDiv.style.justifyContent === 'flex-start') {
        element.style.marginLeft = `${positionedElement.left - currentRight}px`;
      }
      currentRight = positionedElement.right
      rowDiv.appendChild(element);
    }

    container.appendChild(rowDiv);
  };
}

/**
 * 获取一个容器的内部矩形位置
 * @param element 
 * @returns 
 */
const getInnerBoundingClientRect = (element: HTMLElement) => {
  // 获取元素的外边缘位置
  const rect = element.getBoundingClientRect();

  // 获取元素的计算样式
  const computedStyle = window.getComputedStyle(element);

  // 获取边框的宽度
  const borderTopWidth = parseFloat(computedStyle.borderTopWidth);
  const borderRightWidth = parseFloat(computedStyle.borderRightWidth);
  const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth);
  const borderLeftWidth = parseFloat(computedStyle.borderLeftWidth);

  // // 获取内边距的宽度
  // const paddingTop = parseFloat(computedStyle.paddingTop);
  // const paddingRight = parseFloat(computedStyle.paddingRight);
  // const paddingBottom = parseFloat(computedStyle.paddingBottom);
  // const paddingLeft = parseFloat(computedStyle.paddingLeft);

  // 计算内边缘位置
  const innerRect = {
    top: rect.top + borderTopWidth,
    right: rect.right - borderRightWidth,
    bottom: rect.bottom - borderBottomWidth,
    left: rect.left + borderLeftWidth,
  };

  return innerRect;
}

/**
 * 将元素的文本内容包装在一个 span 元素中
 * @param element 
 */
const wrapTextWithSpan = (element: HTMLElement) => {
  const textNodes: Node[] = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);

  textNodes.forEach(textNode => {
    const span = document.createElement('span');
    span.innerText = textNode.textContent || '';
    element.replaceChild(span, textNode);
  });
};


/**
 * 过滤出所有的绝对定位的元素，并设置位置属性
 * @param allElements 
 * @returns 
 */
const getPositionedElement = (allElements: NodeListOf<ChildNode>) => {
  // 过滤出所有 HTMLElement
  const absoluteElements = Array.from(allElements).filter(element => {
    if (element instanceof HTMLElement) {
      return true;
    }
    return false
  }) as HTMLElement[];

   // 将需要转换的元素都存成 positionedElement 结构
   let positionedElements: PositionedElement[] = absoluteElements.map(element => ({
    element,
    top: element.getBoundingClientRect().top,
    bottom: element.getBoundingClientRect().bottom,
    left: element.getBoundingClientRect().left,
    right: element.getBoundingClientRect().right,
  }))

  return positionedElements
}

/**
 * 通过 top 和 bottom 属性对 elements 进行分组，一个分组为一个 flexRow
 * @param positionedElements 
 * @returns 
 */
const getFlexRows = (positionedElements: PositionedElement[]): FlexRow[] => {
  // 按照 top 排序，方便分组
  positionedElements = positionedElements.sort((a, b) => a.top - b.top)
  
  let flexRows: FlexRow[] = []
  let n = positionedElements.length
  let i = 0
  while(i < n) {
    let currentFlexRow = [positionedElements[i]]
    // let currentTop = positionedElements[i].top
    let currentBottom = positionedElements[i].bottom
    let j = i
    while (j + 1 < n && positionedElements[j + 1].top < currentBottom) {
      j += 1
      currentBottom = Math.max(currentBottom, positionedElements[j].bottom)
      currentFlexRow.push(positionedElements[j])
    }
    flexRows.push({
      // 每一行的 flexRows 内部对 left 作排序
      elements: currentFlexRow.sort((a, b) => a.left - b.left),
      top: positionedElements[i].top,
      bottom: currentBottom,
      left: Math.min(...currentFlexRow.map(each => each.left)),
      right: Math.max(...currentFlexRow.map(each => each.right)),
    })
    i = j + 1
  } 
  return flexRows
}
