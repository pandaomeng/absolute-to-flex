import './App.css';
import { Button, List, Space, Typography, message } from 'antd';
import { convertAbsoluteToFlex } from './utils/convertAbsoluteToFlex';
import { routes } from './router';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import React, { useState } from 'react';

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
    }
  };

  const doReset = () => {
    // 通过改变 key 强制重新加载当前路由组件
    setResetKey(prevKey => prevKey + 1);
    setIsFlex(false);
  };

  return (
    <Router>
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
      <div>
        <List>
          {routes.map(route => (
            <List.Item key={route.path}>
              <Link onClick={doReset} to={route.path}>
                {route.name}
              </Link>
            </List.Item>
          ))}
        </List>

        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes key={resetKey}>
            {routes.map(route => (
              <Route key={route.path} path={route.path} element={route.component} />
            ))}
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
