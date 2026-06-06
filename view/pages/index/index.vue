<template>
	<view class="page">
		<template v-if="userInfo.group_id==1">
			<view class="items" @click="gotourl('/pages/driver/sign/index')">
				<view class="left">
					<view class="title">卸货打卡</view>
					<view class="desc">{{timeView}}</view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_01.jpg"></image>
				</view>
			</view>
			
			<view class="items" @click="gotourl('/pages/driver/sign/log')">
				<view class="left">
					<view class="title">卸货完成记录（司机账单）</view>
					<view class="desc red">*司机主动打卡才能生成账单</view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_03.jpg"></image>
				</view>
			</view>
			
			<view class="items" @click="gotourl('/pages/driver/baoxiao/index')">
				<view class="left">
					<view class="title">报销</view>
					<view class="desc">当日产生，必须当天报销</view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_02.jpg"></image>
				</view>
			</view>
			
			<view class="items" @click="gotourl('/pages/driver/baoxiao/log')">
				<view class="left">
					<view class="title">报销记录</view>
					<view class="desc"></view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_04.jpg"></image>
				</view>
			</view>
		</template>
		<template v-else>
			<view class="items" @click="gotourl('/pages/yewu/carer/list')">
				<view class="left">
					<view class="title">配载车辆(司机)</view>
					<view class="desc"></view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_01.jpg"></image>
				</view>
			</view>

			<view class="items" @click="gotourl('/pages/yewu/yunyin/carer')">
				<view class="left">
					<view class="title">运营数据</view>
					<view class="desc red"></view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_03.jpg"></image>
				</view>
			</view>

			<view class="items" @click="gotourl('/pages/yewu/kaidan/index')">
				<view class="left">
					<view class="title">受理开单</view>
					<view class="desc">当日产生，必须当天报销</view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_02.jpg"></image>
				</view>
			</view>

			<view class="items" @click="gotourl('/pages/yewu/baoxiao/log')">
				<view class="left">
					<view class="title">未核销订单</view>
					<view class="desc"></view>
				</view>
				<view class="right">
					<image src="/static/image/ybg_04.jpg"></image>
				</view>
			</view>
		</template>
		<view class="logout" @click="logout">
			退出
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timeView:'',
				userInfo:{},
			}
		},		
		onLoad() {},
		onShow() {
			this.getUserInfo();
			this.startTimer(); // 页面显示时启动定时器
		},		
		onHide() {
			this.stopTimer(); // 页面隐藏时停止定时器，节省资源
		},
		onUnload() {
			this.stopTimer(); // 页面卸载时清除定时器
		},		
		methods: {
			logout(){
				uni.clearStorageSync();
				uni.redirectTo({
					url: '/pages/login/login'
				})
			},
			getUserInfo() {
				uni.$u.http.post('/api/user/index').then(res => {
					if (res.code == 1) {
						this.userInfo = res.data;
					}
				})
			},
			gotourl(url){
				uni.navigateTo({
					url:url
				})
			},
			// 格式化时间函数
			formatTime(date) {
				const hour = date.getHours();
				const minute = date.getMinutes();
				// 补零操作，例如 9 -> 09
				const pad = (n) => n < 10 ? '0' + n : n;
				return `${pad(hour)}:${pad(minute)}`;
			},
			updateTime() {
				this.timeView = this.formatTime(new Date());
			},
			startTimer() {
				this.updateTime();
				if (this.timer) clearInterval(this.timer);
				this.timer = setInterval(() => {
					this.updateTime();
				}, 1000);
			},
			stopTimer() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
		padding: 0 36rpx;
	}

	.items {
		width: 100%;
		height: 210rpx;
		background-color: #f7f8fa;
		margin-top: 47rpx;
		display: flex;
		box-shadow: 0rpx 10rpx 10rpx 2rpx #f5f5f5;
	}

	.items .left {
		width: 540rpx;
		height: 210rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-left: 46rpx;
	}

	.items .left .title {
		font-size: 36rpx;
		font-weight: bold;
		color: #000;
	}

	.items .left .desc {
		font-size: 28rpx;
		margin-top: 20rpx;
		color: #949597;
	}

	.items .left .red {
		color: #f41c35 !important;
	}

	.items .right {
		width: 135rpx;
		height: 210rpx;
	}

	.items .right image {
		width: 100%;
		height: 100%;
	}
</style>