<template>
	<view class="page">
		<u-navbar
			title="注册"
			:bgColor="bgColor"
			:titleStyle ="titleStyle"
			:autoBack="false"
			leftIconColor="#fff"
		>
		</u-navbar>
		<view class="form">
			<u--form labelPosition="top" :model="loginForm" :rules="rules" ref="loginForm">
				<u-form-item label="账号" prop="account" borderBottom ref="account">
					<u--input v-model="loginForm.account" border="none" placeholder="请输入手机号"></u--input>
				</u-form-item>
				<u-form-item label="密码" prop="password" borderBottom ref="password">
					<u--input type="password" v-model="loginForm.password" border="none"
						placeholder="请输入登录密码"></u--input>
				</u-form-item>
			</u--form>
		</view>
		<u-button type="primary" @click="login" shape="circle">登录</u-button>
		<view class="bottom flex">
			<view class="xieyi font24 flex">
				<view class="authCheck" @click="checked()">
					<u-icon name="checkmark" size="16" v-if="xieyi"></u-icon>
				</view>
				同意<text>《用户协议》</text>和<text>《隐私政策》</text>
			</view>
			<view class="right" @click="goTopage('/pages/register/register')">
				立即注册
			</view>
		</view>

		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				xieyi:false,
				bgColor:"#6051f6",
				titleStyle:"color:#fff",
				loginForm: {
					account: '',
					password: ''
				},
				rules: {
					'account': {
						type: 'string',
						required: true,
						message: '请输入手机号',
						trigger: ['blur', 'change']
					},
					'password': {
						type: 'string',
						required: true,
						message: '请输入登录密码',
						trigger: ['blur', 'change']
					},
				},
				user: {},
				show: false,
				code: '',
			}
		},
		methods: {
			checked(){
				this.xieyi = !this.xieyi;
			},
			goTopage(url){
				uni.navigateTo({
					url:url
				})
			},
			login() {
				this.$refs.loginForm.validate().then(res => {
					uni.$u.http.post('/api/user/login', this.loginForm).then(res => {
						if (res.code == 1) {
							this.user = res.data.userinfo;
							this.loginSuccess();
						} else {
							uni.$u.toast(res.msg);
						}
					})
				})
			},
			loginSuccess() {
				uni.setStorageSync('token', this.user.token);
				uni.setStorageSync('user', this.user);
				uni.setStorageSync('user_group', this.user.group_id);
				uni.redirectTo({
					url: '/pages/index/index'
				})
			}	
		}
	}
</script>

<style lang="scss">
	.page {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 30rpx 60rpx 30vh;
	}

	.welcome {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 60rpx;
	}

	.form {
		margin-bottom: 80rpx;
	}
	
	.google {
		width: 80vw;
		padding: 60rpx;
		
		.head {
			text-align: center;
			font-size: 18px;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		
		.code {
			margin-bottom: 30rpx;
		}
	}
	
	.xieyi {
		justify-content: center;
		align-items: center;
		text {
			color:$u-primary
		}
		.authCheck {
			width:36rpx;
			height: 36rpx;
			border-radius: 36rpx;
			overflow: hidden;
			border: 3rpx solid #999;
			margin-right: 10rpx;
			text-align: center;
			line-height: 36rpx;
			font-size: 20rpx;
		}
	}
	
	.bottom {
		display: flex;
		justify-content: space-between;
		line-height: 60rpx;
		height:60rpx;
		margin-top: 30rpx;
		font-size: 28rpx;
		color:#555;
	}
</style>