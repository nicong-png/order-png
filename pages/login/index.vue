<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<view class="login_btn">
			<view class="warp">
				<input
					type="text"
					placeholder-style="color: #727cf5;"
					class="inputStyle"
					placeholder="请填写手机号"
					v-model.trim="loginInf.account"
				></input>
				<uni-icons v-if="loginInf.account" class="icon" color="#999999"  size="18" type="clear"  @click="loginInf.account=''"/>
			</view>
			<view class="warp">
			<input
				type="password"
				placeholder-style="color: #727cf5;"
				class="inputStyle"
				placeholder="请填写密码"
				v-model.trim="loginInf.pwd"
			/>
			<uni-icons v-if="loginInf.pwd" class="icon" color="#999999"  size="18" type="clear"  @click="loginInf.pwd=''"/>
			</view>
			<button class="login_btn_t" @click="login">登录</button>
		</view>
	</view>
</template>

<script>
    import uniIcons from "../../components/uni-icons/uni-icons.vue";
	export default {
		components: {
			uniIcons
		},
		data() {
			return {
				title: '妇幼健康监护管理服务平台',
				loginInf:{
					account:"",
					pwd:""
				}
			}
		},
		onLoad() {

		},
		onShow(){
		},
		methods: {
			login(){
				var _this = this;
				if(_this.loginInf.account){
					const reg = /^1[0-9][0-9]\d{8}$/
					if(!reg.test(_this.loginInf.account)){
						return 	_this.$showToast("手机号格式错误")
						}
				      }else{
						return 	_this.$showToast("请输入手机号")
				      }
				      if(!_this.loginInf.pwd){
				        return 	_this.$showToast("请输入密码")
				      }
				_this.$ajaxs
					.post("/console/v1/users/loginWeb",_this.loginInf)
					.then(res => {
						if (res.status === 200) {
							if(res.content.roleId=="325733970820214784"){
								_this.$showToast("登录成功")
								uni.reLaunch({url: "../order/index"});
								console.log(res.content,"kkkkkkkkkkkkkk")
								uni.setStorage({key:'roleId', data:res.content.roleId});
								uni.setStorage({key:'token', data:res.content.token});
								uni.setStorage({key:'userInfo', data:res.content})
							}else{
								return _this.$showToast("该用户暂无登录权限！");
							}
						
						} else {
							 return _this.$showToast("该用户暂无登录权限！");
						}
					})
					.catch(err => reject(err));
			},
		}
	}
</script>

<style  scoped>
	.content {
		 height:calc( 100vh - 120rpx);
		 overflow: hidden;
		/* display: flex;
		flex-direction: column;
		align-items: center; */
		/* justify-content: center; */
	}
	.text-area {
		line-height: 120upx;
		text-align: center;
		margin-top: 100upx;
	}
	.warp{
		position: relative;
	}
	
	.icon{
		    position: absolute;
		    right: 6%;
		    top: 27%;
	}
	.title {
		font-size: 50upx;
		color: #727cf5;
		font-weight: bold;
	}
	.inputStyle {
    border: 1rpx solid #727cf5;
    font-size: 28rpx;
    padding-left: 40upx;
    border-radius: 48upx;
    /* width: 578upx; */
    height: 80upx;
    background: rgba(114, 124, 245,0.1);
    margin-bottom: 28upx;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}
.login_btn {
    padding: 0 80upx 20upx 80upx;
    margin-top: 100upx;
}
.login_btn .login_btn_t,
.login_btn_o {
    background: #fff;
    border: 1px solid #727cf5;
    /* width: 620upx; */
    height: 84upx;
    text-align: center;
    line-height: 80upx;
    border-radius: 48upx;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    color: #727cf5;
	margin-top: 70rpx;
}

</style>
