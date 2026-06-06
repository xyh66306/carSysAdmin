<template>
	<view class="content">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<input class="search-input" type="text" v-model="keyword" placeholder="搜索司机姓名或手机号"
				@confirm="handleSearch" />
			<view class="search-btn" @click="handleSearch">搜索</view>
		</view>

		<!-- 司机列表 -->
		<scroll-view scroll-y class="list-container" @scrolltolower="loadMore">
			<view v-if="loading && list.length === 0" class="loading-tip">加载中...</view>

			<view v-for="(item, index) in list" :key="item.id" class="carer-item">
				<!-- 头部：头像与基本信息 -->
				<view class="item-header">
					<image class="avatar" :src="item.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
					<view class="info">
						<view class="name-row">
							<text class="nickname">{{ item.nickname }}</text>
							<text class="mobile">{{ item.mobile }}</text>
						</view>
<!-- 						<view class="status-row">
							<text class="status-tag clickable" :class="'status-' + item.car_status"
								@click="openStatusPopup(item)">
								{{ getStatusText(item.car_status) }}
							</text>
						</view> -->
					</view>
				</view>
				<!-- 行程信息区域 (优化版) -->
				<view class="trip-card">
					<!-- 左侧装饰线 -->
					<view class="trip-line"></view>

					<!-- 替换原有的 .trip-content 内部结构 -->
					<view class="trip-content">
						<!-- 上半部分：地点横排 -->
						<view class="trip-route-row">
							<!-- 始发地 -->
							<view class="route-point start">
								<text class="point-value">{{ item.start_city || '未知地点' }}</text>
							</view>
							<!-- 中间箭头 -->
							<view class="route-arrow">
								<text class="arrow-icon">➜</text>
							</view>
							<!-- 目的地 -->
							<view class="route-point end">
								<text class="point-value">{{ item.end_city || '未知地点' }}</text>
							</view>
						</view>
						<!-- 下半部分：运费栏 (保持原样或微调) -->
						<view class="trip-footer">
							<view class="fee-box">
								<text class="fee-label">运费总额</text>
								<text class="fee-value">¥{{ item.money || '0.00' }}</text>
							</view>
							
							<view class="status-row">
								<text class="status-tag clickable" :class="'status-' + item.car_status"
									@click="openStatusPopup(item)">
									{{ getStatusText(item.car_status) }}
								</text>
							</view>							
							
						</view>
					</view>
				</view>

			</view>

			<view v-if="!loading && list.length === 0" class="empty-tip">暂无司机数据</view>
			<view v-if="loadStatus=='noMore'" class="no-more-tip">没有更多了</view>
		</scroll-view>

		<!-- uview-ui 弹框 -->
		<u-popup :show="showPopup" mode="center" border-radius="20">
			<view class="popup-container">
				<view class="popup-title">修改司机状态</view>
				<view class="popup-content">
					<u-radio-group v-model="tempStatus" placement="row" shape="square">
						<u-radio v-for="(label, value) in statusOptions" :key="value" :name="value"
							active-color="#2979ff" style="margin-right: 10rpx;">
							{{ label }}
						</u-radio>
					</u-radio-group>
				</view>
				<view class="popup-footer">
					<u-button :hairline="true" :plain="false" @click="showPopup = false">取消</u-button>
					<u-button type="primary" @click="confirmStatus">确定</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword: '',
				list: [],
				allList: [],
				loadStatus: "",
				page: 1,
				limit: 10,
				loading: false,

				// 弹框相关数据
				showPopup: false, // 控制弹框显示
				currentDriver: null, // 当前正在操作的司机对象
				tempStatus: 1, // 弹框内临时选中的状态值
				statusOptions: { // 状态选项配置
					1: '未发车',
					2: '在途中',
					3: '请假'
				}
			};
		},
		onLoad() {
			this.getLst();
		},
		methods: {
			// 获取状态文本
			getStatusText(status) {
				return this.statusOptions[status] || '未知';
			},

			// 打开弹框
			openStatusPopup(item) {
				this.currentDriver = item;
				this.tempStatus = item.car_status; // 初始化选中当前状态
				this.showPopup = true;
			},

			// 确认修改状态
			confirmStatus() {
				if (!this.currentDriver) return;

				const newStatus = this.tempStatus;
				const oldStatus = this.currentDriver.car_status;

				// 如果状态没变，直接关闭
				if (newStatus == oldStatus) {
					this.showPopup = false;
					return;
				}

				uni.showLoading({
					title: '处理中...'
				});

				uni.$u.http.post("/api/user/updateCarerStatus", {
					carer_id: this.currentDriver.id,
					status: newStatus
				}).then(res => {
					uni.hideLoading();
					if (res.code == 1) {
						uni.$u.toast('修改成功');
						this.showPopup = false;
						// 局部更新列表中的状态，避免重新请求整个列表
						const target = this.list.find(i => i.id === this.currentDriver.id);
						if (target) {
							target.car_status = newStatus;
						}
						// 也可以选择不刷新，直接改变视图，但为了数据一致性，建议更新本地数据或重新请求
					} else {
						uni.$u.toast(res.msg || '修改失败');
					}
				}).catch(err => {
					uni.hideLoading();
					uni.$u.toast('网络请求错误');
				});
			},

			// 获取列表数据
			getLst() {
				this.loading = true;
				uni.$u.http.post("/api/user/getManagerDriver", {
					page: this.page,
					limit: this.limit,
					keyword: this.keyword
				}).then(res => {
					this.loading = false;
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
				}).catch(err => {
					this.loading = false;
					uni.$u.toast('网络请求错误');
				});
			},

			handleSearch() {
				this.page = 1;
				this.allList = [];
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
					flex-direction: column;
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

				.status-row {
					display: flex;
					align-items: center;
					font-size: 24rpx;

					.label {
						color: #666;
					}

					.status-tag {
						padding: 4rpx 12rpx;
						border-radius: 4rpx;
						font-size: 22rpx;

						&.clickable {
							/* 提示可点击 */
							position: relative;

							&::after {
								content: '';
								position: absolute;
								right: -15rpx;
								top: 50%;
								transform: translateY(-50%);
								border-top: 4rpx solid transparent;
								border-bottom: 4rpx solid transparent;
								border-left: 4rpx solid #999;
							}
						}

						&.status-1 {
							background-color: #e6f7ff;
							color: #1890ff;
							border: 1rpx solid #91d5ff;
						}

						&.status-2 {
							background-color: #f6ffed;
							color: #52c41a;
							border: 1rpx solid #b7eb8f;
						}

						&.status-3 {
							background-color: #fff1f0;
							color: #ff4d4f;
							border: 1rpx solid #ffa39e;
						}
					}
				}

		/* 在 .trip-card 样式块中更新或替换以下样式 */

		.trip-card {
			position: relative;
			background-color: #f8f9fa;
			border-radius: 12rpx;
			padding: 20rpx;
			/* 调整内边距，不再需要左侧特殊留白 */
			margin-top: 10rpx;

			/* 移除旧的 .trip-line, .trip-connector 等垂直布局相关样式 */

			.trip-content {
				display: flex;
				flex-direction: column;

				/* 新增：横向路线行 */
				.trip-route-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 100%;
					margin-bottom: 15rpx;
					/* 与底部运费栏的间距 */

					.route-point {
						flex: 1;
						display: flex;
						flex-direction: column;
						min-width: 0;
						/* 防止文本溢出撑开容器 */

						&.start {
							align-items: flex-start;
							padding-right: 10rpx;
						}

						&.end {
							align-items: flex-end;
							padding-left: 10rpx;
						}

						.point-label {
							font-size: 20rpx;
							color: #999;
							margin-bottom: 4rpx;

							/* 可选：给始/终加个小背景标 */
							// background: #eee;
							// padding: 2rpx 6rpx;
							// border-radius: 4rpx;
						}

						.point-value {
							font-size: 28rpx;
							color: #333;
							font-weight: 500;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							max-width: 100%;
						}
					}

					.route-arrow {
						flex-shrink: 0;
						padding: 0 10rpx;
						color: #ccc;
						font-size: 32rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						.arrow-icon {
							font-size:50rpx;
						}
					}
				}

				/* 底部运费栏样式保持基本不变，确保对齐 */
				.trip-footer {
					padding-top: 15rpx;
					border-top: 1rpx dashed #eee;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.fee-box {
						display: flex;
						align-items: baseline;

						.fee-label {
							font-size: 24rpx;
							color: #666;
							margin-right: 10rpx;
						}

						.fee-value {
							font-size: 32rpx;
							color: #ff4d4f;
							font-weight: bold;
						}
					}
				}
			}
		}
	}

	/* 弹框内部样式 */
	.popup-container {
		width: 600rpx;
		padding: 0;
		background-color: #fff;

		.popup-title {
			padding: 30rpx;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			border-bottom: 1rpx solid #f0f0f0;
		}

		.popup-content {
			padding: 40rpx 30rpx;
			min-height: 200rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			border-bottom: 1rpx solid #f0f0f0;
		}

		.popup-footer {
			display: flex;
			padding: 20rpx 30rpx 30rpx;

			.u-button {
				flex: 1;
				margin: 0 10rpx;
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
			}
		}
	}

	.loading-tip,
	.empty-tip,
	.no-more-tip {
		text-align: center;
		padding: 30rpx;
		color: #999;
		font-size: 28rpx;
	}
</style>