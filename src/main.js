import Vue from 'vue'
import App from './App'
import Modo from 'modo-ui'
import './asset/css/common.scss'
import ModoConfig from './utils/config'
import store from './store/index'
import Fly from 'flyio/dist/npm/wx'

Vue.config.productionTip = false
App.mpType = 'app'

Modo.init('host', 'baseUrl', 'appType', 'userType')
Vue.prototype.$Modo = Modo

Vue.prototype.$store = store
Vue.prototype.$http = new Fly
// 添加拦截器
Vue.prototype.$http.interceptors.request.use((config, promise) => {
    //给所有请求添加自定义header
    config.headers["X-Tag"] = "flyio mina-tech"
    config.headers["content-type"] = "application/x-www-form-urlencoded"
    return config
})
// 添加请求基地址
Vue.prototype.$http.config.baseURL = ModoConfig.host + ModoConfig.baseUrl

const app = new Vue(App)
app.$mount()

/* export default {
    // 这个字段走 app.json
    config: {
        // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        pages: [
            '^pages/index/main', // 首页
            "pages/base/main",
            "pages/counter/main",
            "pages/message/main",
            "pages/item/main",

            "pages/techDetail/main", // 技师详情
            "pages/mine/main", // 客服
            "pages/projectDetail/main", // 项目详情
            "pages/appoint/main", // 在线预约
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: "#7a68e6",
            navigationBarTitleText: '小摩豆会所',
            navigationBarTextStyle: "#fff"
        },
        tabBar: {
            color: "#C9C9D4",
            selectedColor: "#7A68E6",
            list: [{
                pagePath: "pages/index/main",
                text: "首页",
                iconPath: "static/img/home_menu.png",
                selectedIconPath: "static/img/home_menu_selected.png"
            },{
                pagePath: "pages/appoint/main",
                text: "在线预约",
                iconPath: "static/img/appoint_menu.png",
                selectedIconPath: "static/img/appoint_menu_selected.png"
            },{
                pagePath: "pages/mine/main",
                text: "客服",
                iconPath: "static/img/service_menu.png",
                selectedIconPath: "static/img/service_menu_selected.png"
            }]
        },
        networkTimeout: {
            request: 10000,
            connectSocket: 10000,
            downloadFile: 10000,
            uploadFile: 10000
        },
        debug: true
    }
} */
