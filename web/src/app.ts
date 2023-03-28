import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Taro from "@tarojs/taro";
import './app.scss'

const App = createApp({
  onShow(options) {
  },
  onLaunch() {
    Taro.showShareMenu({
      withShareTicket: true
    })
    //判断用户是否登录  登录就跳过首页;
    const updateManager = Taro.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function() {
          Taro.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用？",
            success: function(res) {  
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            },
          });
        });
        updateManager.onUpdateFailed(function() {
          // 新的版本下载失败
        });
      }
    });
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

App.use(createPinia())

export default App
