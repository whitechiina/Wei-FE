# Wei-FE
微前端qiankun基座和应用配置

# 新建子应用配置

1 导出相应的生命周期钩子
子应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用。
```
let instance = null
/**
 * bootstrap 只会在子应用初始化的时候调用一次，下次子应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap () {}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount ({ appKey = '', data = {} } = {}) {
  instance = new Vue({
    router: routerFactory(appKey),
    store,
    render: h => h(App, { props: data })
  }).$mount('#app')
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载子应用的应用实例
 */
export async function unmount () {
  instance.$destroy()
  instance = null
}
```

如果需要子应用单独开发环境运行
// 单独开发环境
window.__POWERED_BY_QIANKUN__ || mount()

2 router配置

需要导出一个函数，接收传入的appKey，作为baseurl
export default (appKey) => new VueRouter({ routes, base: '/' + appKey, mode: 'hash' })


3 配置子应用打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别子应用暴露出来的一些信息，子应用的打包工具需要增加如下配置：

```
// 需要在package.json中设置子应用的name
// 子应用名字已module开头，已‘-’分割，eg：‘module-admin’，‘module-page-service’
// 子应用名称不要带数字，数字两侧会带下划线，eg. module-gis2d => module_gis_2_d
const packageName = require('./package.json').name;
module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

需要配置publicPath


如果未配置publicPath，会导致子应用加载的资源 404

// qiankun 将会在子应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在子应用的 entry js 的顶部添加如下代码
window.__POWERED_BY_QIANKUN__ && (__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__)

4 在基座中注册该子应用
```
registerMicroApps(
  [
    {
      name: 'module-admin',
      entry: 'http://localhost:8001',
      render: render.bind(render, 'Top'),
      activeRule: genActiveRule('/module-admin'),
      props: Object.assign({}, { appKey: 'module-admin' }, injections)
    }
  ]
)
```

笔记地址：https://www.yuque.com/white-al3cc/white/ty5cn7

