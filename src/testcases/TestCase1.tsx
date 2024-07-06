import styled from 'styled-components';

const App = () => {
  return (
    <Container className="container">
      <Item className="item1">Item 1</Item>
      <Item className="item2">Item 2</Item>
      <Item className="item3">Item 3</Item>
      <Item className="item4">Item 4</Item>
    </Container>
  );
};

export default App;

const Container = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
  border: 1px solid #000;
`;

const Item = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  color: white;

  &.item1 {
    top: 0;
    left: 0;
    background-color: red;
  }
  &.item2 {
    top: 0;
    right: 0;
    background-color: blue;
  }
  &.item3 {
    bottom: 0;
    left: 0;
    background-color: green;
  }
  &.item4 {
    bottom: 0;
    right: 0;
    background-color: black;
  }
`;
