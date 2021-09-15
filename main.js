import Vue from 'vue'
import App from './App'
import ajaxs from './utils/request'//导入封装好的request
import navTo from './utils/navTo'
import downLoad from './utils/downLoad'
Vue.config.productionTip = false;
Vue.prototype.login=false;
Vue.prototype.$navTo=navTo;
Vue.prototype.$downLoad=downLoad;
Vue.prototype.$ajaxs=ajaxs;//微信小程序网络请求的配置
Vue.prototype.$showToast = (title) => {
    uni.showToast({
        title,
        icon:'none',
		duration: 1200
		
    });
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
