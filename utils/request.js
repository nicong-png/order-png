import Vue from 'vue'
var  ajaxUrl = 'http://183.11.235.36:25555' 
// var  ajaxUrl = 'http://192.168.1.51:5555'


var ajaxs = {
	xlxsUrl(){
		return ajaxUrl
	},
    get(url, data) {
        var token = uni.getStorageSync('token')
        uni.showLoading({
            title: '加载中'
        });
        return new Promise((resolve, reject) => {
        if(url=='/mobile/v1/area/getList'||url=="/mobile/v1/hospital/getHospital"){
            // ajaxUrl='https://api.wehealth.net.cn/' //生产
            ajaxUrl='http://183.11.235.36:25555'  //测试
            // ajaxUrl='http://192.168.1.51:5555'
        }else{
           
        }
        uni.request({
            url: ajaxUrl + url, //仅为示例，并非真实接口地址。
            data: data,
            header: {
                "Authorization": token, // 让每个请求携带自定义token 请根据实际情况自行修改
                'Content-Type': 'application/json'
            }, // 设置请求的 header
            success: (res) => {
                // success
                uni.hideLoading();
                if (res.statusCode != 200) {
                    uni.showToast({
                        title: "网络出错，稍后再试",
                        icon: "none"
                    });
                    return false;
                } else
                    if (res.data.status == '401') {
                        uni.reLaunch({
                            url: '../login/index',
                        });
                        return false;
                    }
                resolve(res.data);
            },
            fail: (res) => {
                uni.hideLoading();
                uni.showToast({
                    title: "网络出错，稍后再试",
                    icon: "none"
                });
                reject(error);//请求失败
            },
            complete: function () {
                uni.hideLoading();
                // complete
            }
        });
    })
    },
    post(url, data) {
        var token = uni.getStorageSync('token')
        ajaxUrl = 'http://183.11.235.36:25555' 
        uni.showLoading({
            title: '加载中',//数据请求前loading，提高用户体验
        })
        return new Promise((resolve, reject) => {
        uni.request({
            url: ajaxUrl + url, //仅为示例，并非真实接口地址。
            data: data,
            method:'POST',
            header: {
                "Authorization": token, // 让每个请求携带自定义token 请根据实际情况自行修改
                'Content-Type': 'application/json'
            }, // 设置请求的 header
            success: (res) => {
                // success
                uni.hideLoading();
                if (res.statusCode != 200) {
                    uni.showToast({
                        title: "网络出错，稍后再试",
                        icon: "none"
                    });

                    return false;
                } else
                    if (res.data.status == '401') {
                        uni.reLaunch({
                            url: '../login/index',
                        });
                        return false;
                    }
                resolve(res.data);
            },
            fail: (res) => {
                uni.hideLoading();
                reject(error);//请求失败
            },
            complete: function () {
                uni.hideLoading();
                // complete
              }
        });
        });
    }
}











export default ajaxs;//暴露出来供其他文件引用