<template>
	<view class="contents">
		<uni-search-bar class="search" :radius="24" @confirm="search" cancelButton="false" bgColor="#FFFFFF" placeholder="搜索"></uni-search-bar>
		<view class="content">
			<ly-tree :tree-data="dataAll" :props="defaultProps" ref="tree" node-key="id"  :defaultExpandAll="true" :show-radio="true" checkOnClickNode @node-click="handleNodeClick"
			 @radio-change="handleRadioChange">
			</ly-tree>
		</view>
		<div class="btn">
		    <div class="saveBtn" @click="saveInf()" >
		        <span>保存</span>
		    </div>
		</div>
	</view>
</template>

<script>
	import LyTree from '../../components/ly-tree/ly-tree.vue'
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	export default {
		components: {
			uniSearchBar,
			LyTree
		},

		data() {
			return {
				obj:{},
				defaultArray:[],
				querryEq: {
				       status: 1,
				       commodityName: null,
				       objectId: null,
				       deviceId: null,
				     },
				dataAll: [],
				defaultProps: {
					// children: 'children',
					label: 'deviceId'
				}
			};
		},
		onShow() {
			// this.defaultArray = uni.getStorageSync('defaultArray')||[]
			let data= {
				status: 1,
				commodityName: this.querryEq.commodityName,
				objectId: this.querryEq.objectId,
				deviceId: this.querryEq.deviceId,
			}
			this.getDateAll(data);

		},
		onLoad(option){
			this.querryEq = JSON.parse(option.params)
			
		},
		methods: {
			
			getDateAll(obj) {
			  // 获取设备列表
			  this.$ajaxs
			    .get("/console/v1/equipment/getList", obj)
			    .then((res) => {
			      if (res.status == 200) {
			        this.dataAll = res.content
					console.log(this.dataAll,"this.dataAllthis.dataAll")
			      } else {
					  this.$showToast("操作失败")
			      }
			    })
			    .catch(() => {})
			},
			saveInf() {
			    var post = {
			      id: this.querryEq.id,
			      equipmentId: this.obj.id,
			    }
			    var data = {
			      commodityId: this.obj.commodityId,
			    }
			    console.log(this.obj,'rowrow');
			    this.$ajaxs.get('/console/v1/category/getCategoryByCommodityId',data).then((res) => {
			         if (res.status == 200) {
			           var flag = false
			           if (res.content.name == '耗材类') {
			             this.saveCheck(post)
			           } else {
			             if (this.obj.deviceId) {
			               this.saveCheck(post)
			             } else {
			    			this.$showToast('该设备无设备编号，不可选择 ！')
			             }
			           }
					   uni.navigateBack({
					       delta: 1
					   });
			         } else {
			    		this.$showToast('请检查网络 ~ ')
			           
			         }
			       })
			       .catch(() => {})
			},
			search(e, val) {
				console.log(e, "val");
				this.querryEq.deviceId = e.value;
				let data= {
					status: 1,
					commodityName: this.querryEq.commodityName,
					objectId: this.querryEq.objectId,
					deviceId: this.querryEq.deviceId,
				}
				this.getDateAll(data);
			},
			handleRadioChange(obj) {
				this.$refs.tree.getCheckedNodes(),
				this.obj = obj.data
				this.defaultArray = []
				this.defaultArray.push(obj.data.id)
				uni.setStorage({
						//存储到本地
						key: "defaultArray",
						data: this.defaultArray
					});
			},
			saveCheck(post) {
				 console.log(post,'postpostpost');
				this.$ajaxs.post('/console/v1/shoppingCart/update',post).then((res) => {
			         if (res.content.statusCode == 201) {
						// this.getOrderListy()
						this.$showToast('操作成功!')
			         } else {
						this.$showToast(res.content.statusMessage)
			          
			         }
			       })
			       .catch((err) => {})
			   },
			handleNodeClick(obj) {
				// console.log('handleNodeClick', JSON.stringify(obj));
				// console.log('getNodePath', this.$refs.tree.getNodePath(obj.data));
			}
		}

	}

	// }
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		display: flex;
		flex-direction: column;
		background: rgba(255, 255, 255, 1);

		.content-item-1 {
			border-bottom: 1rpx solid red;
			margin-top: 1rpx;

		}
	}
	/deep/.uni-searchbar[data-v-64ee3838] {
	    top:0;
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
	.search {
		// padding: 0rpx 20rpx;
		background-color: #f3f3f3;

	}
</style>

