import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Vue.config.productionTip = false

let instance = null
function render (props) {
  instance = new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')    //这里是挂载到自己的html中，基座会拿到挂载后的html将其插入进入
}

// 动态添加public_path
if(window.__POWERED_BY_QIANKUN__){     
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
// 默认独立运行
if(!window.__POWERED_BY_QIANKUN__){
  render()
}

// 子组件的协议就ok了
export async function bootstrap(){
  console.log('vue-app')
}

// 更新
export async function mount(props){
  console.log(props)
  console.log('开启')
  render(props);
}

// 卸载
export async function unmount(props){
  console.log('关闭')
  instance.$destroy();
}