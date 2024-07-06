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

export const convertAbsoluteToFlex = (): boolean => {
  // 找到容器中的所有元素
  const allElements: NodeListOf<HTMLElement> = document.querySelectorAll('.container *');

  // 修改原 container 的 display 为 flex
  const container: HTMLElement | null = document.querySelector('.container');
  if (!container) return false;

  const positionedElements = getPositionedElement(allElements)

  const flexRows: FlexRow[] = getFlexRows(positionedElements)
  
  combineFlexRows(container, flexRows)

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
 * 过滤出所有的绝对定位的元素，并设置位置属性
 * @param allElements 
 * @returns 
 */
const getPositionedElement = (allElements: NodeListOf<HTMLElement>) => {
  // 过滤出所有 absolute 定位的元素
  const absoluteElements = Array.from(allElements).filter(element => {
    const computedStyle = window.getComputedStyle(element);
    return computedStyle.position === 'absolute';
  });

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
