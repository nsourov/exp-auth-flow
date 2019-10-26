import React from 'react';
import { Spin } from 'antd';

import './style.css';

export default function Fallback() {
  return (
    <div className="app-loading">
      <Spin spinning size="large" tip="Loading..." />
    </div>
  );
}
