<template>
	<view class="content">
		<u--form labelPosition="top" >
			<u-form-item labelWidth='80' label="报销类型" borderBottom>
				<template v-if="details.type<4">
					<u--input
							v-model="details.type_text"
							disabled
							disabledColor="#ffffff"
							border="none"
					></u--input>
				</template>
				<template v-else>
					<u--input
							v-model="details.content"
							disabled
							disabledColor="#ffffff"
							border="none"
					></u--input>
				</template>
			</u-form-item>	
			<u-form-item labelWidth='80' label="报销金额" borderBottom>
				<u--input
					v-model="details.money"
					disabled 
					disabledColor="#ffffff"
					border="none"
				></u--input>
			</u-form-item>							
			<u-form-item labelWidth='80' label="报销凭证" borderBottom>
				<view class="flexImg">
					<u--image :showLoading="true" :src="src" width="80px" height="80px" class="img"
						v-for="(src, index) in details.bx_images" :key="index" mode="aspectFill"></u--image>
				</view>
			</u-form-item>
			<u-form-item labelWidth='80' label="付款截图" borderBottom>
				<view class="flexImg">
					<u--image :showLoading="true" :src="src" width="80px" height="80px" class="img"
						v-for="(src, index) in details.pay_images" :key="index" mode="aspectFill"></u--image>
				</view>
			</u-form-item>
		</u--form>
	</view>
</template>

<script>
export default {
	data() {
		return {
			details: {}
		};
	},
	onLoad(e) {
		this.getDetails(e.id);
	},
	methods: {
		getDetails(id) {
			uni.$u.http.post('/api/baoxiao/detail', {
				id: id
			}).then(res => {
				if (res.code == 1) {
					this.details = res.data
				} else {
					uni.$u.toast(res.msg);
				}
			})
		}
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