<template>
    <div>
        <div class="my">
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">订单号</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
                                placeholder-style="color: #999;"
                                class="inputStyle"
								 :disabled="true"
                                placeholder="请填写"
                                v-model="orderInfo.number"
                            />
                        </span>
                    </div>
                </div>
            </div>
			<picker class="listItm" @change="sexChange"  :value="index1" :range="pay" range-key="name">
			    <div class="listFlex main">
			        <div class="listLeft">支付方式</div>
			        <div class="listRight" v-if="paymentType">
			            <span class="listCheckT">{{orderInfo.paymentType|payWay}}</span>
			            <span class="weui-cell__ft_in-access"></span>
			        </div>
			        <div class="listRight" v-else>
			            <span class="listCheckT">请选择{{paymentType}}</span>
			            <span class="weui-cell__ft_in-access"></span>
			        </div>
			    </div>
			</picker>
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">应付金额</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
								:disabled="true"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                placeholder="请填写"
                                v-model.trim="orderInfo.payable"
                            />
                        </span>
                    </div>
                </div>
            </div>
          <div class="listItm">
              <div class="listFlex main">
                  <div class="listLeft">实付金额</div>
                  <div class="listRight">
                      <span class="listCheckT">
                          <input
                              type="text"
                              placeholder-style="color: #999;"
                              class="inputStyle"
                              placeholder="请填写"
                              v-model.trim="orderInfo.price"
                          />
                      </span>
                  </div>
              </div>
          </div>
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">备注</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                placeholder="请填写"
                                v-model="orderInfo.description"
                            />
                        </span>
                    </div>
                </div>
            </div>
            <div class="btn">
                <div class="saveBtn" @click="saveInf()">
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
	]
import { selectOption } from "@/utils/selectOption";
export default {
    name: "",
    data() {
        return {
            index1: null,
			orderInfo:{},
			paymentType:"",
			pay: [],
        };
    },
    onShow() {
        this.getInf();
		this.getDic()
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
	},
    methods: {
        sexChange(e) {
			if(this.paymentType != 3){
				return this.$showToast("当前数据不符合修改条件");
				
			}
            this.index1 = e.target.value;
            this.paymentType = this.pay[this.index1].value;
			console.log(this.paymentType,"this.paymentType")
        },
        getInf() {
             this.$ajaxs.get('/console/v1/order/get?id='+uni.getStorageSync('orderId'))
               .then((res) => {
                 if (res.status == 200) {
                   this.orderInfo = res.content;
				    this.orderInfo.paymentType = this.orderInfo.paymentType + ''
				   if (this.orderInfo.paymentType == 'null') {
					 this.orderInfo.paymentType = '3'
					 this.orderInfo.price = this.orderInfo.payable
				   }
				   this.paymentType = this.orderInfo.paymentType
				   console.log(this.paymentType,"this.paymentTypethis.paymentTypethis.paymentType")
                 } else {
                   this.$showToast("请检查网络 ~ ");
                 }
               })
               .catch((err) => {
               });
           },
        saveInf() {
            var _this = this;
			if(!this.paymentType){
				return this.$showToast("请选择支付方式");
			}
			if(!this.orderInfo.price){
				return this.$showToast("请输入实付金额");
			}
			let data = {
				description: this.orderInfo.description,
				hospitalId: this.orderInfo.hospitalId,
				id: this.orderInfo.id,
				paymentType: this.paymentType,
				price: this.orderInfo.price,
				status: this.orderInfo.status
			}
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
    bottom: 100upx;
    left: 0px;
    margin-top: 80upx;
    width: 100%;
    height: 128upx;
    background: #fff;
    display: flex;
    justify-content: space-between;
}
.saveBtn {
    height: 80upx;
    width: 100%;
    text-align: center;
    line-height: 80upx;
    border: 1px solid #727cf5;
    border-radius: 40upx;
    color: #727cf5;
    font-size: 32upx;
    background: #fff;
    margin: 0 40upx;
}
.weui-cell__ft_in-access {
    padding-right: 26upx;
    position: relative;
}
.weui-cell__ft_in-access:after {
    content: " ";
    display: inline-block;
    height: 12upx;
    width: 12upx;
    border-width: 4upx 4upx 0 0;
    border-color: #999;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -4upx;
    position: absolute;
    top: 50%;
    margin-top: -4upx;
    right: 4upx;
}
.main {
    width: 86%;
    margin: 0 auto;
}
</style>


