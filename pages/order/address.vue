<template>
    <div>
        <div class="my">
           <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">收件人</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
                                placeholder-style="color: #999;"
                                class="inputStyle"
								 :disabled="true"
                                v-model="orderInfo.receiver"
                            />
                        </span>
                    </div>
                </div>
            </div>
	
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">联系电话</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
								:disabled="true"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                v-model.trim="orderInfo.phone"
                            />
                        </span>
                    </div>
                </div>
            </div>
			<picker class="listItm" @change="sexChange"  :value="index1" :range="typeList" range-key="display_name">
				<div class="listFlex main">
					<div class="listLeft">发货方式</div>
					<div class="listRight">
						<span class="listCheckT">{{orderInfo.typeOrder|filterWay}}</span>
						<span class="weui-cell__ft_in-access"></span>
					</div>
				</div>
			</picker>
		 <div class="listItm" v-if="orderInfo.typeOrder">
		     <div class="listFlex main">
		         <div class="listLeft">快递费</div>
		         <div class="listRight">
		             <span class="listCheckT">
		                 <input
		                     type="text"
		                     placeholder-style="color: #999;"
		                     class="inputStyle"
		                     placeholder="请填写"
							 @input="inputChange"
		                     v-model.trim="orderInfo.logisticsPrice"
		                 />
						  <!-- <span class="weui-cell__ft_in-access"></span> -->
		             </span>
					
		         </div>
		     </div>
		 </div>
          <div class="listItm" v-if="!orderInfo.typeOrder">
              <div class="listFlex main">
                  <div class="listLeft">地址</div>
                  <div class="listRight">
                      <span class="listCheckT">
                          <input
                              type="text"
							  :disabled="true"
                              placeholder-style="color: #999;"
                              class="inputStyle"
                              placeholder="请填写"
                              v-model.trim="orderInfo.hospitalName"
                          />
                      </span>
                  </div>
              </div>
          </div>
            <div class="listItm" v-else>
                <div class="listFlex main">
                    <div class="listLeft">地址</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
								:disabled="true"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                placeholder="请填写"
                                v-model="orderInfo.address"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div class="btn">
                <div class="saveBtn" @click="saveInf()" v-if="orderInfo.status == 1">
                    <span>保存</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
	const payOptions = [
	  { val: 1, display_name: '微信支付', style_name: 'info' },
	  { val: 2, display_name: '支付宝支付', style_name: 'info' },
	  { val: 3, display_name: '线下支付', style_name: 'info' },
	  { val: 4, display_name: '银行卡转账', style_name: 'info' },
	  { val: 5, display_name: '小程序支付', style_name: 'info' },
	];
	const statusOptions= [
	  // { val: false, display_name: '医院自取', style_name: 'info' },
	  // { val: true, display_name: '快递发货', style_name: 'info' },
	  { val: 0, display_name: '医院自取', style_name: 'info' },
	  { val: 1, display_name: '快递发货', style_name: 'info' },
	]
import { selectOption } from "@/utils/selectOption";
export default {
    name: "",
    data() {
        return {
            index1: null,
			orderInfo:{},
			hospitalAddress:{},
			paymentType:"",
			pay: [],
			typeList:statusOptions,
        };
    },
    onShow() {
        this.getInf();
		this.getDic();
    },
	filters:{
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
		filterWay(status) {
		      if (typeof status == 'boolean' || typeof status == 'number') {
		        const statusText = statusOptions.reduce((acc, cur) => {
		          if (cur.val == status) {
		            acc = cur.display_name
		          }
		          return acc
		        }, {})
		        return statusText
		      }
		      return ''
		    },
	},
    methods: {
        sexChange(e) {
            this.index1 = e.target.value;
            this.orderInfo.typeOrder = this.typeList[this.index1].val;
			console.log(this.orderInfo.typeOrder,"this.paymentType")
        },
		inputChange(e){
			this.orderInfo.logisticsPrice = this.validatepriceA(e.detail.value) 
		},
			validatepriceA(value) {
				console.log(value,"value")
			      var len = parseInt(value) + ''
			      const reg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
			      if (!reg.test(value)) {
			        this.$showToast('请输入正确的价格:整数或者保留两位小数');
					return 
			      } else if (len.length > 5) {
			        this.$showToast('小数点前不能超过5位!');
					return 
			      } else {
					  // this.orderInfo.logisticsPrice = value
			      }
			    },
		// 获取收货地址
		    getAddressList() {
				console.log(this.orderInfo,"this.orderInfothis.orderInfo")
		      var obj = {
		        id: this.orderInfo.hospitalId,
		      }
		      var obj1 = {
		        userId: this.orderInfo.userId,
		      }
		      if (this.orderInfo.hospitalId) {
		         this.$ajaxs.get('/console/v1/hospital/get',obj)
		          .then((res) => {
		            if (res.status == 200) {
		              this.hospitalAddress = res.content
		            } else {
		              this.$showToast("请检查网络 ~ ");
		            }
		          })
		          .catch((err) => {})
		      }
		
		        this.$ajaxs.get('/console/v1/address/getAll',obj1)
		        .then((res) => {
		          if (res.status == 200) {
		            this.userAddress = res.content
		            for (var i = 0; i < this.userAddress.length; i++) {
		              if (this.userAddress[i].isDefault == 1) {
		                this.defauleAddress = i - 0
		              }
		            }
		          } else {
		            this.$showToast("请检查网络 ~ ");
		          }
		        })
		        .catch((err) => {})
		    },
        getInf() {
             this.$ajaxs.get('/console/v1/order/get?id='+uni.getStorageSync('orderId'))
               .then((res) => {
                 if (res.status == 200) {
                   this.orderInfo = res.content;
				   console.log(this.orderInfo.typeOrder,"this.orderInfo.typeOrder")
				   if (this.orderInfo.typeOrder == null) {
						 this.orderInfo.typeOrder = 0
						 console.log(this.orderInfo.typeOrder,"this.orderInfo.typeOrder")
						 // this.orderInfo.address = this.$route.query.adressA
					   }
					 this.getAddressList()
                 } else {
                   this.$showToast("请检查网络 ~ ");
                 }
               })
               .catch((err) => {
               });
			  
           },
        saveInf() {
            var _this = this;
			if (this.userAddress && this.userAddress.length) {
			      } else {
					  return this.$showToast("无快递地址，不可修改发货方式！请添加收货地址 ");
			      }
			if(this.orderInfo.typeOrder==1&&!this.orderInfo.logisticsPrice){
				return this.$showToast("请填写快递费");
			}
			let post = {
				address: this.orderInfo.address,
				hospitalId: this.orderInfo.hospitalId,
				id:  this.orderInfo.id,
				logisticsPrice:  this.orderInfo.logisticsPrice,
				phone: this.orderInfo.phone,
				receiver: this.orderInfo.receiver,
				status: this.orderInfo.status,
				typeOrder: this.orderInfo.typeOrder,
			}
			var dates = {
			              id: '',
			              orderId: post.id,
			              price: post.logisticsPrice,
			              commodityId: '296267993762246656',
			            }
			            if (_this.orderInfo.mshoppingCarts) {
			              for (var i = 0; i < _this.orderInfo.mshoppingCarts.length; i++) {
			                if (
			                  _this.orderInfo.mshoppingCarts[i].commodityId ==
			                  '296267993762246656'
			                ) {
			                  dates.id = _this.orderInfo.mshoppingCarts[i].id
			                }
			              }
			            }
            _this.$ajaxs
                .post("/console/v1/order/saveShoppingCartForLogistic", dates)
                .then(res => {
                    if (res.status == 200) {
            			if (res.content.statusCode == 201) {
            				this.$showToast("保存成功");
            			} else {
            				this.$showToast(res.content.message);
            			}
            			
                    } else {
            			this.$showToast("保存失败");
                    }
                })
                .catch(() => {});
				this.save(post)
        },
		save(data){
			var _this = this;
			_this.$ajaxs
			    .post("/console/v1/order/save", data)
			    .then(res => {
			        if (res.status == 200) {
						this.$showToast("保存成功");
			           uni.navigateBack({
							delta: 1
						});
			        } else {
						this.$showToast("保存失败");
			        }
			    })
			    .catch(() => {});
		},
		getDic() {
		      // 获取字典数据
		      selectOption("订单支付方式")
		        .then((res) => {
		          console.log(res)
		          this.pay = res;
		        })
		        .catch((err) => {
		          console.log("订单支付方式");
		        });
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
		height: calc(100vh - 120rpx);
		overflow: auto;
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


