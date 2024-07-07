import './App.css';
import { Button, Col, List, Row, Space, Typography, message } from 'antd';
import { convertAbsoluteToFlex } from './utils/convertAbsoluteToFlex';
import { routes } from './router';
import { BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import React, { useState } from 'react';

// const menus = routes.map(route => ({
//   key: route.name,
//   label: route.name,
// }));

function App() {
  const [resetKey, setResetKey] = useState(0);
  const [isFlex, setIsFlex] = useState(false);

  const doConvert = () => {
    if (!isFlex) {
      const containerElement = document.querySelector('.container');
      if (!containerElement || !(containerElement instanceof HTMLElement)) {
        message.error('未找到需要转换的区域');
        return;
      }
      convertAbsoluteToFlex(containerElement);
      setIsFlex(true);
      message.success('成功转为 Flex 布局');
    }
  };

  const doReset = () => {
    // 通过改变 key 强制重新加载当前路由组件
    setResetKey(prevKey => prevKey + 1);
    setIsFlex(false);
  };

  return (
    <Router>
      <Row>
        <Col span={6}>
          <List>
            {routes.map(route => (
              <List.Item key={route.path}>
                <Link onClick={doReset} to={route.path}>
                  {route.name}
                </Link>
              </List.Item>
            ))}
          </List>
        </Col>
        <Col span={18}>
          <Space>
            {!isFlex && (
              <Button type="primary" onClick={doConvert}>
                转为 Flex 布局
              </Button>
            )}
            {isFlex && (
              <Button type="primary" onClick={doReset}>
                Reset
              </Button>
            )}
            <Typography.Text>当前为 {isFlex ? 'Flex' : 'Absolute'} 布局</Typography.Text>
          </Space>
          <div style={{ marginTop: 20 }}>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Routes key={resetKey}>
                <Route path="/" element={<Navigate to={routes[0].path} />} />
                {routes.map(route => (
                  <Route key={route.path} path={route.path} element={route.component} />
                ))}
              </Routes>
            </React.Suspense>
          </div>
        </Col>
      </Row>
    </Router>
  );
}

export default App;
