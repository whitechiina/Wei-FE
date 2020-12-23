import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorder'

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}


// 动态添加public_path
if(!window.__POWERED_BY_QIANKUN__){
  render()
}

// 按要求导出协议
export async function bootstrap() {}
export async function mount() {
  render();
}

export async function unmount() {
  // 卸载节点
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}

