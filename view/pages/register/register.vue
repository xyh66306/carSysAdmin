<template>
	<view class="page">
		<u-navbar title="注册" @rightClick="rightClick" :bgColor="bgColor" :titleStyle="titleStyle" :autoBack="true"
			leftIconColor="#fff">
		</u-navbar>
		<view class="form">
			<u--form labelPosition="top" :model="loginForm" :rules="rules" ref="loginForm" labelWidth="auto">
				<u-form-item label="归属城市" borderBottom @tap="typeShow=true">
					<u--input v-model="city_name" border="none" placeholder="请选择归属城市"
						suffixIcon="arrow-right"></u--input>
				</u-form-item>
				<u-form-item label="类型" borderBottom>
					<u-radio-group v-model="radiovalue1" placement="row">
						<u-radio :customStyle="{marginRight: '8px'}" v-for="(item, index) in radiolist1" :key="index"
							:label="item.name" :name="item.value" @change="radioChange">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="车牌号：" prop="carnums" borderBottom ref="nickname" v-show="showCarNums"
					@tap="plateShow=true">
					<u--input v-model="loginForm.carnums" border="none" placeholder="请输入车牌号"
						suffixIcon="arrow-right"></u--input>
				</u-form-item>
				<u-form-item label="用户名" prop="nickname" borderBottom ref="nickname">
					<u--input v-model="loginForm.nickname" border="none" placeholder="请输入用户名"></u--input>
				</u-form-item>
				<u-form-item label="手机号" prop="mobile" borderBottom ref="mobile">
					<u--input v-model="loginForm.mobile" border="none" placeholder="请输入手机号"></u--input>
				</u-form-item>
				<u-form-item label="密码" prop="password" borderBottom ref="password">
					<u--input type="password" v-model="loginForm.password" border="none" placeholder="密码为6位以上字母和数字"
						maxlength="16"></u--input>
				</u-form-item>
				<!-- -->
			</u--form>
		</view>
		<u-button type="primary" @click="register" shape="circle">注册</u-button>
		<view class="goLogin font24" @click="goTologin()">已有账户，<text class="loginFont">登录</text>一个</view>
		<plate-input v-if="plateShow" :plate="plateNo" @type="carType" @export="setPlate" @close="plateShow=false" />
		<u-picker :show="typeShow" keyName="cityname" :columns="openCity" @cancel="cancel" @confirm="confirm"></u-picker>

	</view>
</template>

<script>
	import plateInput from '@/components/uni-plate-input/uni-plate-input.vue'
	export default {
		components: {
			plateInput
		},
		data() {
			return {
				radiolist1: [
					{
						name: '司机',
						value:1,
						disabled: false
					},
					{
						name: '业务员',
						value:2,
						disabled: false
					},
				],
				radiovalue1: 1,
				typeShow: false,
				openCity: [],
				plateNo: '',
				plateShow: false,
				titleStyle: "color:#fff",
				showCarNums: true,
				bgColor: "#6051f6",
				city_name: '',
				loginForm: {
					youdian:'',	//1油车 2电车
					city_id:'',
					group_id: 1,
					carnums: "",
					nickname: '',
					mobile: '',
					password: '',
				},
				rules: {
					mobile: [{
						required: true,
						message: '请输入手机号',
						trigger: ['blur', 'change']
					}, {
						type: 'number',
						len: 11,
						message: '手机号格式错误',
						trigger: ['blur']
					}, ],

					password: [{
						required: true,
						message: '请输入密码',
						trigger: ['blur', 'change']
					}, {
						min: 6,
						message: '密码至少6位',
						trigger: ['blur']
					}, ],
					nickname: [{
						required: true,
						message: '请输入用户名',
						trigger: ['blur', 'change']
					}],
				},
				tips: '',
			}
		},
		onLoad() {
			this.getOpenCity();
		},
		methods: {
			radioChange(n) {
				if (n == 1) {
					this.showCarNums = true
				} else {
					this.showCarNums = false
				}
				this.loginForm.group_id =n
			},
			confirm(e) {
				this.loginForm.city_id = e.value[0]['id']
				this.city_name = e.value[0]['cityname']
				this.typeShow = false
			},
			cancel(){
				this.typeShow = false
			},
			carType(e){
				this.loginForm.youdian = e
			},
			setPlate(plate) {
				if (plate.length >= 7) this.loginForm.carnums = plate
				this.plateShow = false
			},
			goTologin() {
				uni.navigateBack()
			},
			getOpenCity(){
				uni.$u.http.post('/api/city/index', {}).then(res => {
					if (res.code == 1) {						
						this.openCity = [res.data]
					}
				}).catch(res => {
					uni.$u.toast(res.msg);
				});
			},
			register() {
				if (!this.loginForm.group_id) {
					return uni.$u.toast('请选择用户组别');
				}
				if (this.loginForm.group_id == 1 && !this.loginForm.carnums) {
					return uni.$u.toast('请输入车牌号');
				}
				this.$refs.loginForm.validate().then(res => {
					uni.$u.http.post('/api/user/register', this.loginForm).then(res => {
						if (res.code == 1) {
							uni.$u.toast('注册成功，审核中');
							uni.redirectTo({
								url: "/pages/login/login"
							})
						} else {
							uni.$u.toast(res.msg);
						}
					}).catch(res => {
						uni.$u.toast(res.msg);
						console.log(res);
					});
				}).catch(res => {})
			},
			codeChange(text) {
				this.tips = text;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		width: 100vw;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 88rpx 60rpx 100rpx;
		background-color: #fff;
	}

	.welcome {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 60rpx;
	}

	.form {
		margin-bottom: 80rpx;
	}

	::v-deep .u-upload__button {
		background-color: #fff;
	}

	.loginbtn {}

	.goLogin {
		margin-top: 40rpx;
		padding-left: 20rpx;
		text-align: left;
		font-size: 28rpx;
	}

	.loginFont {
		color: $u-primary
	}
</style>