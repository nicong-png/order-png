<template>
    <div>
        <div class="my" v-if="userInf">
            <div class="listItm" style="height: 100px;">
                <div class="listFlex main">
                    <div class="listLeft" style="line-height:100px;">头像</div>
                    <div class="listRight">
                       <span
                            class="listCheckT"
                            style="width:50px;height:50px;margin-top:19px;display: block;border-radius:50%;overflow:hidden;float:right;"
                        >
							<image
								style="width:100%;height:100%;text-align:right;"
								src="../../../static/images/defPic.png"
								 v-if="!userInf.imageUrl"
							/>
                            <image
                                style="width:100%;height:100%;text-align:right;"
                                v-if="userInf.imageUrl"
                                :src="userInf.imageUrl"
                            />
                        </span>
                        <span class="weui-cell__ft_in-access hiddenCom"></span>
                    </div>
                </div>
            </div>
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">昵称</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                placeholder="请填写"
                                v-model="userInf.nickname"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">姓名</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                placeholder="请填写"
                                v-model="userInf.chineseName"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <picker class="listItm" @change="sexChange" :value="index1" :range="sexRange">
                <div class="listFlex main">
                    <div class="listLeft">性别</div>
                    <div class="listRight" v-if="index1">
                        <span class="listCheckT">{{sexRange[index1]}}</span>
                        <span class="weui-cell__ft_in-access"></span>
                    </div>
                    <div class="listRight" v-else>
                        <span class="listCheckT">请选择</span>
                        <span class="weui-cell__ft_in-access"></span>
                    </div>
                </div>
            </picker>
            <picker class="listItm" mode="date" @change="bindDateChange" >
                <div class="listFlex main">
                    <div class="listLeft">出生日期</div>
                    <div class="listRight" v-if="userInf.birthday">
                        <span class="listCheckT">{{ userInf.birthday }}</span>
                        <span class="weui-cell__ft_in-access"></span>
                    </div>
                    <div class="listRight" v-else>
                        <span class="listCheckT">请选择</span>
                        <span class="weui-cell__ft_in-access"></span>
                    </div>
                </div>
            </picker>
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">联系电话</div>
                    <div class="listRight">
                        <span class="listCheckT">{{userInf.mobile}}</span>
                    </div>
                </div>
            </div>

            <div class="btn">
                <div class="saveBtn" @click="saveInf()">
                    <span>保存</span>
                </div>
                <div class="saveBtn" @click="handleClick">
                    <span>退出登录</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	let login_type; //用户类型
	const defaultForm = {
	  id: null,
	  account: undefined, // 登录账号
	  mobile: null, // 手机号
	  address: null,
	  age: 0,
	  birthday: null,
	  blood: null,
	  career: null,
	  pwd: null,
	  email: null,
	  chineseName: "", // 中文名
	  education: "",
	  ethnic: "", // 民族
	  household: "", // 户籍
	  idNumber: null, // 证件号
	  idType: 1, // 证件类型
	  loginType: 1, // 登录类型（1后台，2非后台）
	  nationality: null, // 国籍
	  nickname: "", // 昵称
	  openIdQq: null, // qq注册生成的id
	  openIdWechat: null, // 微信注册时生成的ID
	  openIdWeibo: null, // 微博注册时生成的ID号
	  qqNumber: "", // qq号
	  wechat: null, // 微信
	  weibo: null, //微博
	  registerCode: null,
	  status: "1", // 默认激活状态
	  province: null, // 省份
	  cities: "",
	  imageUrl: "http://qny.wehealth.net.cn/FgjU9IKVmUUZJ8SJ_apu7ZgeZ-7p",
	  sex: "1",
	  // registerType: null, // 注册类型
	  // userType: null, // 用户类别
	  // roleId: null, // 角色
	};
export default {
    name: "MyMessage",
    data() {
        return {
            index1: 0,
            sexRange: ["男", "女"],
            userInf:Object.assign({}, defaultForm),
        };
    },
    onShow() {
        this.getInf();
    },
    methods: {
        sexChange(e) {
            this.index1 = e.target.value;
            this.userInf.sex = e.target.value - 0 + 1 + "";
        },
        handleClick() {
            uni.showModal({
                title: "退出登录",
                content: "确认退出！",
                success(res) {
                    if (res.confirm) {
                        uni.showLoading({
                            title: "退出中.." //数据请求前loading，提高用户体验
                        });
                        setTimeout(() => {
                            uni.removeStorage({
                                key: "token",
                                success(res) {
                                    uni.hideLoading();
                                    const url = "../../login/index";
                                    uni.reLaunch({
                                        url: url
                                    });
                                }
                            });
                        }, 1000);
                    } else if (res.cancel) {
                        // console.log('用户点击取消')
                    }
                }
            });
        },
        bindDateChange(e) {
            this.userInf.birthday = e.mp.detail.value;
        },
        getInf() {
            var _this = this;
            _this.$ajaxs
                .get("/console/v1/users/getUserInfo")
                .then(res => {
                    if (res.status == 200) {
						console.log(res.content,"res.contentres.content")
                        _this.userInf = Object.assign({}, res.content);
						console.log(_this.userInf,"_this.userInf.sex")
                        _this.userInf.birthday = _this.userInf.birthday?_this.userInf.birthday.split(" ")[0]:"";
						console.log(_this.userInf,"_this.userInf.sex")
                        if (_this.userInf.sex) {
                            _this.index1 = Number(_this.userInf.sex) - 1 + "";
							
							console.log(_this.index1,"index1")
                        }
                        var data = {
                            imageUrl: _this.userInf.imageUrl,
                            nickname: _this.userInf.nickname,
                            token: uni.getStorageSync("token"),
                            chineseName: _this.userInf.chineseName,
                            mobile: _this.userInf.mobile,
                            account: uni.getStorageSync("userInfo").account,
                            id: _this.userInf.id,
                        };
                        uni.setStorage({
                            //存储到本地
                            key: "userInfo",
                            data: data
                        });
                    } else {
                        uni.showToast({
                            title: "网路不畅~",
                            icon: "none"
                        });
                    }
                })
                .catch(() => {});
        },
        saveInf() {
            var _this = this;
            _this.$ajaxs
                .post("/console/v1/users/edite", _this.userInf)
                .then(res => {
                    if (res.status == 200) {
                        wx.showToast({
                            title: "保存成功",
                            icon: "none"
                        });
                        setTimeout(() => {
                            _this.getInf();
                        }, 1000);
                    } else {
                        wx.showToast({
                            title: "保存失败",
                            icon: "none"
                        });
                    }
                })
                .catch(() => {});
        },
        lodingtop() {
            this.getInf();
            uni.stopPullDownRefresh();
        }
    }
};
</script>
<style scoped>
		
	.my{
		height: calc(100vh - 100rpx);
		overflow: hidden;
	}
.listItm {
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ddd;
}
.listFlex {
    display: flex;
    height: 100%;
    justify-content: space-between;
}
.listCheckT {
    color: #999;
    margin-right: 8px;
}
.listRight {
    width: 60%;
    text-align: right;
}
.listLeft {
    width: 40%;
}
.inputStyle {
    display: inline-block;
    margin-top: 12px;
    text-align: right;
    color: #999;
}
.hiddenCom {
    visibility: hidden;
}
.btmCon {
    height: 90px;
    margin-top: 10px !important;
    background: #fff;
    color: #727cf5;
}
.btn {
    position: fixed;
    bottom: 50px;
    left: 0px;
    width: 100%;
    height: 64px;
    background: #fff;
    display: flex;
    justify-content: space-between;
}
.saveBtn {
    height: 70upx;
    width: 240upx;
    text-align: center;
    line-height: 70upx;
    border: 1px solid #727cf5;
    border-radius: 40upx;
    color: #727cf5;
    font-size: 32upx;
    background: #fff;
    margin: 0 40upx;
}
.weui-cell__ft_in-access {
    padding-right: 13px;
    position: relative;
}
.weui-cell__ft_in-access:after {
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #999;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 2px;
}
.main {
    width: 86%;
    margin: 0 auto;
}
</style>


