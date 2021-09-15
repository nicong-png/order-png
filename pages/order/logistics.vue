<template>
    <div>
        <div class="my">
            <div class="listItm">
                <div class="listFlex main">
                    <div class="listLeft">物流单号</div>
                    <div class="listRight">
                        <span class="listCheckT">
                            <input
                                type="text"
                                placeholder-style="color: #999;"
                                class="inputStyle"
                                placeholder="请填写"
                                v-model="orderInfo.logisticsNumber"
                            />
                        </span>
                    </div>
                </div>
            </div>
			<picker class="listItm" @change="sexChange"  :value="index1" :range="express" range-key="name">
			    <div class="listFlex main">
			        <div class="listLeft">物流公司</div>
			        <div class="listRight" v-if="orderInfo.logisticsVendor">
			            <span class="listCheckT">{{orderInfo.logisticsVendor|filterWuliu}}</span>
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
                    <div class="listLeft">物流信息</div>
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
                <div class="saveBtn" v-if="orderInfo.status == 2" @click="saveInf()">
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
	const express = [
	  { name: '顺丰速运', value: 'shunfeng' },
	  { name: '百世汇通', value: 'huitongkuaidi' },
	  { name: '中通快递', value: 'zhongtong' },
	  { name: '申通快递', value: 'shentong' },
	  { name: '圆通速递', value: 'yuantong' },
	  { name: '国通快递', value: 'guotongkuaidi' },
	  { name: '韵达速递', value: 'yunda' },
	  { name: '增益速递', value: 'zengyisudi' },
	  { name: '邮政快递包裹', value: 'youzhengguonei' },
	  { name: '邮政快递国际包裹', value: 'youzhengguoji' },
	  { name: 'EMS', value: 'ems' },
	  { name: 'EMS-国际件', value: 'emsguoji' },
	  { name: '天天快递', value: 'tiantian' },
	  { name: '德邦快递', value: 'debangwuliu' },
	  { name: '宅急送', value: 'zhaijisong' },
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
			logistics:[],
			express: [
			        { name: '顺丰速运', value: 'shunfeng' },
			        { name: '百世汇通', value: 'huitongkuaidi' },
			        { name: '中通快递', value: 'zhongtong' },
			        { name: '申通快递', value: 'shentong' },
			        { name: '圆通速递', value: 'yuantong' },
			        { name: '国通快递', value: 'guotongkuaidi' },
			        { name: '韵达速递', value: 'yunda' },
			        { name: '增益速递', value: 'zengyisudi' },
			        { name: '邮政快递包裹', value: 'youzhengguonei' },
			        { name: '邮政快递国际包裹', value: 'youzhengguoji' },
			        { name: 'EMS', value: 'ems' },
			        { name: 'EMS-国际件', value: 'emsguoji' },
			        { name: '天天快递', value: 'tiantian' },
			        { name: '德邦快递', value: 'debangwuliu' },
			        { name: '宅急送', value: 'zhaijisong' },
			      ],
        };
    },
    onShow() {
        this.getInf();
		this.getDic()
    },
	filters:{
		filterWuliu(status) {
		      if (status && status != ' ') {
		        const statusText = express.reduce((acc, cur) => {
		          if (cur.value == status) {
		            acc = cur.name
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
            this.orderInfo.logisticsVendor = this.express[this.index1].value;
			console.log(this.orderInfo.logisticsVendor,"this.orderInfo.logisticsVendor")
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
		// 获取物流消息
		    getLogisticsD() {
		      if (this.orderInfo.logisticsNumber && this.orderInfo.logisticsVendor) {
		        var obj = {
		          logisticsNumber: this.orderInfo.logisticsNumber,
		          logisticsVendor: this.orderInfo.logisticsVendor,
		        }
		          _this.$ajaxs
		              .post("/console/v1/logistics/get", obj).then((res) => {
		            if (res.status == 200) {
		              var context = JSON.parse(res.content.context)
		              this.logistics = context.data
		            } else {
						this.$showToast("请检查网络");
		              
		            }
		          })
		          .catch()
		      }
		    },
        saveInf() {
			if(!this.orderInfo.logisticsNumber){
				return this.$showToast("请输入订单编号");
			}
			if(!this.orderInfo.logisticsVendor){
				return this.$showToast("请选择物流公司");
			}
			let data = {
				logisticsNumber: this.orderInfo.logisticsNumber,
				logisticsVendor: this.orderInfo.logisticsVendor,
				hospitalId: this.orderInfo.hospitalId,
				id: this.orderInfo.id,
				status: this.orderInfo.status
			}
			this.save(data)
     
        },
		// 保存
		save(post) {
		    this.$ajaxs.post("/console/v1/order/save", post).then((res) => {
			  if (res.status == 200) {
				if (res.content.statusCode == 201) {
					this.$showToast('操作成功');
					uni.navigateBack({
								delta: 1
							});
				} else {
					this.$showToast("保存失败");
				}
			  }
			})
			.catch((err) => {})
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
		/* height: calc(100vh - 120rpx); */
		/* overflow: hidden; */
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



