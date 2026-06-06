<template>
	<view>
		<view class="content">
			<u-collapse @change="change" @close="close" @open="open">
				<u-collapse-item v-for="(vo,index) in lst" :key="vo.id" :name="vo.id">
					<view slot="title" class="u-item">
						<u-avatar :src="vo.avatar"></u-avatar>
						<view class="nickname">{{vo.nickname}}<!-- 【{{statusArr[vo.car_status]}}】 --></view>
					</view>
					<view class="u-collapse-content">
						<view class="u-collapse-content__title">手机号：{{vo.mobile}}</view>
						<view class="u-collapse-content__title">车牌号：{{vo.carnums}}</view>
						<view class="u-collapse-content__title">车型：{{type[vo.youdian]}}</view>
						<view class="u-collapse-content__del" @click="del(vo)">删除</view>
					</view>
				</u-collapse-item>
					
			</u-collapse>
		</view>

		<view class="btn">
			<u-button type="warning" @click="addCarer" text="新增司机"></u-button>
		</view>
		<u-modal :show="delshow" :showConfirmButton="true" @cancel="delcancel" :showCancelButton="true" @confirm="delconfirm" :content="delContent" ref="uModal" :asyncClose="true"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lst: [],
				type:["油车","电车"],
				statusArr:["未发车","在途中","请假"],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					},
				}],
				delId:'',
				delContent:'',
				delshow:false,
				loadStatus: 'more',
				page: 1,
				limit: 10				
			};
		},
		onShow() {
			this.lst =[];
			this.getLst()
		},
		methods: {
            open(e) {
              // console.log('open', e)
            },
            close(e) {
              // console.log('close', e)
            },
            change(e) {
              // console.log('change', e)
            },	
			delcancel(){
				this.delId = "";
				this.delContent = '';
				this.delshow = false;
			},
			showModal() {
				this.delshow = true;
			},
			delconfirm() {
				if(!this.delId){
					return uni.$u.toast("请选择司机");
				}
				uni.$u.http.post("/api/user/delManagerDriver",{
					carer_id:this.delId
				}).then(res => {
					if (res.code == 1) {
						this.getLst();
						setTimeout(() => {
							this.delcancel();
						}, 500)
					}else{
						uni.$u.toast(res.msg)
					}
				})				

			},			
			del(item){
				this.delId = item.id;
				this.delContent = '确认删除"'+item.nickname+'"吗？';
				this.showModal();
			},
			addCarer() {
				uni.navigateTo({
					url: '/pages/yewu/carer/add'
				})
			},
			getLst() {
				uni.$u.http.post("/api/user/getManagerDriver",{
					page:this.page,
					limit:this.limit,
				}).then(res => {
					if (res.code == 1) {
						const _list = res.data.lists;
						this.lst = [...this.lst, ..._list];
						if (res.data.count > this.lst.length) {
							this.loadStatus = 'more';
							this.page++;
						} else {
							// 数据已加载完毕
							this.loadStatus = 'noMore';
						}
					}
				})
			},
		},
		onReachBottom() {
			if (this.loadStatus === 'more') {
				this.getLst();
			}
		}		
	};
</script>

<style lang="scss">
	.u-page {
		padding: 0;
	}
	.content {
		background-color: #fff;
	}
	::v-deep .u-item {
		width: 100%;
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		.nickname {
			margin-left: 20rpx;
			font-size: 32rpx;
			color: #333;
		}	
	}
	::v-deep .content-class{
		padding: 0rpx;
	}
	::v-deep .u-collapse-content {
		padding:20rpx 0 0rpx 40rpx;
		position: relative;
		&__title {
			padding: 10rpx 0;
		}
		&__del {
			position: absolute;
			top: 0;
			right: 0;
			width: 130rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #f56c6c;
			color: #fff;
		}
	}
	.btn {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.u-demo-block__title {
		padding: 10px 0 2px 15px;
	}

	.swipe-action {
		&__content {
			padding: 25rpx 0;

			&__text {
				font-size: 15px;
				color: $u-main-color;
				padding-left: 30rpx;
			}
		}
	}
</style>