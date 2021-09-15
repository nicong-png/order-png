<template>
	<view class="order">
			<div class="tits"><text class="shu"></text>基本信息</div>
			<view  scroll-y  class="list">
			    <view class="null_s" v-if="!orderInfo">
			      <image  class="null" src="../../static/images/img_null_bookbuilding.png" mode="widthFix"></image>
			      <view class="nText">暂无数据</view>
			    </view>
			    <view v-else >
			      <view class="list_item">
			      <view class="h_item">
			        <view class="block">
					  <view>订单类型: {{orderInfo.parentId? "续租id：" + orderInfo.parentId: "首租订单"}} </view>
					  <view>订单号: {{orderInfo.number}}</view>
					 <view>套餐类型: {{
					orderInfo.packageType == "1"
					  ? "租赁套餐"
					  : orderInfo.packageType == "2"
					  ? "售卖套餐"
					  : orderInfo.packageType == "3"
					  ? "虚拟套餐"
					  : orderInfo.packageType == "4"
					  ? "体验套餐 "
					  : ""}}</view>
					  <view >订单状态:  <span style="color:#727cf5;margin-left: 10rpx;font-weight: bold;">  {{orderInfo.status | statusTextFilter}}</span></view>
			          <view>创建时间: {{orderInfo.createTime}}</view>
					  <view>姓名: {{orderInfo.userName}}</view>
					  <view>联系电话: {{orderInfo.mobile}}</view>
			          <view>医院名称: {{orderInfo.hospitalName}}</view>
			        </view>
			      </view>
			      <view style="height:30rpx;"></view>  
				  <view class="btns-bottom">
				   <view class="bottom" @click="gopage(1)">
				      <view class="bottom-item">费用详情</view>
				   </view>
				   <view class="bottom" @click="gopage(2)">
				      <view class="bottom-item">收货地址</view>
				   </view>
				   <view class="bottom" @click="gopage(3)">
				      <view class="bottom-item">物流信息</view>
				   </view>
				  </view>
				  <view class="btns-bottom"   style="padding-bottom: 15px;">
				   <view class="bottom" v-if="
					  orderInfo.status == 1 ||
					  (!orderInfo.parentId && orderInfo.status == 2)
					" :disabled="
					  (orderInfo.packageType == 4 || orderInfo.packageType == 3) &&
					  orderInfo.status == 2"   @click="gopage(4)">
				      <view class="bottom-item" style="background: rgb(114,124,245);color: #fff;">取消订单</view>
				   </view>
				   <view class="bottom"  v-if="orderInfo.status == 1"  @click="gopage(5)">
				      <view class="bottom-item" style="background-color:rgb(114,124,245);color: #fff;">确认收款</view>
				   </view>
				   <view class="bottom"  v-if="orderInfo.status == 3"  @click="gopage(6)">
				      <view class="bottom-item" style="background-color:rgb(114,124,245);color: #fff;">确认收货</view>
				   </view>
				   <view class="bottom"  v-if="orderInfo.status == 4 || orderInfo.status == 7" :disabled="
					  orderInfo.packageType == 2 ||
					  orderInfo.packageType == 3 ||
					  orderInfo.packageType == 4"  @click="gopage(7)">
				      <view class="bottom-item"  style="background-color: rgb(114, 124, 245);color: #fff;">结算订单</view>
				   </view>
				   <view class="bottom"  :disabled="
					  orderInfo.packageType == 2 ||
					  orderInfo.packageType == 3 ||
					  orderInfo.packageType == 4
					" v-if="orderInfo.status == 4 || orderInfo.status == 7"  @click="gopage(8)">
				      <view class="bottom-item" style="background-color: rgb(114, 124, 245);color: #fff;">续租订单</view>
				   </view>
				  </view>
			    </view>
			   </view>
			  </view>
			  <div class="tits"><text class="shu"></text>产品清单</div>
			  <view  scroll-y  class="list">
			      <view class="null_s" v-if="!(orderInfo.mshoppingCarts&&orderInfo.mshoppingCarts.length)>0">
			        <image  class="null" src="../../static/images/img_null_bookbuilding.png" mode="widthFix"></image>
			        <view class="nText">暂无数据</view>
			      </view>
			      <view v-else >
			        <view v-for="(item,index) in orderInfo.mshoppingCarts"   :key="index"  class="list_item">
			        <view class="h_item">
			          <view class="block">
					  <view class="price">
						  <view>产品名称: {{item.commodityName}} </view>
						  <view style="color:#727cf5;">￥{{item.price}}</view>
					  </view>
			  		 
					  <view>产品编号: {{item.deviceId}} </view>
					  <view>服务时间: <text v-if="item.beginTime||item.endTime">{{item.beginTime}} ~ {{item.endTime}}</text></view>
					  <view class="price">
						  <view>{{item.quantity}}{{isbillingType(item.billingType)}}</view>
						  <view v-if="item.categoryType == '租赁类'? (orderInfo.status == 2 || orderInfo.status == 3 ||orderInfo.status == 4) &&item.equipmentId : item.categoryType == '耗材类'
                      ? orderInfo.status == 2 && item.equipmentId: 0 " style="color:#727cf5;"  @click="handleClick(item)">
					  <!-- <picker class="listItm" @change="sexChange"   :value="index1" :range="equipList" range-key="deviceId"> -->
					  更换设备
					 <!-- </picker> -->
					  </view>
					  <view v-else-if="(orderInfo.status == 2 ||orderInfo.status == 3 ||orderInfo.status == 4) &&!item.equipmentId && (item.categoryType == '租赁类' ||item.categoryType == '耗材类')"
					    style="color:#727cf5;"  @click="handleClick(item)">  
						 <!-- <picker class="listItm" @change="sexChange"  :value="index1" :range="equipList" range-key="deviceId"> -->
						  选择设备
						 <!-- </picker> -->
					 </view>
					  </view>
			          </view>
			        </view>
			        <view style="height:30rpx;"></view>
			      <!--  <view class="btns">
			         <view class="b_item"   :data-id="item.id" @tap="detail">
			            <image class="w_30" src="../../static/images/finish.png" mode="widthFix"></image>
			            <view >订单详情</view>
			         </view>
			        </view> -->
			      </view>
			     </view>
			    </view>
			<view style="height:30px;"></view>
		</view>
</template>

<script>
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
	export default {
		components: {
				},
	    data() {
	        return {
				index1:"",
	            active: 0,
				valuetime:[],
				startTimeA:'',
				endTimeA:'',
				orderInfo:{},
				equipList:[],
			    listQuery: {
					pageNum: 1,
					pageSize: 1000,
					mobile: "",
					number: "",
					orderName: "",
					userName: "",
					paymentType: "",
				  },
				   dic: {
				          // 字典数据
				          pay: [],
				          pick: [],
				          status: [],
				        },
				 querryEq: {
				        status: 1,
				        commodityName: null,
				        objectId: null,
				        deviceId: null,
				      },
				billingType: [
				        { val: 1, name: "天" },
				        { val: 2, name: "月" },
				        { val: 3, name: "次" },
				        { val: 4, name: "件" }
				      ],
	            itemslist: [  { val: 0, display_name: "产品清单",total:0 },
							  { val: 1, display_name: "基本信息",total:0 },
							  { val: 2, display_name: "费用详情",total:0 },
							  { val: 3, display_name: "收货地址",total:0},
							  { val: 4, display_name: "物流信息",total:0},]
							
	        };
	    },
			
		onLoad(option){
			// this.preId = option.id
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
				this.getOrderListy();
				this.getDic();
	    },
		 filters: {
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
			 saveCheck(post) {
				 this.$ajaxs.post('/console/v1/shoppingCart/update',post).then((res) => {
			          if (res.content.statusCode == 201) {
						this.getOrderListy()
						this.$showToast('操作成功!')
			          } else {
						  this.$showToast(res.content.statusMessage)
			           
			          }
			        })
			        .catch((err) => {})
			    },
	       gitActive(e) {
	                   this.active = e.currentTarget.dataset.index;
					   this.getOrderListy()
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
			 handleClick(row) {
			      var status = 1;
				   this.querryEq.commodityName = row.commodityName,
			       this.querryEq.objectId = this.orderInfo.hospitalId,
				   this.querryEq.id = row.id
				   var data = JSON.stringify(this.querryEq)
					uni.navigateTo({
						url:"./equipment?params="+data
					})
			      // this.checkId = row.id
			    },
			isbillingType(value) {
			      for (var i = 0;i<this.billingType.length;i++) {
			        if (value == this.billingType[i].val) {
			          return this.billingType[i].name;
			        }
			      }
			    },
			detail(e){
				let id = e.currentTarget.dataset.id
				uni.navigateTo({
					url:"./orderDetail"
				})
				
			},
			gopage(val){
				var _this = this
				if(val==1){
					uni.navigateTo({
						url:"./costDetail"
					})
				}else if(val==2){
					uni.navigateTo({
						url:"./address"
					})
				}else if(val==3){
					uni.navigateTo({
						url:"./logistics"
					})
				}else if(val==4){
				var arrays = ''
				  if (_this.orderInfo.parentId) {
					arrays = '确认取消此订单吗?'
				  } else {
					arrays = '确认取消此订单吗?'
				  }
				  uni.showModal({
					  title: "提示",
					  content: arrays,
					  success(res) {
						  if (res.confirm) {
							var status = _this.orderInfo.status == 1 ? 8 : 6
							  var post = {}
							  if (status == 8) {
								post = {
								  status: status,
								  hospitalId: _this.orderInfo.hospitalId,
								  id: _this.orderInfo.id,
								  // operation: 1
								}
							  } else {
								post = {
								  status: status,
								  hospitalId: _this.orderInfo.hospitalId,
								  id: _this.orderInfo.id,
								  operation: 1,
								}
							  }
							  _this.saveStatus(post)
						   
						  } else if (res.cancel) {
							  // console.log('用户点击取消')
						  }
					  }
				  });
				}else if(val==5){
					 var status
					      if (
					        _this.orderInfo.packageType == 4 ||
					        _this.orderInfo.packageType == 3 ||
					        _this.orderInfo.packageType == 10
					      ) {
					        status = 4
					      } else {
					        status = 2
					      }
					
					      var post = {
					        price: _this.orderInfo.price + '',
					        status: status + '',
					        hospitalId: _this.orderInfo.hospitalId + '',
					        id: _this.orderInfo.id + '',
					        // 收货地址
					        receiver: _this.orderInfo.receiver + '',
					        phone: _this.orderInfo.phone + '',
					        typeOrder: _this.orderInfo.typeOrder + '',
					        address: _this.orderInfo.address + '',
					        paymentType: _this.orderInfo.paymentType + '',
					      }
					      var way = false
					      if (_this.orderInfo.typeOrder == 0 || _this.orderInfo.typeOrder == 1) {
					        way = true
					      }
					uni.showModal({
					    title: "提示",
					    content: "请确定实付金额与应付金额是否无误?",
					    success(res) {
					        if (res.confirm) {
								if (post.address) {
									if (post.paymentType) {
									  if (post.price) {
										_this.saveStatus(post)
									  }
									} else {
									  _this.$showToast("请选择支付方式");
									}
								  } else {
									  _this.$showToast("请完善收货地址");
								  }
					         
					        } else if (res.cancel) {
					            // console.log('用户点击取消')
					        }
					    }
					});
				}else if(val==6){
					var status
					      status = 4
					      var post = {
					        status: status,
					        hospitalId: _this.orderInfo.hospitalId,
					        id: _this.orderInfo.id,
					      }
						  uni.showModal({
						      title: "提示",
						      content: "确认收货?",
						      success(res) {
						          if (res.confirm) {
						  			 _this.saveStatus(post)
						           
						          } else if (res.cancel) {
						              // console.log('用户点击取消')
						          }
						      }
						  });
					   
				}else if(val==7){
					uni.showModal({
					    title: "提示",
					    content: "请确定设备已归还?",
					    success(res) {
					        if (res.confirm) {
								 var status = 5
								      var post = {
								        operation: 3,
								        status: status,
								        hospitalId: _this.orderInfo.hospitalId,
								        id: _this.orderInfo.id,
								      }
								      post.equipmentDescription = _this.formRolesDes.equipmentDescription || ''
								      _this.saveStatus(post)
					         
					        } else if (res.cancel) {
					            // console.log('用户点击取消')
					        }
					    }
					});
					}else if(val==8){
					 var endtime = ''
					      if (_this.orderInfo.mshoppingCarts) {
					        for (var i = 0; i < _this.orderInfo.mshoppingCarts.length; i++) {
					          if (_this.orderInfo.mshoppingCarts[i].endTime) {
					            endtime = _this.orderInfo.mshoppingCarts[i].endTime
					          }
					        }
					      }
					      var dayEnd = new Date(endtime)
					      var nowDay = new Date()
					      var daylate = (nowDay - dayEnd) / (1000 * 60 * 60 * 24)
					      if (daylate - 5 > 0) {
							  _this.$showToast("该订单逾期超过5天，不可续租");
					      } else {
							     console.log(_this.orderInfo.userId,"565656")
								 uni.setStorage({
								 		//存储到本地
								 		key: "userId",
								 		data: _this.orderInfo.userId
								 	});
								 uni.setStorage({
								 		//存储到本地
								 		key: "packageId",
								 		data: _this.orderInfo.packageId
								 	});
							  uni.navigateTo({
							  	url:"./renewalss"
							  })
					        
					      }	
					}
			},
			saveStatus(data){
				var _this = this
				_this.$ajaxs
				    .post("/console/v1/order/save", data)
				    .then(res => {
				        if (res.status == 200) {
							_this.getOrderListy()
							this.$showToast("保存成功");
				        } else {
							this.$showToast("保存失败");
				        }
				    })
				    .catch(() => {});
			},
		   getOrderListy() {
		        this.$ajaxs.get('/console/v1/order/get?id='+uni.getStorageSync('orderId'))
		          .then((res) => {
		            if (res.status == 200) {
		              this.orderInfo = res.content;
		            } else {
		              this.$showToast("请检查网络 ~ ");
		            }
		          })
		          .catch((err) => {
		          });
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
page{
		height: 100%;
		background-color: #f3f3f3;
	}
	.shu {
	  width: 4px;
	  height: 16px;
	  background: #727cf5;
	  display: block;
	  margin-right: 10px;
	  border-radius: 6px;
	}
	.tits {
	  display: flex;
	  align-items: center;
	  line-height: 22px;
	  font-weight: bold;
	  font-size: 16px;
	  color: #333333;
	  padding: 15px 10px;
	}
	.nav {
	  /* width: 375px; */
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
	  height: 54px;
	  margin-left: 17px;
	  margin-right: 17px;
	  word-break: keep-all;
	  white-space: nowrap;
	  line-height: 54px;
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
	 margin-bottom: 35rpx;
	 background:#fff;
	 border-radius: 16rpx;
	
	}
	.list .list_item .header1{
	  display: flex;
	  justify-content: space-between;
	  padding: 0 30rpx;
	  height: 84rpx;
	  line-height: 84rpx;
	  background: rgb(211,230,255);
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
	  width: 90%;
	  padding: 25rpx 30rpx 0 30rpx;
	  display: flex;
	}
	.h_item .block{
	  width: 100%;
	  font-size: 28rpx;
	  line-height: 40rpx;
	  overflow: hidden;
	}
	.h_item .remarks{
	  width: 90%;
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
		
	.price{
		display: flex;
		width: 100%;
		justify-content: space-between;
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
	.btns-bottom{
		/* border-top: 2rpx solid #D5D5D5; */
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 20rpx;
		text-align: center;
		color: #727cf5;
		display: flex;
		justify-content: flex-end;
	}
	.bottom{
		width: 24%;
	}
	.bottom-item{
		    width: 90%;
		    border: 1px solid #727cf5;
		    line-height: 2rem;
		    border-radius: 24px;
			margin-top: 8px;
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
	
</style>
