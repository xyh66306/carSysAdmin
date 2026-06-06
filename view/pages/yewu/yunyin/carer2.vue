<template>
	<view class="content">
		<!-- 搜索栏 (保持不变) -->
		<view class="search-bar">
			<input 
				class="search-input" 
				type="text" 
				v-model="keyword" 
				placeholder="搜索司机姓名或手机号" 
				@confirm="handleSearch"
			/>
			<view class="search-btn" @click="handleSearch">搜索</view>
		</view>

		<!-- 司机列表 -->
		<scroll-view scroll-y class="list-container" @scrolltolower="loadMore">
			<view v-if="loading && list.length === 0" class="loading-tip">加载中...</view>
			
			<view v-for="(item, index) in list" :key="item.id" class="carer-item">
				<!-- 头部：头像与基本信息 (保持不变) -->
				<view class="item-header">
					<image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
					<view class="info">
						<view class="name-row">
							<text class="nickname">{{ item.nickname }}</text>
							<text class="mobile">{{ item.mobile }}</text>
						</view>
						<!-- 注意：原代码中状态在头部，根据新需求，我们可以选择保留在此处或移动到底部。
							 通常状态属于司机当前属性，保留在头部或移动到底部均可。
							 这里为了配合“下面一栏放运费和状态”，我将状态标签从头部移除，移动到底部信息栏。 -->
					</view>
				</view>

				<!-- 行程与状态信息区域 (修改部分) -->
				<view class="trip-info">
					<!-- 第一排：始发地 -> 目的地 -->
					<view class="route-row">
						<text class="location start">{{ item.start_address || '未知始发地' }}</text>
						<text class="arrow">→</text>
						<text class="location end">{{ item.end_address || '未知目的地' }}</text>
					</view>

					<!-- 第二排：状态 和 运费 -->
					<view class="bottom-row">
						<view class="status-wrapper">
							<text class="label">状态：</text>
							<text class="status-tag" :class="'status-' + item.car_status">
								{{ getStatusText(item.car_status) }}
							</text>
						</view>
						<view class="fee-wrapper">
							<text class="label">运费：</text>
							<text class="fee">¥{{ item.freight || '0.00' }}</text>
						</view>
					</view>
				</view>
			</view>

			<view v-if="!loading && list.length === 0" class="empty-tip">暂无司机数据</view>
			<view v-if="loadStatus=='noMore'" class="no-more-tip">没有更多了</view>
		</scroll-view>
	</view>
</template>

<script>
// Script 部分逻辑无需大幅改动，确保 getStatusText 方法存在即可
export default {
	data() {
		return {
			keyword: '',
			list: [],       
			allList: [],    
			loadStatus: "",
			page: 1,
			limit: 10,
			loading: false // 确保 data 中有 loading 字段
		};
	},
	onLoad() {
		this.getLst();
	},
	methods: {
		getStatusText(status) {
			const map = {
				1: '未发车',
				2: '在途中',
				3: '请假',
				'': '未知' 
			};
			return map[status] !== undefined ? map[status] : '未知';
		},
		getLst() {
			this.loading = true;
			// 模拟请求，实际请使用您的 uni.$u.http
			uni.$u.http.post("/api/user/getManagerDriver", {
				page: this.page,
				limit: this.limit,
				keyword: this.keyword
			}).then(res => {
				if (res.code == 1) {
					const _list = res.data.lists || [];
					if (this.page === 1) {
						this.allList = _list;
					} else {
						this.allList = [...this.allList, ..._list];
					}
					
					this.list = this.allList;
					
					if (_list.length < this.limit) {
						this.loadStatus = 'noMore';
					} else {
						this.loadStatus = 'more';
						this.page++;
					}
				}
				this.loading = false;
			}).catch(err => {
				this.loading = false;
				uni.showToast({ title: '网络错误', icon: 'none' });
			});
		},
		handleSearch() {
			this.page = 1;
			this.getLst();
		},
		loadMore() {
			if (this.loadStatus === 'more' && !this.loading) {
				this.getLst();
			}
		},
		handleDetail(item) {
			uni.navigateTo({
				url: `/pages/yewu/yunyin/carer-detail?id=${item.id}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	padding: 20rpx;
	background-color: #f5f5f5;
	min-height: 100vh;
}

.search-bar {
	display: flex;
	align-items: center;
	background-color: #fff;
	padding: 10rpx 20rpx;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
	
	.search-input {
		flex: 1;
		font-size: 28rpx;
		height: 60rpx;
	}
	
	.search-btn {
		margin-left: 20rpx;
		color: #007aff;
		font-size: 28rpx;
	}
}

.list-container {
	height: calc(100vh - 140rpx);
}

.carer-item {
	background-color: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.item-header {
		display: flex;
		align-items: center;
		// 移除了底部的 border 和 margin，因为布局变了，看起来更整体
		margin-bottom: 15rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			background-color: #eee;
		}

		.info {
			flex: 1;
			.name-row {
				display: flex;
				align-items: center;
				
				.nickname {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-right: 20rpx;
				}
				
				.mobile {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

	.trip-info {
		background-color: #fafafa;
		border-radius: 8rpx;
		padding: 15rpx;
		
		// 第一排：路线
		.route-row {
			display: flex;
			align-items: center;
			margin-bottom: 15rpx;
			font-size: 28rpx;
			
			.location {
				flex: 1;
				color: #333;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				
				&.start {
					text-align: left;
				}
				
				&.end {
					text-align: right;
				}
			}
			
			.arrow {
				margin: 0 10rpx;
				color: #999;
				font-weight: bold;
				font-size:30rpx;
			}
		}
		
		// 第二排：状态和运费
		.bottom-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 26rpx;
			
			.status-wrapper {
				display: flex;
				align-items: center;
				
				.label {
					color: #999;
					margin-right: 10rpx;
				}
				
				.status-tag {
					padding: 4rpx 12rpx;
					border-radius: 4rpx;
					font-size: 22rpx;
					
					// 状态颜色映射 (根据您的需求调整类名对应颜色)
					&.status-1 { // 未发车
						background-color: #e6f7ff;
						color: #1890ff;
						border: 1rpx solid #91d5ff;
					}
					
					&.status-2 { // 在途中
						background-color: #f6ffed;
						color: #52c41a;
						border: 1rpx solid #b7eb8f;
					}
					
					&.status-3 { // 请假
						background-color: #fff1f0;
						color: #ff4d4f;
						border: 1rpx solid #ffa39e;
					}
					
					&.status-0, &.status-unknown {
						background-color: #f5f5f5;
						color: #999;
						border: 1rpx solid #ddd;
					}
				}
			}
			
			.fee-wrapper {
				display: flex;
				align-items: center;
				
				.label {
					color: #999;
					margin-right: 10rpx;
				}
				
				.fee {
					color: #ff4d4f;
					font-weight: bold;
					font-size: 30rpx;
				}
			}
		}
	}
}

.loading-tip, .empty-tip, .no-more-tip {
	text-align: center;
	padding: 30rpx;
	color: #999;
	font-size: 28rpx;
}
</style>