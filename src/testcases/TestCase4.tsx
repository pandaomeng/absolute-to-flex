import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  border: 1px solid #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Item = styled.div`
  position: absolute;
  top: 215px;
  width: 70px;
  height: 70px;
  background-color: ${({ color }) => color || 'gray'};
`;

const App = () => {
  const containerWidth = 500; // 父容器宽度
  const itemSize = 70; // 每个项目的宽度
  const itemCount = 5; // 项目数量
  const spaceBetween = (containerWidth - itemSize * itemCount) / (itemCount - 1); // 项目之间的间距

  const items = Array.from({ length: itemCount }).map((_, index) => {
    const leftPosition = index * (itemSize + spaceBetween);
    const color = ['red', 'blue', 'green', 'yellow', 'purple'][index];
    return (
      <Item key={index} style={{ left: `${leftPosition}px` }} color={color}>
        Item {index + 1}
      </Item>
    );
  });

  return <Container className="container">{items}</Container>;
};

export default App;
