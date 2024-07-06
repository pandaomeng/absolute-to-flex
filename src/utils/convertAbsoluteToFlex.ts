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
    top: container.getBoundingClientRect().top,
    bottom: container.getBoundingClientRect().bottom,
    left: container.getBoundingClientRect().left,
    right: container.getBoundingClientRect().right,
  }

  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'flex-start';
  container.style.direction = 'column'
  container.innerHTML = '';

  // 处理行与行的间距
  let currentBottom = positionedContainer.top
  for (let flexRow of flexRows) {
    const rowDiv = document.createElement('div');
    rowDiv.style.display = 'flex';
    rowDiv.style.width = '100%';
    rowDiv.style.justifyContent = 'flex-start';
    rowDiv.style.marginTop = `${flexRow.top - currentBottom}px`
    rowDiv.style.height = `${flexRow.bottom - flexRow.top}px`
    currentBottom = flexRow.bottom

    // 处理行类内每个元素的间距
    let currentRight = positionedContainer.left
    let rowTop = flexRow.top
    for (let positionedElement of flexRow.elements) {
      let element = positionedElement.element
      element.style.position = 'static';
      element.style.display = 'inline-block';
      element.style.boxSizing = 'border-box';
      element.style.top = '';
      element.style.marginTop = `${positionedElement.top - rowTop}px`;
      element.style.right = '';
      element.style.bottom = '';
      element.style.left = '';
      element.style.marginLeft = `${positionedElement.left - currentRight}px`;
      currentRight = positionedElement.right
      rowDiv.appendChild(element);
    }

    container.appendChild(rowDiv);
  };
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
      elements: currentFlexRow,
      top: positionedElements[i].top,
      bottom: currentBottom,
      left: Math.min(...currentFlexRow.map(each => each.left)),
      right: Math.max(...currentFlexRow.map(each => each.right)),
    })
    i = j + 1
  } 
  return flexRows
}
