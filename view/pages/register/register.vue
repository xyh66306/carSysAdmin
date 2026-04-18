<template>
	<view class="page">
		<u-navbar
			title="注册"
			@rightClick="rightClick"
			:bgColor="bgColor"
			:titleStyle ="titleStyle"
			:autoBack="true"
			leftIconColor="#fff"
		>
		</u-navbar>
		<view class="form">
			<u--form labelPosition="top" :model="loginForm" :rules="rules" ref="loginForm" labelWidth="auto">
				<u-form-item label="类型"  borderBottom  @tap="typeShow=true">
					<u--input v-model="group_name" border="none" placeholder="请选择用户类型" suffixIcon="arrow-right"></u--input>
				</u-form-item>					
				<u-form-item label="车牌号：" prop="carnums" borderBottom ref="nickname" v-show="showCarNums"  @tap="plateShow=true">
					<u--input v-model="loginForm.carnums" border="none" placeholder="请输入车牌号" suffixIcon="arrow-right"></u--input>
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
		<plate-input v-if="plateShow" :plate="plateNo" @export="setPlate" @close="plateShow=false" />
		<u-picker :show="typeShow" :columns="columns" @change="changeHandler" @confirm="confirm"></u-picker>
		
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
				typeShow: false,
                columns: [
                    ['司机', '业务员']
                ],				
                plateNo:'',
                plateShow:false,				
				titleStyle:"color:#fff",
				showCarNums:false,
				bgColor:"#6051f6",
				group_name:'',
				loginForm: {
					group_id:'',
					carnums:"",
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
		methods: {
			changeHandler(e){
				const {
					columnIndex,
					value,
					values, // values为当前变化列的数组内容
					index,
					// 微信小程序无法将picker实例传出来，只能通过ref操作
					picker = this.$refs.uPicker
				} = e
				console.log(e.value)
				
			},
			confirm(e) {
				let group_id =  parseInt(e.indexs)+1			
				this.loginForm.group_id =group_id	
				if(group_id==1){
					this.showCarNums = true
				}else{
					this.showCarNums = false
				}		
				this.group_name = e.value[0]
                this.typeShow = false
			},			
            setPlate(plate){
                if(plate.length >= 7) this.loginForm.carnums = plate
                this.plateShow = false
            },			
			goTologin(){
				uni.navigateBack()
			},
			register() {
				if(!this.loginForm.group_id){
					return uni.$u.toast('请选择用户组别');
				}
				if(this.loginForm.group_id==1 && !this.loginForm.carnums){
					return uni.$u.toast('请输入车牌号');
				}
				this.$refs.loginForm.validate().then(res => {
					uni.$u.http.post('/api/user/register', this.loginForm).then(res => {
						if(res.code==1){
							uni.$u.toast('注册成功，审核中');
							uni.redirectTo({
								url:"/pages/login/login"
							})	
						}else{
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
	.loginbtn {
		
	}
	.goLogin {
		margin-top: 40rpx;
		padding-left:20rpx;
		text-align: left;
		font-size: 28rpx;
	}
	
	.loginFont {
		color:$u-primary
	}
</style>