<template>
	<view class="content">
		<u--form labelPosition="top" >
			<u-form-item labelWidth='80' label="卸货照片" borderBottom>
				
			</u-form-item>
			<u-form-item labelWidth='80' label="回单照片" borderBottom>
				
			</u-form-item>	
			<view class="fahuodi_tit flex">
				<view class="title2 currAdress">始发地</view>
				<view class="title2">目的地</view>
			</view>
			<view class="fahuodi flex">
				<view class="startCity currAdress">
					<u--input
						placeholder="请输入始发地"
						v-model="start_city"
						border="bottom"
					 ></u--input>
				</view>
				<view>
					<u--input
					  placeholder="请输入目的地"
					  v-model="end_city"
					  border="bottom"
					></u--input>
				</view>
			</view>						
			<u-form-item labelWidth='80' label="业务经理" borderBottom>
				<u--input
					v-model="signForm.yewu"
					disabled
					disabledColor="#ffffff"
					placeholder="请选择业务经理"
					border="none"
				></u--input>
			</u-form-item>
			<u-form-item labelWidth='80' label="毛运费" borderBottom>
				<u--input
						v-model="signForm.money"
						placeholder="请输入毛运费"
						border="none"
				></u--input>
			</u-form-item>	
					
				
		</u--form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			fileListxiehuo: [],
			fileListhuidan: [],
			start_city:'',
			end_city:'',
			signForm: {
				yewu: '',
				xiehuo_images: '',
				money:''
			}
		};
	},
	onLoad() {

	},
	methods: {

	}
};
</script>


<style lang="scss" scoped>
	page {
		background: #fff;
	}

	.content {
		padding: 0 32rpx;
	}


	.fahuodi_tit {
		width: 100%;
		text-align: center;
	}

	.title2 {
		width: 50%;
		padding: 20rpx 0;
		border-bottom: 1px solid rgb(214, 215, 217);
		position: relative;
	}

	.fahuodi_box {
		padding: 20rpx 0;
		position: relative;
		font-size: 24rpx !important;
	}
	.startCity {
		position: relative;
	}
	.currAdress::after {
	  position: absolute;
	  right:0rpx;
	  top:50%;
	  width:2rpx;
	  height:50rpx;
	  background-color: rgb(214, 215, 217);
	  content: "";
	  transform: translateY(-50%);
	}	
	
	.button {
		margin-top: 60rpx;
	}
</style>