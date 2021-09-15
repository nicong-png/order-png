<template>
	<view class="order">
			<div class="tits"><text class="shu"></text>商品套餐</div>
			<view  scroll-y  class="list">
			    <view class="null_s" v-if="!orderInfo">
			      <image  class="null" src="../../static/images/img_null_bookbuilding.png" mode="widthFix"></image>
			      <view class="nText">暂无数据</view>
			    </view>
			    <view v-else >
					  <uni-collapse  v-model="index3" :accordion="true">
					   <view class="list_item" v-for="(item,index) in orderInfo" @click.stop="changeCollapse(item)" :key="index">
					  	<uni-collapse-item 
					  		:title="item.name+(item.packageType==1?'  租赁套餐': item.packageType==2?'  售卖套餐': item.packageType==4?'  体验套餐':'  虚拟套餐' )"  
					  		class="color20"
					  		:show-animation="true"
							:open="false"
							:name="index"
							>
					  		<view v-for="(project, i) in data5" :key="i" class="list uni-inline-item" >
					  			<view class="middle uni-column flex1">
					  				<view class="uni-row" >
					  					<view class="top-left " @click.stop="">
					  						<radio-group style="margin-bottom: 10px;"  v-if="project.actions[0].checkType==1" @change="radioChange(data,idx)"  :value="project.id" v-for="(data,idx) in project.actions" :key="idx"> 
												<view class="" style="height: 17px;align-items: center;font-size: 20rpx;width: 100%;display: flex;">
													<radio :value="data.id" :checked="current==data.id"/>
													<view style="width: 40%;" class="mr20 uni-ellipsis name">{{data.commodityName}}</view>
													<view style="width: 10%;" class="mr20 uni-ellipsis name">{{data.quantity}}</view>
													<view class=" mr20 uni-ellipsis name">{{isbillingType(data.billingType)}}</view>
													<view class=" mr20 uni-ellipsis name">{{data.price}}</view>
													<view class=" mr20 uni-ellipsis name">{{data.overdue}}</view>
												</view>
												<view class="" style="margin-left: 30px;font-size: 20rpx;width: 100%;display: flex;" v-if="data.children" v-for="(row, val) in data.children" :key="val+idx">
													<view class=" mr20 uni-ellipsis name">{{row.commodityName}}</view>
													<view class=" mr20 uni-ellipsis name">{{row.quantity}}</view>
													<view class=" mr20 uni-ellipsis name">{{isbillingType(row.billingType)}}</view>
													<view class=" mr20 uni-ellipsis name">{{row.price}}</view>
													<view class=" mr20 uni-ellipsis name">{{row.overdue}}</view>
												</view>
											</radio-group>
											<checkbox-group  style="margin-bottom: 10px;"   v-if="project.actions[0].checkType==3||project.actions[0].checkType==0||project.actions[0].checkType==2" @change="checkboxChange(data,idx)" v-for="(data,idx) in project.actions" :key="idx"> 
												<view class="" style="height: 17px; align-items: center;font-size: 20rpx;width: 100%;display: flex;">
													<checkbox :value="data.id" :disabled="project.actions[0].checkType==0" :checked="data.checked"/>
													<view style="width: 40%;" class="mr20 uni-ellipsis name">{{data.commodityName}}</view>
													<view style="width: 10%;" class="mr20 uni-ellipsis name">{{data.quantity}}</view>
													<view class=" mr20 uni-ellipsis name">{{isbillingType(data.billingType)}}</view>
													<view class=" mr20 uni-ellipsis name">{{data.price}}</view>
													<view class=" mr20 uni-ellipsis name">{{data.overdue}}</view>
												</view>
												<view class="" style="margin-left: 30px;font-size: 20rpx;width: 100%;display: flex;" v-if="data.children" v-for="(row, val) in data.children" :key="val+idx">
													<view class=" mr20 uni-ellipsis name">{{row.commodityName}}</view>
													<view class=" mr20 uni-ellipsis name">{{row.quantity}}</view>
													<view class=" mr20 uni-ellipsis name">{{isbillingType(row.billingType)}}</view>
													<view class=" mr20 uni-ellipsis name">{{row.price}}</view>
													<view class=" mr20 uni-ellipsis name">{{row.overdue}}</view>
												</view>
											</checkbox-group>
											
					  					</view>
					  				</view>
					  			</view>
					  		</view>
					  	</uni-collapse-item>
						 </view>
					  </uni-collapse>
			   
			   </view>
			   <picker mode="selector" :range="pregnant" :value="index1" @change="userChange" range-key="userName">
			      <view class="item_right">
			        <text :style="{color:userName?'#333':'#ccc'}">{{userName||"请选择用户"}}</text>
			        <image src="../../static/images/xjtg.png"></image>
			      </view>
			    </picker>
			  </view>
			  <view style="height:100rpx;"></view>
			  <view class="btn_s">
					<view class="btn_t" @click='saveInf(1)' >添加购物车</view>
					<view class="btn_t b_sa" @click='saveInf(2)' >去付款</view>
			  </view>
		</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import { selectOption } from "@/utils/selectOption";
	export default {
		components: {
					uniCollapse,
					uniCollapseItem
				},
	    data() {
	        return {
				index3:'1',
				value1:"",
				userName:"",
				userId:"",
	            index1: "",
				valuetime:[],
				packageHospitalList:[],
				startTimeA:'',
				endTimeA:'',
				orderInfo:[],
				myus:[],
				pregnant:[],
				ischeckType:[],//多选
				data5:[],
				hospitalId:"",
				hospitalName:"",
				areaName:"",
				areaId:"",
				current:"",
			    listQuery: {
					pageNum: 1,
					pageSize: 1000,
					hospitalId: "",
					isHospital: 1,
				
				  },
				   dic: {
				          // 字典数据
				          pay: [],
				          pick: [],
				          status: [],
				        },
	            billingType: [
	                    { val: 1, name: "天" },
	                    { val: 2, name: "月" },
	                    { val: 3, name: "次" },
	                    { val: 4, name: "件" }
	                  ],
							
	        };
	    },
		 
		onLoad(option){
			console.log(option,"lllllllllllll")
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
				 this.getUserList()
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
		  },
	    methods: {
		   del(e){
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
			isbillingType(value) {
			      for (var i = 0;i<this.billingType.length;i++) {
			        if (value == this.billingType[i].val) {
			          return this.billingType[i].name;
			        }
			      }
			    },
			
			radioChange(item,index){
				for (let i = 0; i < this.data5.length; i++) {
					for (let j = 0; j < this.data5[i].actions.length; j++) {
							if (this.data5[i].actions[j].id == item.id) {
								this.current = item.id;
							}
						}
						
					}
			},
			checkboxChange(item,index){
					for (let i = 0; i < this.data5.length; i++) {
						for (let j = 0; j < this.data5[i].actions.length; j++) {
								if ((this.data5[i].actions[j].id == item.id)&&!this.data5[i].actions[j].checked) {
									this.data5[i].actions[j].checked = true
								}else if((item.id==this.data5[i].actions[j].id)&&this.data5[i].actions[j].checked){
									this.data5[i].actions[j].checked = false
								}
							
						}
					}
					
			},
			userChange(e){
				this.index1 = e.target.value;
				this.userId = this.pregnant[this.index1].userId;
				this.userName = this.pregnant[this.index1].userName;
					console.log(e,"eeeeeeeee")
			},
			detail(e){
				console.log(e,"eeeeeee")
				let id = e.currentTarget.dataset.id
				uni.navigateTo({
					url:"./orderDetail"
				})
				
			},
			getNewArray(data) {
			      var _this = this;
			      var newdate = [];
			      for (var i =0;i< this.myus.length;i++) {
			        var sdate = {
			          actions: [],
			          ischeckType: []
			        };
			        for (var s = 0;s< data.length;s++) {
			          if (this.myus[i] == data[s].number) {
			            sdate.actions.push(data[s]);
			            if (data[s].checkType == 2) {
			              // sdate.ischeckType.push(data[s].id);
			            } else if (data[s].checkType == 1) {
			              sdate.ischeckType = data[s].id;
						  this.current = data[s].id;
			            } else if (data[s].checkType == 3) {
			              // sdate.ischeckType.push(data[s].id);
			            } else if (data[s].checkType == 0) {
							data[s].checked = true
			              sdate.ischeckType.push(data[s].id);
			            }
			          }
			        }
			        if(sdate.actions.length>0){
			          newdate.push(sdate);
			        }
			      }
			      for (let index = 0; index < newdate.length; index++) {
			        const element = newdate[index].actions;
			         element.sort(_this.compare("quantity"));
			      }
			      return newdate;
			    },
			    //得到颜色
			    colorda(color) {
			      for (var i = 0; i < this.myus.length; i++) {
			        if (color == this.myus[i]) {
			          return i ? (i % 2 ? "1" : "2") : "2";
			        }
			      }
			    },
			    //数组颜色处理
			    colorGrouping(data) {
			      console.log(data,"datadatadatadatadatadata")
			      var _this = this;
			      var s = data.sort(_this.compare("number"));
			      var date = [];
			      for (var i=0;i<s.length;i++) {
			        if(s[i].number){
			           date.push(s[i].number);
			        }
			      }
			      _this.myus = _this.uniq(date);
			       console.log(_this.myus,"_this.myus_this.myus")
			      console.log(s,"SSSSSSSSSSSSSSSSSSSSSS")
			      return s;
			    },
			    //数组去重
			    uniq(array) {
			      var temp = [];
			      for (var i = 0; i < array.length; i++) {
			        if (array.indexOf(array[i]) == i) {
			          temp.push(array[i]);
			        }
			      }
			      return temp;
			    },
			    //排序方法
			    compare(property) {
			      return function(a, b) {
			        var value1 = a[property];
			        var value2 = b[property];
			        return value1 - value2;
			      };
			    },
			saveInf(mybtn){
				 if(this.userId==''){
					return this.$showToast("请选择用户");
				    }
					var _this = this
					let data = []
					// return
					 for (var i = 0;i< _this.data5.length;i++) {
						  for (var j = 0;j< _this.data5[i].actions.length;j++) {
						 if((_this.current == _this.data5[i].actions[j].id)|| _this.data5[i].actions[j].checked){
							  var s = {
									 userId: _this.userId, //分配用户id
									 packageId: _this.data5[i].actions[j].packageId, // 套餐的id
									 commodityId: _this.data5[i].actions[j].commodityId, // 商品的id ,
									 packageHospitalId: _this.data5[i].actions[j].packageHospitalId, //医院配置的主键id
									 quantity: _this.data5[i].actions[j].quantity, //商品和服务购买数量 ,
									 price: _this.data5[i].actions[j].price, //: 服务、商品的价格只保存购买时的价格 ,
									 billingType: _this.data5[i].actions[j].billingType ,// 计费单位 1：天 2：月 3：次 ,
									 // status:0,
								   };
							data.push(s);
							if (_this.data5[i].actions[j].children) {
								 for (var ji = 0;ji<_this.data5[i].actions[j].children.length;ji++) {
								 var s = {
								   userId: _this.userId, //分配用户id
								   packageId: _this.data5[i].actions[j].children[ji].packageId, // 套餐的id
								   commodityId: _this.data5[i].actions[j].children[ji].commodityId, // 商品的id ,
								   packageHospitalId: _this.data5[i].actions[j].children[ji].packageHospitalId, //医院配置的主键id
								   quantity:  _this.data5[i].actions[j].children[ji].quantity, //商品和服务购买数量 ,
								   price:  _this.data5[i].actions[j].children[ji].price, //: 服务、商品的价格只保存购买时的价格 ,
								   billingType:  _this.data5[i].actions[j].children[ji].billingType ,// 计费单位 1：天 2：月 3：次 ,
								   // status:0,
								 };
								 data.push(s);
								 console.log(data,"kkkkkkk")
							   }
							 }
						 }
						 }
					
					 }
					  var shop = data;
					       for(var i = 0;i<shop.length;i++){
					         shop[i].status = 0;
					       }
					       var tian = [] // 天数数据
					       for(var i = 0;i<shop.length;i++) {
					         if(shop[i].billingType == 1){
					           tian.push(shop[i].quantity)
					         }
					       }
					       // console.log(tian)
					       var flag = true
					       var first = tian[0]
					       // console.log(first)
					       for (var i = 0; i < tian.length; i++) {
					         if(first != tian[i]) {
					           flag = false
					         }
					       }
					   if(flag) {
					          if(shop.length < 1){
								  return  this.$showToast("请选择设备耗材");
					          }else{
					  console.log(shop,"dataaaaaaaaaaaaaaa")
					  let datas = JSON.stringify(shop)
					  // return
					_this.$ajaxs
					    .post("/console/v1/shoppingCart/save?json="+ encodeURI(datas))
					    .then(res => {
					        if (res.status == 200) {
								 if (res.content.statusCode == 201) {
									 if (mybtn == 1) {
										 this.$showToast("添加购物车成功");
										 uni.navigateTo({
										 	url:"./index"
										 })
									   }
									 if (mybtn == 2) {
										 _this.postorderSave(res.content);
									   }
							  }
					        } else {
								this.$showToast("操作失败");
					        }
					    })
					    .catch(() => {});
					}
				}else{
					  return  this.$showToast("请选择相同服务天数的设备");
				   
				      }
			},
			
			saveStatus(post) {
			      _this.$ajaxs
			          .post(`/console/v1/order/save?status=${post.status}&id=${post.id}`).then(res => {
			          if (res.content.statusCode == 201) {
			           this.$showToast("操作成功");
			          } else {
			             this.$showToast("操作失败");
			          }
			        })
			        .catch(err => {});
			    },
			 postorderSave(date) {
				 var _this = this
			    _this.$ajaxs
			        .post("/console/v1/order/saveForShoppingCart?status=1&salesId=&serialNumber="+date.serialNumber).then(res => {
			          var { status, content } = res;
			          if (status == "200") {
						  console.log(content,"oooooooooooooo")
			            if (content.statusCode == 201) {
							uni.navigateTo({
								url:"./index"
							})
			              if(content.packageType == 4){
							   console.log(content,"5565656")
			                var data={
			                  status: 4,
			                  id: content.orderId
			                }
			                _this.saveStatus(data)
			              }else{
			                if (mybtn == 1) {
			                  this.$showToast("操作失败");
			                }
			              }
						 
			            } else {
			              this.$showToast("操作成功");
						  
			            }
			            
			          } else {
						  this.$showToast("获取数据异常");
			          }
			        })
			        .catch(err => {});
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
			   console.log(uni.getStorageSync('hospitalId'),"hospitalId")
			   this.listQuery.hospitalId = uni.getStorageSync('hospitalId')
		        this.$ajaxs.get('/console/v1/packageHospital/getAllPackage',this.listQuery)
		          .then((res) => {
		            if (res.status == 200) {
		              this.orderInfo = res.content.list;
					  console.log( this.orderInfo ," this.orderInfo  this.orderInfo ")
		            } else {
		              this.$showToast("请检查网络 ~ ");
		            }
		          })
		          .catch((err) => {
		          });
		      },
			  getUserList(){
				  this.$ajaxs.get('/console/v1/relationship/getUserByHidOrName',{hospitalId:uni.getStorageSync('hospitalId')})
				    .then((res) => {
				      if (res.status == 200) {
				       this.pregnant = res.content.reverse();
				      } else {
				        this.$showToast("请检查网络 ~ ");
				      }
				    })
				    .catch((err) => {
				    });
			  },
			  changeCollapse(item){
				  console.log(item,"kkkkkkkkkkkkkk")
				  this.activeid = item.id
				  this.getChildList(item.id);
				 
			  },
			  getChildList(packageId) {
				  var data = {
				          packageId: packageId,
				          hospitalId:uni.getStorageSync('hospitalId')
				        };
			       this.$ajaxs.get('/console/v1/packageHospital/getAll',data)
			         .then((res) => {
			           if (res.status == 200) {
						 this.data5 =[];
						 this.data5 = this.getNewArray(this.colorGrouping(res.content));
						 console.log( this.data5," _this.data5 _this.data5 _this.data5")
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
	.uni-row{
		margin-bottom: 30rpx;
	}
	.mr20{
		width: 15%;
		text-align: left;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.mr20:nth-child(1){
		width: 40%;
	}
	.mr20:nth-child(2){
		width: 10%;
	}
	.uni-collapse-cell--open[data-v-8f47561c] {
	    background-color: #FFFFFF!important;
		border: none;
	}
	/deep/.uni-collapse-cell__title-text[data-v-8f47561c] {
	    font-size: 17px!important;
	}	
	.uni-collapse-cell{
		border: none;
	}
	/deep/.uni-collapse[data-v-62f04c78] {
	    background-color:#F3F3F3!important;
	}
	/deep/.uni-collapse-cell__title[data-v-8f47561c] {
	    padding: 10px 0px;
	 
	}
	/deep/.uni-checkbox-input{
	    width: 16px!important;
	    height: 16px!important;
	}
	/deep/.uni-radio-input{
	    width: 16px!important;
	    height: 16px!important;
	}
	 .list{
	  width: 90%;
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
	 margin-bottom: 12rpx;
	 background:#fff;
	 border-radius: 16rpx;
	 padding: 0 20px;
	
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
	.price{
		display: flex;
		width: 100%;
		justify-content: space-between;
	}
	
	
</style>
<style scoped>
.uni-inline-item{
	    border: 1px solid #b8bdfa;
	    padding: 10px 10px 0 10px;
		margin-bottom: 15px;
}
 .btn_s{
        width:100%;
        display: flex;
        align-items: center;
        border-top: 1px solid #ddd;
		position: fixed;
		  bottom: 0px;
		  left: 0px;
		  margin-top: 20px;
       
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

.item_right {
  width: 100%;
  height: 90upx;
  border-radius: 12rpx;
  /* border: 2rpx solid #ccc; */
  line-height: 90upx;
  text-align: center;
  font-size: 32rpx;
  color: #ccc;
  background-color: #fff;
  position: relative;
  margin: 20rpx auto;
  box-sizing: border-box;
}
.item_right image {
  width: 28rpx;
  height: 28rpx;
  float: right;
  position: absolute;
  right: 44rpx;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease 0s;
}
.saveBtn {
    height: 80rpx;
    width: 80%;
    text-align: center;
    line-height: 80rpx;
    border: 1px solid #727cf5;
    border-radius: 40upx;
    color: #727cf5;
    font-size: 32upx;
    background: #fff;
    margin: 0 auto;
    margin-bottom: 20px;
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
