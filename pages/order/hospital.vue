<template>
	<view class="contents">
		<!-- <uni-search-bar class="search" :radius="24" @confirm="search" cancelButton="auto" bgColor="#FFFFFF" placeholder="搜索类型"></uni-search-bar> -->
		<view class="content">
			<ly-tree :tree-data="dataAll" :props="defaultProps" ref="tree" node-key="id" :defaultExpandAll="true" :show-radio="true" checkOnClickNode @node-click="handleNodeClick"
			 @radio-change="handleRadioChange">
			</ly-tree>
		</view>
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
				dataAll: [],
				defaultProps: {
					// children: 'children',
					label: 'name'
				}
			};
		},
		onShow() {
			this.getDateAll();

		},
		methods: {
			getDateAll() {
				this.dataAll = [];
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				let data = {
					menuId: "272465836609122304",
					name:"" ,
					pageNum: 1,
					pageSize: 1000,
					totalElements: 0,
					hospitalType:"" ,
					areaId: prevPage.areaId,
					status: 1,
					
				}
				this.$ajaxs.get('/console/v1/hospital/getAccessibleList',data).then(res => {
						this.dataAll = res.content.list;
				}).catch(e => {

				})
			},
			search(e, val) {
				console.log(e, val);
				this['val' + val] = e;
			},
			handleRadioChange(obj) {
				console.log('handleNodeClick', obj);
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				console.log(prevPage,"prevPageprevPage")
				prevPage.hospitalId = obj.data.id;
				console.log(prevPage.hospitalId,"prevPageprevPageprevPageprevPage")
				prevPage.hospitalName =obj.data.name;
				uni.navigateBack({
				    delta: 1
				});
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
	.search {
		// padding: 0rpx 20rpx;
		background-color: #F5F7FB;

	}
</style>
