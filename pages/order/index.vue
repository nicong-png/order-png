<template>
	<view class="order">
		<headers HTitle='订单管理' :Licon='Licon' :Subicon='Subicon' @leftClick="add(true)" @rightClick="my()"></headers>
		<uni-search-bar class="search" :radius="24" @confirm="search" @focus="open" @clear="clear" @cancel="cancel" cancelButton="always" bgColor="#FFFFFF" placeholder="订单编号/用户名称/联系电话"></uni-search-bar>
		<view class="content">
		 <view style="height:10rpx;"></view>
		 <!-- <scroll-view  scroll-y style="height: calc(100vh - 200px);"> -->
		   <div class="nav" >
		      <div class="nav_box">
		        <div v-for="(item, index) in itemslist" :key="index"  @click="gitActive" :data-index="index">
					<text v-if="item.total>0" :class="active==index?'nav_item navItemActive':'nav_item'">{{item.display_name}}({{item.total}})</text>
					<text v-else :class="active==index?'nav_item navItemActive':'nav_item'">{{item.display_name}}</text>
				</div>
		      </div>
		    </div>
			<scroll-view  scroll-y  class="list" style="height: calc(100vh - 130px);" @scrolltolower="handleScrollToLower">
			    <view class="null_s" v-if="!(list&&list.length)>0">
			      <image  class="null" src="../../static/images/img_null_bookbuilding.png" mode="widthFix"></image>
			      <view class="nText">暂无数据</view>
			    </view>
			    <view v-else >
			      <view v-for="(item,index) in list"   :key="index"  class="list_item">
			      <view class="header1">
			       <view class="time">{{item.createTime||""}}</view>
			       <view :data-id="item.id" @tap="del"  v-if="item.status == 8">
			        <image class="close"   src="../../static/images/close.png" mode="widthFix"></image>
			       </view>
			      </view>
			      <view class="h_item">
			        <view class="block">
					  <view>订单编号: {{item.number}} </view>
			          <view>用户名称: {{item.userName}}</view>
					  <view>联系电话: {{item.mobile}}</view>
					  <view>产品名称: {{item.orderName}}</view>
			          <view>医院名称: {{item.hospitalName}}</view>
					  <view>应付金额: {{item.payable}}</view>
					  <view>实付金额: {{item.price}}</view>
					  <view>服务时间: <text v-if="item.beginTime||item.endTime">{{item.beginTime}} ~ {{item.endTime}}</text></view>
					  <view>支付方式: {{item.paymentType|payWay }}</view>
					  <view>订单状态: <span style="color:#727cf5;margin-left: 10rpx;font-weight: bold;">  {{item.status | statusTextFilter}}</span></view>
			        </view>
			      </view>
			      <view style="height:30rpx;"></view>
			      <view class="btns">
			       <view class="b_item"   :data-id="item.id" @tap="detail">
			          <!-- <image class="w_30" src="../../static/images/finish.png" mode="widthFix"></image> -->
			          <view >订单详情</view>
			       </view>
			      </view>
			    </view>
			   </view>
			    <view style="height:100rpx;"></view>
			  </scroll-view>
			  </view>
			 <!-- </scroll-view> -->
			  <uni-popup ref="popup" type="left">
				<view class="popup_page">
				<view class="listItm"  @click="areaChange">
				    <div class="listFlex main">
				        <div class="listLeft">地区</div>
				        <div class="listRight">
				            <span class="listCheckT">{{areaName||"请选择"}}</span>
				            <span class="weui-cell__ft_in-access"></span>
				        </div>
				    </div>
				  </view>
				 <view  class="listItm" @click="hospitalChange" >
				     <div class="listFlex main">
				         <div class="listLeft">医院</div>
				         <div class="listRight">
				             <span class="listCheckT">{{hospitalName||"请选择"}}</span>
				             <span class="weui-cell__ft_in-access"></span>
				         </div>
				     </div>
				   </view>
			 <div v-if="!addFlag">
				<div class="listItm">
				    <div class="listFlex main">
				        <div class="listLeft">产品名称</div>
				        <div class="listRight">
				            <span class="listCheckT">
				                <input
				                    type="text"
				                    placeholder-style="color: #999;"
				                    class="inputStyle"
				                    placeholder="请填写"
				                    v-model="listQuery.orderName"
				                />
				            </span>
				        </div>
				    </div>
				</div>
				<picker class="listItm" @change="sexChange"  :value="index1" :range="dic.pay" range-key="name">
				    <div class="listFlex main">
				        <div class="listLeft">支付方式</div>
				        <div class="listRight" v-if="listQuery.paymentType">
				            <span class="listCheckT">{{listQuery.paymentType|payWay}}</span>
				            <span class="weui-cell__ft_in-access"></span>
				        </div>
				        <div class="listRight" v-else>
				            <span class="listCheckT">请选择</span>
				            <span class="weui-cell__ft_in-access"></span>
				        </div>
				    </div>
				</picker>
				<picker class="listItm"  mode="date" :value="listQuery.beginTime"  @change="bindDateChange">
					<div class="listFlex main">
					    <div class="listLeft">开始时间</div>
					    <div class="listRight">
					        <span class="listCheckT">{{listQuery.beginTime||"请选择"}}</span>
					        <span class="weui-cell__ft_in-access"></span>
					    </div>
					</div>
				 </picker>
				 <picker class="listItm"  mode="date" :value="listQuery.beginTime" @change="bindDateChange2">
				 	<div class="listFlex main">
				 	    <div class="listLeft">结束时间</div>
				 	    <div class="listRight">
				 	        <span class="listCheckT">{{listQuery.endTime||"请选择"}}</span>
				 	        <span class="weui-cell__ft_in-access"></span>
				 	    </div>
				 	</div>
				  </picker>
				 </div>
				 <view class="btn_s">
					<!-- <view class="btn_t" @click='cancelSub' >取消</view> -->
					
				 </view>
				  <view class="btn_s">
					<view class="btn_t" @click='cancelSub' >取消</view>
					<view class="btn_t b_sa" style="border-right: 1upx solid #ddd;"  v-if="btnIsCheckedExpor"  @click="exportExcel()" >数据导出</view>
					<view class="btn_t b_sa" @click='saveSub' >{{addFlag?"下一步":"保存筛选条件"}}</view>
				  </view>
				</view>
			  </uni-popup>
		</view>
</template>

<script>
	import uniSearchBar from '../../components/uni-search-bar/uni-search-bar.vue';
	import uniPopup from '../../components/uniPop/uniPop.vue';
	import headers from '../../components/header_nav/header_nav.vue';
	import { selectOption } from "@/utils/selectOption";
	const statusOptions =  [
  { val: 1, display_name: "待付款", style_name: "info" },
  { val: 2, display_name: "待发货", style_name: "info" },
  { val: 3, display_name: "待收货", style_name: "info" },
  { val: 4, display_name: "使用中", style_name: "info" },
  { val: 5, display_name: "已完成", style_name: "info" },
  { val: 6, display_name: "退款/售后", style_name: "info" },
  { val: 7, display_name: "已逾期", style_name: "info" },
  { val: 8, display_name: "已取消", style_name: "info" },
];
const payOptions = [
  { val: 1, display_name: '微信支付', style_name: 'info' },
  { val: 2, display_name: '支付宝支付', style_name: 'info' },
  { val: 3, display_name: '线下支付', style_name: 'info' },
  { val: 4, display_name: '银行卡转账', style_name: 'info' },
  { val: 5, display_name: '小程序支付', style_name: 'info' },
];

	export default {
		components: {
					uniPopup,
					uniSearchBar,
					headers
				},
	    data() {
			const currentDate = this.getDate1({
			   format: true
			  })
	        return {
				Licon:'../../static/images/btn.png',
				Subicon:'../../static/images/btn.png',
				orderInfo:{},
				btnIsCheckedExpor:false,//按钮权限
				btnIsCheckedDel:false,//按钮权限
				addFlag:"",
	            active: 0,
				valuetime:[],
				startTimeA:'',
				endTimeA:'',
				list:[],
				totalPage:"",
				areaId:"",
				areaName:"",
				hospitalName:"",
				hospitalId:"",
				index1:"",
			    listQuery: {
					pageNum: 1,
					pageSize: 10,
					mobile: "",
					number: "",
					orderName: "",
					userName: "",
					paymentType: "",
					beginTime:"",
					endTime:"",
					hospitalId:"",
					hospitalType:""
				  },
				   dic: {
				          // 字典数据
				          pay: [],
				          pick: [],
				          status: [],
				        },
	            itemslist: [  { val: 0, display_name: "全部",total:0 },
							  { val: 1, display_name: "待付款",total:0 },
							  { val: 2, display_name: "待发货",total:0 },
							  { val: 3, display_name: "待收货",total:0},
							  { val: 4, display_name: "使用中",total:0},
							  { val: 5, display_name: "已完成",total:0},
							  { val: 6, display_name: "退款/售后",total:0 },
							  { val: 7, display_name: "已逾期",total:0 },
							  { val: 8, display_name: "已取消",total:0 },],
	        };
	    },
	    onShow() {
			 var data = new Date();
			    var lw = new Date(data - 1000 * 60 * 60 * 24 * 29);
			    var year = lw.getFullYear();
			    var mounth = lw.getMonth() + 1;
			    var day = lw.getDate();
			    var year1 = data.getFullYear();
			    var mounth1 = data.getMonth() + 1;
			    var day1 = data.getDate();
			
			    this.startTimeA =
			      year +
			      "-" +
			      (mounth < 10 ? "0" + mounth : mounth) +
			      "-" +
			      (day < 10 ? "0" + day : day);
			    var time1 =
			      year +
			      "-" +
			      (mounth < 10 ? "0" + mounth : mounth) +
			      "-" +
			      (day < 10 ? "0" + day : day);
			
			    var time2 =
			      year1 +
			      "-" +
			      (mounth1 < 10 ? "0" + mounth1 : mounth1) +
			      "-" +
			      (day1 < 10 ? "0" + day1 : day1);
			
			    var arr = [];
			    arr.push(time1, time2);
			
			    this.valuetime = arr;
			    this.startTimeA = this.valuetime[0];
			    this.endTimeA = this.valuetime[1];
				this.getOrderListy()
				this.getDic();
				this.getAreaList()
				this.getButtons()
	    },
		onLoad(){
			
		},
		 filters: {
			 payWay(status) {
			     if (status != 'null' && status) {
			       const statusText = payOptions.reduce((acc, cur) => {
			         if (cur.val == status) {
			           acc = cur.display_name
			         }
			         return acc
			       }, {})
			       return statusText
			     }
			     return ''
			   },
		    statusStyleFilter(status) {
		      if (status && status != " ") {
		        const statusStyle = statusOptions.reduce((acc, cur) => {
		          if (cur.val == status) {
		            acc = cur.style_name;
		          }
		          return acc;
		        }, {});
		        return statusStyle;
		      }
		      return "info";
		    },
		    statusTextFilter(status) {
		      if (status && status != " ") {
		        const statusText = statusOptions.reduce((acc, cur) => {
		          if (cur.val == status) {
		            acc = cur.display_name;
		          }
		          return acc;
		        }, {});
		        return statusText;
		      }
		      return "未知";
		    },
		  },
	    methods: {
			//数据导出
			 exportExcel() {
			      var _this = this;
				  this.listQuery.status = this.active!=0 ? this.active : null;
				  this.listQuery.hospitalId = this.hospitalId;
				  var startTime = new Date(this.startTimeA);
				  this.listQuery.beginTime =this.listQuery.beginTime?this.listQuery.beginTime:this.startTimeA;
				  this.listQuery.endTime =this.listQuery.endTime?this.listQuery.endTime:this.endTimeA;
				  var data = {
					  startDate:this.listQuery.beginTime,
					  endDate:this.listQuery.endTime,
					  paymentType:this.listQuery.paymentType,
					  hospitalId:this.listQuery.hospitalId,
					  orderName:this.listQuery.orderName,
				  }
				  console.log(_this.$ajaxs.xlxsUrl(),"_this.$ajaxs.url_this.$ajaxs.url")
					_this.$downLoad.request({
					             method: 'GET',
					             url: _this.$ajaxs.xlxsUrl() + '/console/v1/order/exportExcel',
					             data:data,
					             success: function (res) {
									if (!res) return;
									let blob = new Blob([res], {
									type: "application/vnd.ms-excel;charset=utf-8",
								  });
								  let url = window.URL.createObjectURL(blob);
								  let aLink = document.createElement("a");
								  aLink.style.display = "none";
								  aLink.href = url;
										aLink.setAttribute(
										  "download",
										  _this.listQuery.beginTime + "至" + _this.listQuery.endTime + "订单.xls"
										);
										document.body.appendChild(aLink);
										aLink.click();
										document.body.removeChild(aLink);
										window.URL.revokeObjectURL(url);
					             }
					        }); 
					
			    },
			//下拉刷新
			handleScrollToLower(){
				if (this.list.length < this.totalPage) {
					this.listQuery.pageSize += 10
				      this.getOrderListy();
				    }
			},
		  sexChange(e) {
		      this.index1 = e.target.value;
		      this.listQuery.paymentType = this.dic.pay[this.index1].value;
		  	console.log(this.listQuery.paymentType,"this.listQuery.paymentType")
		  },
	       gitActive(e) {
	                   this.active = e.currentTarget.dataset.index;
					   this.listQuery.pageSize = 10
					   this.getOrderListy()
	               },
			search(e) {
						console.log(e.value);
						this.listQuery.number = e.value,
						this.listQuery.userName = e.value,
						this.listQuery.mobile = e.value,
						this.getOrderListy()
					},
			//新增订单
			add(val){
				this.addFlag = val;
				this.$refs.popup.open('top')
				console.log("eeeeeeeeeee")
				
			},
			//我的
			my(val){
				uni.navigateTo({
					url:"../tabbar/my/Index"
				})
				console.log("eeeeeeeeeee")
				
			},
			cancel(e){
				console.log(e,"eeeeeeeeeeee")
				this.$refs.popup.open('top')
			},
			areaChange(){
				uni.navigateTo({
					url:"./area"
				})
			},
			hospitalChange(){
				uni.navigateTo({
					url:"./hospital"
				})
			},
			cancelSub(){
				if(this.hospitalId||this.orderName||this.paymentType){
					this.hospitalId = "";
					this.hospitalName = "";
					this.areaName = "";
					this.listQuery = {
						pageNum: 1,
						pageSize: 10,
						mobile: "",
						number: "",
						orderName: "",
						userName: "",
						paymentType: "",
						beginTime:"",
						endTime:"",
						hospitalId:"",
						hospitalType:""
					  },
					this.getOrderListy()
				}
				this.$refs.popup.close()
				setTimeout(()=>{
					this.addFlag = ""
				},500)
			},
			saveSub(){
				if(this.addFlag){
					if(!this.hospitalId){
						return this.$showToast("请选择医院");
					}
					uni.setStorage({
							//存储到本地
							key: "hospitalId",
							data: this.hospitalId
						});
					uni.navigateTo({
						url:"./addOrder"
					})
					this.addFlag = ""
				}
				this.getOrderListy()
				this.$refs.popup.close()
			},
			clear(e){
				console.log(e,"eeeeeeeeeeee")
				if(this.listQuery.number){
				this.listQuery.number = "",
				this.listQuery.orderName = "",
				this.listQuery.mobile = "",
				this.getOrderListy()
				
				}
			},
		   del(e){
			   console.log(e,"eeeeeeeeee")
			   var _this = this
		      let id = e.currentTarget.dataset.id
		      uni.showModal({
		        content: '确认删除此订单记录?',
		        success: function (e) {
		          if(e.confirm){
					  console.log("ddddddddd")
		             _this.$ajaxs.post('/console/v1/order/deleteOrderByCancel?orderId='+id).then(res=>{
		              if(res.status == 200){
						  if (res.content.statusCode == "201") {
							  _this.$showToast("删除成功")
							  _this.getOrderListy()
						  }
		              }else{
						  _this.$showToast("获取数据异常")
					  }
		            })
		          }else{
		            
		          }
		        }
		      })
		      },
			detail(e){
				let id = e.currentTarget.dataset.id
				 uni.setStorage({
							//存储到本地
							key: "orderId",
							data: id
						});
				uni.navigateTo({
					url:"./orderDetail"
				})
				
			},
			getButtons() {
			     this.$ajaxs.get('/console/v1/pageRole/getButtons',{ menuId: '272465836609122304', roleId:uni.getStorageSync('roleId') })
			       .then((res) => {
			         if (res.status == 200) {
			            var data = res.content;
			                  data.forEach(element => {
			                    if (element.dictValue == "exportReport") {
			                      this.btnIsCheckedExpor = element.isChecked;
			                    }else if (element.dictValue == "orderDeletion") {
			                      this.btnIsCheckedDel = element.isChecked;
			                    }
			                  });
			         } else {
						this.$showToast("请检查网络 ~ ");
			           
			         }
			       })
			       .catch((err) => {
			       });
			   },
			 getAreaList() {
			      this.$ajaxs.get('/console/v1/area/list',{ parentId: 0 })
			        .then((res) => {
			          if (res.status == 200) {
			            this.list = res.content.list;
			          } else {
						this.$showToast("请检查网络 ~ ");
			            
			          }
			        })
			        .catch((err) => {
			        });
			    },
		   getOrderListy() {
		        this.listQuery.status = this.active!=0 ? this.active : null;
		        this.listQuery.hospitalId = this.hospitalId;
		        var startTime = new Date(this.startTimeA);
		        this.listQuery.beginTime =this.listQuery.beginTime?this.listQuery.beginTime:this.startTimeA;
		        this.listQuery.endTime =this.listQuery.endTime?this.listQuery.endTime:this.endTimeA;
		        this.$ajaxs.get('/console/v1/order/getAll',this.listQuery)
		          .then((res) => {
		            if (res.status == 200) {
		              this.list = res.content.list;
					  this.totalPage = res.content.total;
		              this.itemslist[this.active].total =  res.content.total
		            } else {
						this.$showToast("请检查网络 ~ ");
		              
		            }
		          })
		          .catch((err) => {
		          });
		      },
			   // 选择日期
			    bindDateChange: function(e) {
					let beginTime = new Date(e.target.value).getTime()
					let endDate = new Date(this.listQuery.endTime).getTime()
					if(endDate<beginTime){
						return this.$showToast("开始时间要小于结束时间");
					}
			     this.listQuery.beginTime = e.target.value
			     
			    },
			    bindDateChange2: function(e) {
					let endDate = new Date(e.target.value).getTime()
					let beginTime = new Date(this.listQuery.beginTime).getTime()
					if(endDate<beginTime){
						return this.$showToast("开始时间要小于结束时间");
					}
			     this.listQuery.endTime = e.target.value;
			    },
			    // 获取当前时间
			    getDate1(type) {
			     const date = new Date();
			     let year = date.getFullYear();
			     let month = date.getMonth() + 1;
			     let day = date.getDate();
			    
			     if (type === 'start') {
			      year = year - 60;
			     } else if (type === 'end') {
			      year = year + 2;
			     }
			     month = month > 9 ? month : '0' + month;;
			     day = day > 9 ? day : '0' + day;
			     return `${year}-${month}-${day}`;
			    },
			   
			  getDic() {
			        // 获取字典数据
			        selectOption("订单支付方式")
			          .then((res) => {
			            // console.log(res)
			            this.dic.pay = res;
			          })
			          .catch((err) => {
			            console.log("订单支付方式");
			          });
			  
			        selectOption("取货方式")
			          .then((res) => {
			            // console.log(res)
			            this.dic.pick = res;
			          })
			          .catch((err) => {
			            console.log("取货方式");
			          });
			  
			        selectOption("订单状态")
			          .then((res) => {
			            console.log(res)
			            this.dic.status = res;
			          })
			          .catch((err) => {
			            console.log("支付方式");
			          });
			      },
	    }
	};
</script>

<style scoped>
.order{
		  width: 100vw;
		  height: 100vh;
		  overflow: hidden;
		  overflow-y: scroll;
		  position: relative;
		  background-color: #f3f3f3;
	}
	.content{
		margin-top:calc(58px + env(safe-area-inset-top));
	}
	.nav {
	  position: relative;
	  background: #ffffff;
	  overflow: hidden;
	  z-index: 5;
	  margin-bottom: 30rpx;
	}
	 .nav .nav_box {
	  display: flex;
	  overflow-x: scroll;
	  -webkit-overflow-scrolling: touch;
	}
	 .nav .nav_box::-webkit-scrollbar {
	  display: none;
	}
	.nav .nav_box .nav_item {
	  display: inline-block;
	  height: 44px;
	  margin-left: 17px;
	  margin-right: 17px;
	  word-break: keep-all;
	  white-space: nowrap;
	  line-height: 44px;
	  font-size: 14px;
	  color: #333;
	  transition: all 0.1s ease 0s;
	}
	.nav .nav_box .navItemActive {
	  border-bottom: 3rpx solid #727cf5;
	  height: 35px;
	  color:#727cf5;
	  font-size: 14px;
	}
	 .list{
	  width: 90%;
	  /* height: 600rpx; */
	  margin:0 auto;
	  border-radius: 16rpx;
	  
	
	}
	 .list .null_s{
	  width:100%;
	  /* margin: 0 auto; */
	  border-radius: 16rpx;
	  text-align: center;
	}
	 .list .null_s .null{
	  /* width:350px; */
	  margin-top: 30rpx;
	}
	 .list .null_s .nText{
	width: 280rpx;
	font-size: 24rpx;
	height: 34rpx;
	line-height: 34rpx;
	color: #999999;
	text-align: center;
	margin: auto;
	margin-top: 20rpx;
	}
	 .list .list_item {
	 margin-bottom: 50rpx;
	 background:#fff;
	 border-radius: 16rpx;
	
	}
	.list .list_item .header1{
	  display: flex;
	  justify-content: space-between;
	  padding: 0 30rpx;
	  height: 84rpx;
	  line-height: 84rpx;
	  background: rgba(114,124,245,0.3);
	  box-shadow: 0px 3rpx 6rpx rgba(39, 133, 255, 0.13);
	  border-radius: 10rpx 10rpx 0rpx 0rpx;
	
	}
	 .list .list_item .header1 .time{
	  color: #727cf5;
	  font-size: 28rpx;
	
	}
	 .list .list_item .header1 image{
	  width: 20rpx;
	  height: 20rpx;
	  margin-top: 31rpx;
	
	}
	.w_30{
	  width: 30rpx;
	  height: 30rpx;
	}
	.h_item{
	  width: 610rpx;
	  padding: 25rpx 30rpx 0 30rpx;
	  display: flex;
	}
	.h_item .block{
	  font-size: 28rpx;
	  line-height: 40rpx;
	  overflow: hidden;
	}
	.h_item .remarks{
	  width: 610rpx;
	  font-size: 28rpx;
	  line-height: 40rpx;
	  overflow: hidden;
	  /* text-overflow: -o-ellipsis-lastline;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 2;
	  line-clamp: 2;
	  -webkit-box-orient: vertical; */
	}
	.h_item image{
	  margin-right:20rpx;
	  margin-top: 8rpx;
	}
	.h_item .flex1{
	  width: 550rpx;
	  display: flex;
	  justify-content: space-between;
	}
	.h_item .flex1 .name{
	  width: 450rpx;
	}
	.h_item .blue{
	  color: #727cf5;
	}
	.btns{
	  border-top: 2rpx solid #D5D5D5;
	  width: 100%;
	  height: 88rpx;
	  line-height: 88rpx;
	  font-size: 28rpx;
	  text-align: center;
	  font-weight: bold;
	  color: #727cf5;
	}
	.btns .b_item{
	  display: flex;
	  align-items: center;
	  width: 150rpx;
	  margin:0 auto;
	
	}
	.box .footer {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  background: rgba(0, 0, 0, 0.5);
	  z-index: 10;
	}
	.box .footer .tanc_i {
	  width: 100vw;
	  height: 980rpx;
	  background: #FFFFFF;
	  border-radius: 15rpx 15rpx 0rpx 0rpx;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  z-index: 100;
	}
	.box .footer .tanc_i .b_item{
	  width: 750rpx;
	  margin: -20rpx 0 20rpx 0 ;
	  
	}
	.close{
	  width: 30rpx;
	  float: right;
	  margin: 30rpx;
	}
	.avtor1{
	  width: 96rpx;
	}
	.bto .text{
	  width: 750rpx;
	  text-align: center;
	  margin:0 auto;
	  margin-bottom: 50rpx;
	  height: 50rpx;
	  font-size: 28rpx;
	  line-height: 50rpx;
	  color: #333333;
	}
		
	.popup_page{
		background-color: #fff;
	}
 .btn_s{
        width:100%;
        display: flex;
        align-items: center;
      }
      .btn_t{
        background:#fff ;
        width: 50%;
        text-align: center;
        line-height: 45px;
        font-size: 14px;
        color: #727cf5;
        
      }
      .b_sa{
        background:#727cf5;
        color: #fff;
      }
</style>
<style scoped>
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
    bottom: 90px;
    left: 0px;
    margin-top: 40px;
    width: 100%;
    height: 64px;
    background: #fff;
    display: flex;
    justify-content: space-between;
}
.saveBtn {
    height: 80rpx;
    width: 100%;
    text-align: center;
    line-height: 80rpx;
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
