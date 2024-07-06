import styled from 'styled-components';

const App = () => {
  return (
    <Container className="container">
      <Item className="item1">
        Item 1<NestedItem className="nested-item1">Nested Item 1</NestedItem>
        <NestedItem className="nested-item2">Nested Item 2</NestedItem>
      </Item>
      <Item className="item2">Item 2</Item>
      <Item className="item3">
        Item 3<NestedItem className="nested-item3">Nested Item 3</NestedItem>
      </Item>
      <Item className="item4">Item 4</Item>
      <Item className="item5">Item 5</Item>
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
    width: 200px;
    top: 20px;
    left: 50px;
    background-color: red;
  }
  &.item2 {
    top: 80px;
    right: 30px;
    background-color: blue;
  }
  &.item3 {
    bottom: 40px;
    left: 70px;
    background-color: green;
  }
  &.item4 {
    bottom: 10px;
    right: 50px;
    background-color: black;
  }
  &.item5 {
    top: 150px;
    left: 200px;
    background-color: orange;
  }
`;

const NestedItem = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  color: white;

  &.nested-item1 {
    top: 10px;
    left: 10px;
    background-color: blue;
  }
  &.nested-item2 {
    bottom: 10px;
    right: 10px;
    background-color: purple;
  }
  &.nested-item3 {
    top: 5px;
    left: 5px;
    background-color: cyan;
  }
`;
